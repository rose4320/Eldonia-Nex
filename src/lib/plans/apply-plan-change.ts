import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { normalizePlanId } from "@/lib/plans/catalog";
import type { PlanPaymentStatus, UserPlanId } from "@/lib/plans/types";

type ApplyPlanChangeInput = {
  userId: string;
  fromPlan: UserPlanId;
  toPlan: UserPlanId;
  paymentStatus: PlanPaymentStatus;
  changedVia: "signup" | "settings" | "admin" | "stripe_webhook" | "sync";
  stripeSessionId?: string | null;
};

export async function applyPlanChange(
  supabase: SupabaseClient<Database>,
  input: ApplyPlanChangeInput,
) {
  const fromPlan = normalizePlanId(input.fromPlan);
  const toPlan = normalizePlanId(input.toPlan);

  // Archive previous assignment (no hard delete of history)
  if (fromPlan !== toPlan) {
    const [{ data: onboarding }, { data: profile }] = await Promise.all([
      supabase
        .from("user_onboarding")
        .select("selected_plan, payment_status, stripe_session_id")
        .eq("user_id", input.userId)
        .maybeSingle(),
      supabase.from("profiles").select("subscription_plan").eq("id", input.userId).maybeSingle(),
    ]);

    await supabase.from("user_plan_assignment_archives").insert({
      user_id: input.userId,
      plan_slug: fromPlan,
      payment_status: onboarding?.payment_status ?? input.paymentStatus,
      snapshot: {
        from_plan: fromPlan,
        to_plan: toPlan,
        onboarding,
        profile_subscription_plan: profile?.subscription_plan ?? null,
        changed_via: input.changedVia,
      },
      archived_reason: "plan_changed",
      archived_by: input.changedVia,
    });
  }

  const { error: onboardingError } = await supabase.from("user_onboarding").upsert(
    {
      user_id: input.userId,
      selected_plan: toPlan,
      payment_status: input.paymentStatus,
      stripe_session_id: input.stripeSessionId ?? null,
      completed_at:
        input.paymentStatus === "completed" || toPlan === "free"
          ? new Date().toISOString()
          : null,
    },
    { onConflict: "user_id" },
  );

  if (onboardingError) {
    return { error: onboardingError.message };
  }

  const { error: auditError } = await supabase.from("user_plan_changes").insert({
    user_id: input.userId,
    from_plan: fromPlan,
    to_plan: toPlan,
    payment_status: input.paymentStatus,
    stripe_session_id: input.stripeSessionId ?? null,
    changed_via: input.changedVia,
  });

  if (auditError) {
    return { error: auditError.message };
  }

  return { error: null };
}

export async function getCurrentUserPlan(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<{ plan: UserPlanId; paymentStatus: PlanPaymentStatus }> {
  const { data } = await supabase
    .from("user_onboarding")
    .select("selected_plan, payment_status")
    .eq("user_id", userId)
    .maybeSingle();

  if (data?.selected_plan) {
    return {
      plan: normalizePlanId(data.selected_plan),
      paymentStatus: data.payment_status ?? "not_required",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan")
    .eq("id", userId)
    .maybeSingle();

  return {
    plan: normalizePlanId(profile?.subscription_plan),
    paymentStatus: "not_required",
  };
}
