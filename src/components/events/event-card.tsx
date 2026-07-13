import Link from "next/link";
import { EventCoverFrame } from "@/components/events/event-cover-frame";
import { EventFormatBadge } from "@/components/events/event-format-badge";
import { TranslatedContentLine } from "@/components/i18n/content-line";
import {
  CATEGORY_ICONS,
  formatEventDate,
  formatLabel,
  formatPrice,
  isSoldOut,
  realmLabel,
  ticketsRemaining,
  ticketsRemainingText,
} from "@/lib/events/constants";
import { EVENT_COVER_CARD_SIZES } from "@/lib/events/cover-image";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { inferSourceLocale } from "@/lib/translation/infer-source-locale";
import type { NexusEventWithOrganizer } from "@/types/database";

type EventCardProps = {
  event: NexusEventWithOrganizer;
  translations?: { title?: string; description?: string };
};

export async function EventCard({ event, translations }: EventCardProps) {
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const date = formatEventDate(event.starts_at, locale);
  const icon = CATEGORY_ICONS[event.category] ?? "◆";
  const soldOut = isSoldOut(event.capacity, event.tickets_sold);
  const remaining = ticketsRemaining(event.capacity, event.tickets_sold);
  const titleLocale = inferSourceLocale(event.title);

  return (
    <Link href={`/events/${event.id}`} className="eldonia-event-card group">
      <div className="flex gap-4">
        <div className="eldonia-event-date shrink-0">
          <span className="block font-display text-2xl text-[var(--eldonia-gold-light)]">
            {date.day}
          </span>
          <span className="block text-[10px] uppercase tracking-wider text-[var(--eldonia-text-dim)]">
            {date.month}
          </span>
        </div>

        <EventCoverFrame
          src={event.cover_image_url}
          placeholder={<span aria-hidden>{icon}</span>}
          sizes={EVENT_COVER_CARD_SIZES}
          variant="card"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-1">
            <EventFormatBadge format={event.format} locale={locale} />
            {event.is_featured && (
              <span className="eldonia-badge-bestseller">{pages.events.badgeFeatured}</span>
            )}
            {event.is_nexus_verified && (
              <span className="eldonia-badge-nexus-prime">{pages.events.badgeVerified}</span>
            )}
            {soldOut && (
              <span className="eldonia-badge-sold-out">{pages.soldOut}</span>
            )}
          </div>

          <TranslatedContentLine
            text={event.title}
            translatedText={translations?.title}
            sourceLocale={titleLocale}
            locale={locale}
            as="h2"
            className="line-clamp-2 text-sm leading-snug text-[var(--eldonia-text)] group-hover:text-[var(--eldonia-gold-light)]"
            hintClassName="eldonia-localized-hint text-[11px] line-clamp-2"
          />

          {event.description && (
            <TranslatedContentLine
              text={event.description}
              translatedText={translations?.description}
              sourceLocale={inferSourceLocale(event.description, titleLocale)}
              locale={locale}
              as="p"
              className="line-clamp-2 text-xs text-[var(--eldonia-text-muted)]"
              hintClassName="eldonia-localized-hint text-[10px] line-clamp-2"
            />
          )}

          <p className="text-xs text-[var(--eldonia-text-muted)]">
            {date.time} · {formatLabel(event.format, locale)}
            {event.format !== "online" && event.venue_name ? ` · ${event.venue_name}` : ""}
          </p>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
            <span className="font-display text-base text-[var(--eldonia-gold-light)]">
              {formatPrice(event.ticket_price, locale)}
            </span>
            {remaining !== null && !soldOut && (
              <span className="text-[10px] text-[var(--eldonia-text-dim)]">
                {ticketsRemainingText(remaining, locale)}
              </span>
            )}
          </div>

          <p className="text-[10px] uppercase tracking-wider text-[var(--eldonia-text-dim)]">
            {realmLabel(event.category, locale)}
          </p>
        </div>
      </div>
    </Link>
  );
}
