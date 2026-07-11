import { NextResponse } from "next/server";
import { applyPlanChange, getCurrentUserPlan } from "@/lib/plans/apply-plan-change";
import { SKIP_PLAN_PAYMENTS } from "@/lib/plans/constants";
import { getPlanCatalogEntry } from "@/lib/plans/catalog";
import {
  isSelfServePaidPlan,
  isUserPlanId,
  parseUserPlanId,
  type UserPlanId,
} from "@/lib/plans/types";
import { createClient } from "@/lib/supabase/server";
import { syncDjangoUserFromSupabase } from "@/lib/django/sync-user";
import { getStripe, isStripeConfigured, siteUrl } from "@/lib/stripe/server";

const PRICE_ENV_BY_PLAN = {
  standard: ["STRIPE_PRICE_STANDARD_MONTHLY", "STRIPE_STANDARD_PRICE_ID"],
  premium: [
    "STRIPE_PRICE_PREMIUM_MONTHLY",
    "STRIPE_PREMIUM_PRICE_ID",
    "STRIPE_PRICE_PRO_MONTHLY",
    "STRIPE_PRO_PRICE_ID",
  ],
} as const;

function resolvePriceId(planId: "standard" | "premium"): string | null {
  for (const key of PRICE_ENV_BY_PLAN[planId]) {
    const value = process.env[key];
    if (value) return value;
  }
  return null;
}

async function applyImmediatePlanChange(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  fromPlan: UserPlanId,
  toPlan: UserPlanId,
  paymentStatus: "not_required" | "completed",
) {
  const result = await applyPlanChange(supabase, {
    userId,
    fromPlan,
    toPlan,
    paymentStatus,
    changedVia: "settings",
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await syncDjangoUserFromSupabase(user, { subscriptionPlan: toPlan });
  }

  return NextResponse.json({ ok: true, plan: toPlan });
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const current = await getCurrentUserPlan(supabase, user.id);
  return NextResponse.json(current);
}

export async function POST(request: Request) {
  const body = (await request.json()) as { planId?: string };
  const rawPlanId = body.planId ?? "";

  if (!isUserPlanId(rawPlanId) && rawPlanId !== "pro") {
    return NextResponse.json({ error: "プラン選択が不正です。" }, { status: 400 });
  }

  const planId = parseUserPlanId(rawPlanId);
  if (!planId) {
    return NextResponse.json({ error: "プラン選択が不正です。" }, { status: 400 });
  }

  const catalog = getPlanCatalogEntry(planId);
  if (catalog.checkout === "contact") {
    return NextResponse.json(
      {
        error: "Business プランはお問い合わせが必要です。",
        contactHref: "/help/contact",
      },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const current = await getCurrentUserPlan(supabase, user.id);

  if (current.plan === planId && current.paymentStatus !== "pending") {
    return NextResponse.json({ ok: true, plan: planId, unchanged: true });
  }

  if (planId === "free" || SKIP_PLAN_PAYMENTS) {
    return applyImmediatePlanChange(
      supabase,
      user.id,
      current.plan,
      planId,
      planId === "free" ? "not_required" : "completed",
    );
  }

  if (!isSelfServePaidPlan(planId)) {
    return NextResponse.json({ error: "このプランはオンライン決済に対応していません。" }, { status: 400 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe が未設定です。有料プランへの変更は現在利用できません。" },
      { status: 503 },
    );
  }

  const priceId = resolvePriceId(planId);
  if (!priceId) {
    return NextResponse.json(
      {
        error:
          "選択プランの Stripe Price ID が未設定です。管理者に STRIPE_PRICE_STANDARD_MONTHLY / STRIPE_PRICE_PREMIUM_MONTHLY を設定してください。",
      },
      { status: 503 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe 初期化に失敗しました。" }, { status: 503 });
  }

  const pending = await applyPlanChange(supabase, {
    userId: user.id,
    fromPlan: current.plan,
    toPlan: planId,
    paymentStatus: "pending",
    changedVia: "settings",
  });

  if (pending.error) {
    return NextResponse.json({ error: pending.error }, { status: 400 });
  }

  const base = siteUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/settings/plan?checkout=success&plan=${planId}`,
    cancel_url: `${base}/settings/plan?checkout=cancelled`,
    metadata: {
      kind: "subscription_settings",
      user_id: user.id,
      plan_id: planId,
      from_plan: current.plan,
    },
    subscription_data: {
      metadata: {
        user_id: user.id,
        plan_id: planId,
      },
    },
  });

  await supabase
    .from("user_onboarding")
    .update({ stripe_session_id: session.id })
    .eq("user_id", user.id);

  if (!session.url) {
    return NextResponse.json({ error: "決済セッションの作成に失敗しました。" }, { status: 502 });
  }

  return NextResponse.json({
    url: session.url,
    plan: planId,
    requiresPayment: isSelfServePaidPlan(planId),
  });
}
