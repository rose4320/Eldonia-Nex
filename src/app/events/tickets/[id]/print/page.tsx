import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { formatEventDate, formatLabel } from "@/lib/events/constants";
import { buildEventTicketDocument } from "@/lib/events/build-event-ticket-document";
import {
  buildEventTicketQrSvg,
  formatTicketCodeDisplay,
} from "@/lib/events/event-ticket-qr";
import { getEvent } from "@/lib/events/get-events";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventTicketPrintPage({ params }: PageProps) {
  const { id: ticketId } = await params;
  const locale = await getUiLocale();
  const pages = getContent(locale).pages.events;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect_to=/events/tickets/${ticketId}/print`);
  }

  const { data: ticket } = await supabase
    .from("event_tickets")
    .select("id, ticket_code, qr_token, status, event_id, holder_user_id")
    .eq("id", ticketId)
    .eq("holder_user_id", user.id)
    .in("status", ["valid", "used"])
    .maybeSingle();

  if (!ticket) notFound();

  const event = await getEvent(ticket.event_id);
  if (!event) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

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

  const qrSvg = await buildEventTicketQrSvg({
    ticket_code: ticket.ticket_code,
    qr_token: ticket.qr_token,
  });

  return (
    <div className="ticket-print-page min-h-screen bg-white text-black">
      <div className="ticket-print-toolbar no-print mx-auto flex max-w-2xl flex-wrap items-center gap-2 px-4 py-4">
        <Link href="/events/my-tickets" className="eldonia-btn-ghost text-xs">
          {pages.watchBack}
        </Link>
        <a
          href={`/api/events/tickets/${ticket.id}/text`}
          className="eldonia-btn-secondary text-xs"
          download
        >
          {pages.ticketDownloadText}
        </a>
        <button
          type="button"
          className="eldonia-btn-primary text-xs"
          // client print via inline script — avoid client component for SSR QR
        >
          {pages.ticketPrint}
        </button>
      </div>

      <article className="ticket-print-sheet mx-auto max-w-2xl px-6 py-8">
        <header className="border-b border-neutral-300 pb-4">
          <p className="text-xs tracking-widest text-neutral-500">ELDONIA NEX</p>
          <h1 className="mt-1 text-xl font-bold">{doc.title}</h1>
          <p className="mt-2 text-sm text-neutral-600">
            {pages.ticketCodeLabel}: {formatTicketCodeDisplay(ticket.ticket_code)}
          </p>
        </header>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1">
            <pre className="ticket-print-text whitespace-pre-wrap font-sans text-sm leading-relaxed text-neutral-900">
              {doc.plainText}
            </pre>
          </div>
          <div className="mx-auto w-48 shrink-0 rounded border border-neutral-200 bg-white p-2">
            <div
              className="ticket-print-qr"
              aria-hidden
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            <p className="mt-2 text-center text-xs text-neutral-600">
              {formatTicketCodeDisplay(ticket.ticket_code)}
            </p>
          </div>
        </div>
      </article>

      <script
        dangerouslySetInnerHTML={{
          __html: `document.querySelector('.ticket-print-toolbar .eldonia-btn-primary')?.addEventListener('click',()=>window.print());`,
        }}
      />

      <style>{`
        .ticket-print-page { font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Yu Gothic", Meiryo, sans-serif; }
        .ticket-print-qr svg { display: block; width: 100%; height: auto; }
        @media print {
          .no-print { display: none !important; }
          .ticket-print-page { background: white; }
          .ticket-print-sheet { max-width: none; padding: 0; }
        }
      `}</style>
    </div>
  );
}
