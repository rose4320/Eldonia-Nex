import { createClient } from "@/lib/supabase/server";
import { fetchPublishedEventsByIds } from "@/lib/events/get-events";
import type { NexusEventWithOrganizer } from "@/types/database";

export type EventTicketRow = {
  id: string;
  event_id: string;
  order_id: string | null;
  holder_user_id: string;
  ticket_code: string;
  qr_token: string;
  status: "valid" | "used" | "cancelled" | "refunded";
  checked_in_at: string | null;
  created_at: string;
};

export type EventTicketWithEvent = EventTicketRow & {
  events: NexusEventWithOrganizer | null;
};

export async function userHasValidEventTicket(
  userId: string,
  eventId: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("event_tickets")
    .select("id", { count: "exact", head: true })
    .eq("holder_user_id", userId)
    .eq("event_id", eventId)
    .eq("status", "valid");

  if (error) return false;
  return (count ?? 0) > 0;
}

export async function getUserEventTickets(userId: string): Promise<EventTicketWithEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_tickets")
    .select(
      "id, event_id, order_id, holder_user_id, ticket_code, qr_token, status, checked_in_at, created_at",
    )
    .eq("holder_user_id", userId)
    .in("status", ["valid", "used"])
    .order("created_at", { ascending: false });

  if (error || !data?.length) return [];

  const eventIds = [...new Set(data.map((row) => row.event_id))];
  const eventById = await fetchPublishedEventsByIds(eventIds);

  return data.map((row) => ({
    ...(row as EventTicketRow),
    events: eventById.get(row.event_id) ?? null,
  }));
}

export async function getValidTicketForEvent(
  userId: string,
  eventId: string,
): Promise<EventTicketRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_tickets")
    .select(
      "id, event_id, order_id, holder_user_id, ticket_code, qr_token, status, checked_in_at, created_at",
    )
    .eq("holder_user_id", userId)
    .eq("event_id", eventId)
    .eq("status", "valid")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as EventTicketRow;
}
