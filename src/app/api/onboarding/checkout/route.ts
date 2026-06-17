import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured, siteUrl } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

type PlanId = "standard" | "pro";

const PRICE_ENV_BY_PLAN: Record<PlanId, string[]> = {
  standard: ["STRIPE_PRICE_STANDARD_MONTHLY", "STRIPE_STANDARD_PRICE_ID"],
  pro: ["STRIPE_PRICE_PRO_MONTHLY", "STRIPE_PRO_PRICE_ID"],
};

function resolvePriceId(planId: PlanId): string | null {
  for (const key of PRICE_ENV_BY_PLAN[planId]) {
    const value = process.env[key];
    if (value) return value;
  }
  return null;
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    planId?: string;
    redirectTo?: string;
  };

  if (body.planId !== "standard" && body.planId !== "pro") {
    return NextResponse.json(
      { error: "有料プランを選択してください。" },
      { status: 400 },
    );
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe が未設定です。STRIPE_SECRET_KEY を設定してください。" },
      { status: 503 },
    );
  }

  const priceId = resolvePriceId(body.planId);
  if (!priceId) {
    return NextResponse.json(
      {
        error:
          "選択プランの Stripe Price ID が未設定です。STRIPE_PRICE_STANDARD_MONTHLY または STRIPE_PRICE_PRO_MONTHLY を設定してください。",
      },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe 初期化に失敗しました。" }, { status: 503 });
  }

  const base = siteUrl();
  const redirectTo =
    body.redirectTo && body.redirectTo.startsWith("/") && !body.redirectTo.startsWith("//")
      ? body.redirectTo
      : "/";

  await supabase.from("user_onboarding").upsert(
    {
      user_id: user.id,
      selected_plan: body.planId,
      payment_status: "pending",
    },
    { onConflict: "user_id" },
  );

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/auth/signup?checkout=success&plan=${body.planId}&redirect_to=${encodeURIComponent(redirectTo)}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/auth/signup?checkout=cancelled&plan=${body.planId}&redirect_to=${encodeURIComponent(redirectTo)}`,
    metadata: {
      kind: "subscription_onboarding",
      user_id: user.id,
      plan_id: body.planId,
    },
    subscription_data: {
      metadata: {
        user_id: user.id,
        plan_id: body.planId,
      },
    },
  });

  await supabase
    .from("user_onboarding")
    .update({ stripe_session_id: session.id })
    .eq("user_id", user.id);

  return NextResponse.json({ url: session.url });
}
