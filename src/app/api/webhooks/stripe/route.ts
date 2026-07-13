import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { issueEventTicketsFromStripeSession } from "@/lib/events/issue-event-tickets";
import { normalizePlanId } from "@/lib/plans/catalog";
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

      await issueEventTicketsFromStripeSession(session.id);

      if (session.metadata?.kind === "subscription_onboarding") {
        const planId = normalizePlanId(session.metadata.plan_id);
        await admin
          .from("user_onboarding")
          .update({
            selected_plan: planId === "business" ? "premium" : planId,
            payment_status: "completed",
            stripe_session_id: session.id,
          })
          .eq("user_id", session.metadata.user_id);
      }

      if (session.metadata?.kind === "subscription_settings") {
        const userId = session.metadata.user_id;
        const planId = normalizePlanId(session.metadata.plan_id);
        const fromPlan = normalizePlanId(session.metadata.from_plan);

        if (userId && (planId === "standard" || planId === "premium")) {
          await admin.from("user_plan_assignment_archives").insert({
            user_id: userId,
            plan_slug: fromPlan,
            payment_status: "pending",
            snapshot: {
              from_plan: fromPlan,
              to_plan: planId,
              stripe_session_id: session.id,
              changed_via: "stripe_webhook",
            },
            archived_reason: "plan_changed",
            archived_by: "stripe_webhook",
          });

          await admin.from("user_onboarding").upsert(
            {
              user_id: userId,
              selected_plan: planId,
              payment_status: "completed",
              stripe_session_id: session.id,
              completed_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          );

          await admin.from("user_plan_changes").insert({
            user_id: userId,
            from_plan: fromPlan,
            to_plan: planId,
            payment_status: "completed",
            stripe_session_id: session.id,
            changed_via: "stripe_webhook",
          });
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
