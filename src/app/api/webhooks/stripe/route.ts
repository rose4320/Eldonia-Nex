import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/server";

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json({ error: "Webhook secret missing" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const admin = createAdminClient();

    if (admin) {
      await admin
        .from("orders")
        .update({
          status: "paid",
          stripe_payment_intent:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
        })
        .eq("stripe_session_id", session.id);

      if (session.metadata?.kind === "subscription_onboarding") {
        await admin
          .from("user_onboarding")
          .update({
            selected_plan:
              session.metadata.plan_id === "standard" || session.metadata.plan_id === "pro"
                ? session.metadata.plan_id
                : "free",
            payment_status: "completed",
            stripe_session_id: session.id,
          })
          .eq("user_id", session.metadata.user_id);
      }
    }
  }

  return NextResponse.json({ received: true });
}
