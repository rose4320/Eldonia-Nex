import Link from "next/link";
import { EventCoverFrame } from "@/components/events/event-cover-frame";
import { EventFormatBadge } from "@/components/events/event-format-badge";
import { EventTicketQr } from "@/components/events/event-ticket-qr";
import { EventTicketPdfActions } from "@/components/events/event-ticket-pdf-actions";
import { TranslatedContentLine } from "@/components/i18n/content-line";
import {
  CATEGORY_ICONS,
  formatEventDate,
  formatLabel,
  realmLabel,
} from "@/lib/events/constants";
import { eventHasStream, getStreamAccessState } from "@/lib/events/stream-access";
import type { EventTicketWithEvent } from "@/lib/events/event-ticket-access";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { inferSourceLocale } from "@/lib/translation/infer-source-locale";

type EventTicketCardProps = {
  ticket: EventTicketWithEvent;
};

export async function EventTicketCard({ ticket }: EventTicketCardProps) {
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const t = pages.events;
  const event = ticket.events;
  if (!event) return null;

  const date = formatEventDate(event.starts_at, locale);
  const icon = CATEGORY_ICONS[event.category] ?? "◆";
  const hasStream = eventHasStream(event);
  const streamState = getStreamAccessState(event);
  const titleLocale = inferSourceLocale(event.title);

  return (
    <article className="eldonia-card overflow-hidden p-0">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full shrink-0 sm:w-48">
          <EventCoverFrame
            src={event.cover_image_url}
            placeholder={<span aria-hidden>{icon}</span>}
            variant="card"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <EventFormatBadge format={event.format} locale={locale} />
            <span className="eldonia-hint text-xs">{date.full}</span>
          </div>

          <TranslatedContentLine
            text={event.title}
            sourceLocale={titleLocale}
            locale={locale}
            as="h2"
            className="font-display text-base text-[var(--eldonia-gold-light)]"
            hintClassName="eldonia-localized-hint text-xs"
          />

          <p className="text-xs text-[var(--eldonia-text-muted)]">
            {formatLabel(event.format, locale)} · {realmLabel(event.category, locale)}
            {event.format !== "online" && event.venue_name ? ` · ${event.venue_name}` : ""}
          </p>

          <EventTicketQr
            ticketCode={ticket.ticket_code}
            qrToken={ticket.qr_token}
            codeLabel={t.ticketCodeLabel}
            scanHint={t.ticketQrScanHint}
            compact
          />

          <EventTicketPdfActions ticketId={ticket.id} />

          <div className="mt-auto flex flex-wrap gap-2">
            {hasStream && (
              <Link
                href={`/events/${event.id}/watch`}
                className="eldonia-btn-primary text-xs"
              >
                {t.ticketWatchRoom}
              </Link>
            )}
            <Link href={`/events/${event.id}`} className="eldonia-btn-ghost text-xs">
              {t.back.replace("← ", "")}
            </Link>
            {hasStream && streamState.phase === "before_window" && (
              <span className="eldonia-hint self-center text-[10px]">{t.ticketStreamNote}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
