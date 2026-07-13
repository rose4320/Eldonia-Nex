import { NextResponse } from "next/server";
import { formatEventDate, formatLabel } from "@/lib/events/constants";
import {
  eventTicketPdfFilename,
  generateEventTicketPdf,
} from "@/lib/events/generate-event-ticket-pdf";
import { getEvent } from "@/lib/events/get-events";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type RouteContext = { params: Promise<{ id: string }> };

async function loadTicketContext(ticketId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "login_required" as const, status: 401 as const };

  const { data: ticket, error: ticketError } = await supabase
    .from("event_tickets")
    .select("id, ticket_code, qr_token, status, event_id, holder_user_id")
    .eq("id", ticketId)
    .eq("holder_user_id", user.id)
    .in("status", ["valid", "used"])
    .maybeSingle();

  if (ticketError || !ticket) {
    return { error: "not_found" as const, status: 404 as const };
  }

  const event = await getEvent(ticket.event_id);
  if (!event) {
    return { error: "event_not_found" as const, status: 404 as const };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  const locale = await getUiLocale();
  const date = formatEventDate(event.starts_at, locale);

  return {
    ticket,
    input: {
      locale,
      eventFormat: event.format,
      eventCategory: event.category,
      ticketCode: ticket.ticket_code,
      qrToken: ticket.qr_token,
      eventTitle: event.title,
      eventDateLabel: date.full,
      formatLabel: formatLabel(event.format, locale),
      venueLabel: event.format === "online" ? null : event.venue_name,
      venueAddress: event.format === "online" ? null : event.venue_address,
      holderName: profile?.display_name ?? null,
      organizerName: event.profiles?.display_name ?? null,
    },
  };
}

export async function GET(request: Request, context: RouteContext) {
  const { id: ticketId } = await context.params;
  const inline = new URL(request.url).searchParams.get("view") === "1";
  const loaded = await loadTicketContext(ticketId);

  if ("error" in loaded) {
    return NextResponse.json({ error: loaded.error }, { status: loaded.status });
  }

  try {
    const pdfBytes = await generateEventTicketPdf(loaded.input);
    const filename = eventTicketPdfFilename(loaded.ticket.ticket_code);
    const disposition = inline
      ? `inline; filename="${filename}"`
      : `attachment; filename="${filename}"`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": disposition,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown";
    console.error("[event-ticket-pdf]", detail);
    const code = detail.includes("ticket_pdf_font") ? "pdf_font_failed" : "pdf_failed";
    return NextResponse.json({ error: code }, { status: 500 });
  }
}
