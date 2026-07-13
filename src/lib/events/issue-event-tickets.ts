import { createAdminClient } from "@/lib/supabase/admin";
import { parseOrderItemsPayload } from "@/lib/cart/order-items";

type IssueResult = {
  issued: number;
  skipped: number;
  errors: string[];
};

export async function issueEventTicketsFromOrder(orderId: string): Promise<IssueResult> {
  const admin = createAdminClient();
  const result: IssueResult = { issued: 0, skipped: 0, errors: [] };

  if (!admin) {
    result.errors.push("admin_client_unavailable");
    return result;
  }

  const { data: order, error: orderError } = await admin
    .from("orders")
    .select("id, user_id, status, items")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError || !order?.user_id) {
    result.errors.push("order_not_found");
    return result;
  }

  if (order.status !== "paid") {
    result.skipped += 1;
    return result;
  }

  const { lines } = parseOrderItemsPayload(order.items);
  const eventLines = lines.filter((line) => line.kind === "event");

  if (eventLines.length === 0) {
    return result;
  }

  for (const line of eventLines) {
    const { data, error } = await admin.rpc("issue_event_tickets_for_line", {
      p_order_id: order.id,
      p_holder_user_id: order.user_id,
      p_event_id: line.id,
      p_quantity: line.quantity,
    });

    if (error) {
      result.errors.push(`${line.id}:${error.message}`);
      continue;
    }

    const ids = Array.isArray(data) ? data : [];
    result.issued += ids.length;
  }

  return result;
}

export async function issueEventTicketsFromStripeSession(sessionId: string): Promise<IssueResult> {
  const admin = createAdminClient();
  const result: IssueResult = { issued: 0, skipped: 0, errors: [] };

  if (!admin) {
    result.errors.push("admin_client_unavailable");
    return result;
  }

  const { data: order, error } = await admin
    .from("orders")
    .select("id")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (error || !order) {
    result.errors.push("order_not_found");
    return result;
  }

  return issueEventTicketsFromOrder(order.id);
}
