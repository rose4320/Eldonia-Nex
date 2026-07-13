import { NextResponse } from "next/server";
import { formatEventDate, formatLabel } from "@/lib/events/constants";
import { buildEventTicketDocument } from "@/lib/events/build-event-ticket-document";
import { getEvent } from "@/lib/events/get-events";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id: ticketId } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "login_required" }, { status: 401 });
  }

  const { data: ticket, error: ticketError } = await supabase
    .from("event_tickets")
    .select("id, ticket_code, qr_token, status, event_id, holder_user_id")
    .eq("id", ticketId)
    .eq("holder_user_id", user.id)
    .in("status", ["valid", "used"])
    .maybeSingle();

  if (ticketError || !ticket) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const event = await getEvent(ticket.event_id);
  if (!event) {
    return NextResponse.json({ error: "event_not_found" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  const locale = await getUiLocale();
  const date = formatEventDate(event.starts_at, locale);
  const doc = buildEventTicketDocument({
    locale,
    eventFormat: event.format,
    eventCategory: event.category,
    ticketCode: ticket.ticket_code,
    eventTitle: event.title,
    eventDateLabel: date.full,
    formatLabel: formatLabel(event.format, locale),
    venueLabel: event.format === "online" ? null : event.venue_name,
    venueAddress: event.format === "online" ? null : event.venue_address,
    holderName: profile?.display_name ?? null,
    organizerName: event.profiles?.display_name ?? null,
  });

  const body = `\uFEFF${doc.plainText}\n`;
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${doc.fileBaseName}.txt"`,
      "Cache-Control": "private, no-store",
    },
  });
}
