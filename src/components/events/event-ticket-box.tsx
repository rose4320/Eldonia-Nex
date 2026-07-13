"use client";

import Link from "next/link";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { EventClaimFreeButton } from "@/components/events/event-claim-free-button";
import {
  formatEventDate,
  formatLabel,
  formatPrice,
  isPastEvent,
  isSoldOut,
  realmLabel,
  ticketsRemaining,
} from "@/lib/events/constants";
import { eventHasStream } from "@/lib/events/stream-access";
import type { NexusEventWithOrganizer } from "@/types/database";

type EventTicketBoxProps = {
  event: NexusEventWithOrganizer;
  isLoggedIn: boolean;
  hasTicket?: boolean;
};

export function EventTicketBox({ event, isLoggedIn, hasTicket = false }: EventTicketBoxProps) {
  const locale = useLocale();
  const { pages, shop } = useContent();
  const t = pages.events;
  const date = formatEventDate(event.starts_at, locale);
  const soldOut = isSoldOut(event.capacity, event.tickets_sold);
  const remaining = ticketsRemaining(event.capacity, event.tickets_sold);
  const past = isPastEvent(event.starts_at);
  const isFree = event.ticket_price === 0;
  const hasStream = eventHasStream(event);

  const footnote =
    event.format === "online"
      ? t.ticketStreamNote
      : event.format === "hybrid"
        ? t.ticketHybridNote
        : t.ticketQrNote;

  return (
    <div className="eldonia-ticket-box sticky top-6 space-y-4">
      <p className="font-display text-sm text-[var(--eldonia-gold-muted)] uppercase tracking-wider">
        {t.ticketHeading}
      </p>

      <p className="font-display text-3xl text-[var(--eldonia-gold-light)]">
        {formatPrice(event.ticket_price, locale)}
      </p>

      {event.compare_price && event.compare_price > event.ticket_price && (
        <p className="text-sm text-[var(--eldonia-text-dim)]">
          {t.ticketCompare}:{" "}
          <span className="line-through">{formatPrice(event.compare_price, locale)}</span>
        </p>
      )}

      <div className="space-y-2 border-t border-[var(--eldonia-border)] pt-4 text-sm">
        <p className="text-[var(--eldonia-text-muted)]">{date.full}</p>
        <p className="text-[var(--eldonia-text-muted)]">
          {t.labelFormat}: {formatLabel(event.format, locale)}
        </p>
        <p className="text-[var(--eldonia-text-muted)]">
          {t.labelRealm}: {realmLabel(event.category, locale)}
        </p>
        {remaining !== null && (
          <p className={soldOut ? "eldonia-alert-error" : "text-[var(--eldonia-gold-muted)]"}>
            {soldOut ? t.soldOutFull : shop.inStock(remaining)}
          </p>
        )}
        {event.is_nexus_verified && (
          <p className="eldonia-badge-nexus-prime w-fit">
            <span aria-hidden>⚜</span> {t.badgeVerified}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {past ? (
          <p className="eldonia-hint text-center">{t.ticketPast}</p>
        ) : hasTicket ? (
          <>
            <p className="text-center text-sm text-[var(--eldonia-gold-muted)]">{t.ticketOwned}</p>
            {hasStream && (
              <Link
                href={`/events/${event.id}/watch`}
                className="eldonia-btn-primary w-full text-center"
              >
                {t.ticketWatchRoom}
              </Link>
            )}
            <Link href="/events/my-tickets" className="eldonia-btn-ghost w-full text-center text-xs">
              {t.toolbarMyTickets}
            </Link>
          </>
        ) : isLoggedIn ? (
          isFree ? (
            <EventClaimFreeButton eventId={event.id} disabled={soldOut} />
          ) : (
            <AddToCartButton
              kind="event"
              id={event.id}
              label={t.ticketGet}
              disabled={soldOut}
            />
          )
        ) : (
          <Link
            href={`/auth/login?redirect_to=/events/${event.id}`}
            className="eldonia-btn-primary w-full text-center"
          >
            {t.ticketLogin}
          </Link>
        )}
      </div>

      <p className="eldonia-hint text-center">{footnote}</p>
    </div>
  );
}
