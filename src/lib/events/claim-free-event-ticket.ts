import { buildOrderItemsPayload } from "@/lib/cart/order-items";
import { getPublishedEventFromDb } from "@/lib/events/get-events";
import { userHasValidEventTicket } from "@/lib/events/event-ticket-access";
import { issueEventTicketsFromOrder } from "@/lib/events/issue-event-tickets";
import { eventHasStream } from "@/lib/events/stream-access";
import { ensureUserProfile } from "@/lib/profiles/ensure-profile";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSoldOut } from "@/lib/events/constants";

export type ClaimFreeEventResult =
  | { ok: true; alreadyOwned: true; redirect: string }
  | { ok: true; alreadyOwned: false; orderId: string; ticketIds: string[]; redirect: string }
  | { ok: false; code: string };

function redirectAfterClaim(eventId: string, hasStream: boolean): string {
  return hasStream ? `/events/${eventId}/watch` : `/events/my-tickets`;
}

function normalizeIssueError(raw: string): string {
  if (raw.includes("event_not_found")) return "event_not_found";
  if (raw.includes("event_sold_out")) return "sold_out";
  if (raw.includes("violates foreign key") && raw.includes("profiles")) {
    return "profile_required";
  }
  return "issue_failed";
}

/** Free events: no Stripe, no cart — order + ticket issued immediately via service role. */
export async function claimFreeEventTicket(
  userId: string,
  eventId: string,
): Promise<ClaimFreeEventResult> {
  const event = await getPublishedEventFromDb(eventId);
  if (!event) {
    return { ok: false, code: "not_found" };
  }

  if (event.ticket_price !== 0) {
    return { ok: false, code: "paid_event_use_cart" };
  }

  if (isSoldOut(event.capacity, event.tickets_sold)) {
    return { ok: false, code: "sold_out" };
  }

  const hasStream = eventHasStream(event);
  const redirect = redirectAfterClaim(eventId, hasStream);

  if (await userHasValidEventTicket(userId, eventId)) {
    return { ok: true, alreadyOwned: true, redirect };
  }

  const admin = createAdminClient();
  if (!admin) {
    return { ok: false, code: "admin_unavailable" };
  }

  if (!(await ensureUserProfile(userId))) {
    return { ok: false, code: "profile_required" };
  }

  const lines = [
    {
      kind: "event" as const,
      id: eventId,
      quantity: 1,
      unitPrice: 0,
    },
  ];

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: userId,
      stripe_session_id: null,
      status: "paid",
      total_amount: 0,
      currency: "jpy",
      items: buildOrderItemsPayload(lines),
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { ok: false, code: "claim_failed" };
  }

  const issued = await issueEventTicketsFromOrder(order.id);
  if (issued.errors.length > 0 && issued.issued === 0) {
    await admin.from("orders").delete().eq("id", order.id);
    return { ok: false, code: normalizeIssueError(issued.errors[0] ?? "issue_failed") };
  }

  return {
    ok: true,
    alreadyOwned: false,
    orderId: order.id,
    ticketIds: [],
    redirect,
  };
}
