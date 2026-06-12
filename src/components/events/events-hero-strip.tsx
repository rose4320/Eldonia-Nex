import Link from "next/link";
import { formatEventDate, formatPrice } from "@/lib/events/constants";
import type { NexusEventWithOrganizer } from "@/types/database";

type EventsHeroStripProps = {
  events: NexusEventWithOrganizer[];
};

export function EventsHeroStrip({ events }: EventsHeroStripProps) {
  const featured = events.filter((e) => e.is_featured).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section>
      <h2 className="eldonia-eyebrow">Chronicle Highlights</h2>
      <div className="mt-3 flex gap-4 overflow-x-auto pb-2">
        {featured.map((event) => {
          const date = formatEventDate(event.starts_at);
          return (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="eldonia-events-hero-card group"
            >
              <p className="eldonia-badge-bestseller">注目</p>
              <p className="mt-2 font-display text-xs text-[var(--eldonia-text-dim)]">
                {date.full}
              </p>
              <h3 className="mt-2 font-display text-sm text-[var(--eldonia-gold-light)] group-hover:text-[var(--eldonia-gold)]">
                {event.title}
              </h3>
              <p className="mt-2 text-lg text-[var(--eldonia-gold)]">
                {formatPrice(event.ticket_price)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
