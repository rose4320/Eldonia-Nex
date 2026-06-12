import Link from "next/link";
import {
  CATEGORY_ICONS,
  formatEventDate,
  formatLabel,
  formatPrice,
  isSoldOut,
  realmLabel,
  ticketsRemaining,
} from "@/lib/events/constants";
import type { NexusEventWithOrganizer } from "@/types/database";

type EventCardProps = {
  event: NexusEventWithOrganizer;
};

export function EventCard({ event }: EventCardProps) {
  const date = formatEventDate(event.starts_at);
  const icon = CATEGORY_ICONS[event.category] ?? "◆";
  const soldOut = isSoldOut(event.capacity, event.tickets_sold);
  const remaining = ticketsRemaining(event.capacity, event.tickets_sold);

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

        <div className="eldonia-event-thumb shrink-0 overflow-hidden">
          {event.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.cover_image_url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span aria-hidden>{icon}</span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-1">
            {event.is_featured && (
              <span className="eldonia-badge-bestseller">Chronicle Highlight</span>
            )}
            {event.is_nexus_verified && (
              <span className="eldonia-badge-nexus-prime">Verified Host</span>
            )}
            {soldOut && (
              <span className="eldonia-badge-sold-out">Sold Out</span>
            )}
          </div>

          <h2 className="line-clamp-2 text-sm leading-snug text-[var(--eldonia-text)] group-hover:text-[var(--eldonia-gold-light)]">
            {event.title}
          </h2>

          <p className="text-xs text-[var(--eldonia-text-muted)]">
            {date.time} · {formatLabel(event.format)}
            {event.venue_name ? ` · ${event.venue_name}` : ""}
          </p>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
            <span className="font-display text-base text-[var(--eldonia-gold-light)]">
              {formatPrice(event.ticket_price)}
            </span>
            {remaining !== null && !soldOut && (
              <span className="text-[10px] text-[var(--eldonia-text-dim)]">
                残り {remaining} 席
              </span>
            )}
          </div>

          <p className="text-[10px] uppercase tracking-wider text-[var(--eldonia-text-dim)]">
            {realmLabel(event.category)}
          </p>
        </div>
      </div>
    </Link>
  );
}
