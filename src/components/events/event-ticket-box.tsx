"use client";

import Link from "next/link";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import {
  formatEventDate,
  formatLabel,
  formatPrice,
  isPastEvent,
  isSoldOut,
  realmLabel,
  ticketsRemaining,
} from "@/lib/events/constants";
import type { NexusEventWithOrganizer } from "@/types/database";

type EventTicketBoxProps = {
  event: NexusEventWithOrganizer;
  isLoggedIn: boolean;
};

export function EventTicketBox({ event, isLoggedIn }: EventTicketBoxProps) {
  const locale = useLocale();
  const { pages, shop } = useContent();
  const date = formatEventDate(event.starts_at, locale);
  const soldOut = isSoldOut(event.capacity, event.tickets_sold);
  const remaining = ticketsRemaining(event.capacity, event.tickets_sold);
  const past = isPastEvent(event.starts_at);

  return (
    <div className="eldonia-ticket-box sticky top-6 space-y-4">
      <p className="font-display text-sm text-[var(--eldonia-gold-muted)] uppercase tracking-wider">
        {pages.events.ticketHeading}
      </p>

      <p className="font-display text-3xl text-[var(--eldonia-gold-light)]">
        {formatPrice(event.ticket_price, locale)}
      </p>

      {event.compare_price && event.compare_price > event.ticket_price && (
        <p className="text-sm text-[var(--eldonia-text-dim)]">
          {pages.events.ticketCompare}:{" "}
          <span className="line-through">{formatPrice(event.compare_price, locale)}</span>
        </p>
      )}

      <div className="space-y-2 border-t border-[var(--eldonia-border)] pt-4 text-sm">
        <p className="text-[var(--eldonia-text-muted)]">{date.full}</p>
        <p className="text-[var(--eldonia-text-muted)]">
          {pages.events.labelFormat}: {formatLabel(event.format, locale)}
        </p>
        <p className="text-[var(--eldonia-text-muted)]">
          {pages.events.labelRealm}: {realmLabel(event.category, locale)}
        </p>
        {remaining !== null && (
          <p className={soldOut ? "eldonia-alert-error" : "text-[var(--eldonia-gold-muted)]"}>
            {soldOut ? pages.events.soldOutFull : shop.inStock(remaining)}
          </p>
        )}
        {event.is_nexus_verified && (
          <p className="eldonia-badge-nexus-prime w-fit">
            <span aria-hidden>⚜</span> {pages.events.badgeVerified}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {past ? (
          <p className="eldonia-hint text-center">{pages.events.ticketPast}</p>
        ) : isLoggedIn ? (
          <AddToCartButton
            kind="event"
            id={event.id}
            label={pages.events.ticketGet}
            disabled={soldOut}
          />
        ) : (
          <Link
            href={`/auth/login?redirect_to=/events/${event.id}`}
            className="eldonia-btn-primary w-full text-center"
          >
            {pages.events.ticketLogin}
          </Link>
        )}
      </div>

      <p className="eldonia-hint text-center">{pages.events.ticketQrNote}</p>
    </div>
  );
}
