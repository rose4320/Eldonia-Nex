import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { PlanPaymentStatus, UserPlanId } from "@/lib/plans/types";

type ApplyPlanChangeInput = {
  userId: string;
  fromPlan: UserPlanId;
  toPlan: UserPlanId;
  paymentStatus: PlanPaymentStatus;
  changedVia: "signup" | "settings" | "admin" | "stripe_webhook";
  stripeSessionId?: string | null;
};

export async function applyPlanChange(
  supabase: SupabaseClient<Database>,
  input: ApplyPlanChangeInput,
) {
  const { error: onboardingError } = await supabase.from("user_onboarding").upsert(
    {
      user_id: input.userId,
      selected_plan: input.toPlan,
      payment_status: input.paymentStatus,
      stripe_session_id: input.stripeSessionId ?? null,
      completed_at:
        input.paymentStatus === "completed" || input.toPlan === "free"
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
    from_plan: input.fromPlan,
    to_plan: input.toPlan,
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
      plan: data.selected_plan,
      paymentStatus: data.payment_status ?? "not_required",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan")
    .eq("id", userId)
    .maybeSingle();

  return {
    plan: profile?.subscription_plan ?? "free",
    paymentStatus: "not_required",
  };
}
