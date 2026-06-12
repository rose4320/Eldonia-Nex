"use client";

import Link from "next/link";
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
  const date = formatEventDate(event.starts_at);
  const soldOut = isSoldOut(event.capacity, event.tickets_sold);
  const remaining = ticketsRemaining(event.capacity, event.tickets_sold);
  const past = isPastEvent(event.starts_at);

  return (
    <div className="eldonia-ticket-box sticky top-6 space-y-4">
      <p className="font-display text-sm text-[var(--eldonia-gold-muted)] uppercase tracking-wider">
        チケット
      </p>

      <p className="font-display text-3xl text-[var(--eldonia-gold-light)]">
        {formatPrice(event.ticket_price)}
      </p>

      {event.compare_price && event.compare_price > event.ticket_price && (
        <p className="text-sm text-[var(--eldonia-text-dim)]">
          通常: <span className="line-through">{formatPrice(event.compare_price)}</span>
        </p>
      )}

      <div className="space-y-2 border-t border-[var(--eldonia-border)] pt-4 text-sm">
        <p className="text-[var(--eldonia-text-muted)]">{date.full}</p>
        <p className="text-[var(--eldonia-text-muted)]">
          形式: {formatLabel(event.format)}
        </p>
        <p className="text-[var(--eldonia-text-muted)]">
          領域: {realmLabel(event.category)}
        </p>
        {remaining !== null && (
          <p className={soldOut ? "eldonia-alert-error" : "text-[var(--eldonia-gold-muted)]"}>
            {soldOut ? "完売 — Sold Out" : `残り ${remaining} 席`}
          </p>
        )}
        {event.is_nexus_verified && (
          <p className="eldonia-badge-nexus-prime w-fit">
            <span aria-hidden>⚜</span> Nexus Verified Host
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {past ? (
          <p className="eldonia-hint text-center">このイベントは終了しました</p>
        ) : isLoggedIn ? (
          <AddToCartButton
            kind="event"
            id={event.id}
            label="チケットを取得"
            disabled={soldOut}
          />
        ) : (
          <Link
            href={`/auth/login?redirect_to=/events/${event.id}`}
            className="eldonia-btn-primary w-full text-center"
          >
            ログインしてチケット取得
          </Link>
        )}
      </div>

      <p className="eldonia-hint text-center">
        電子チケット · QR 入場（準備中）
      </p>
    </div>
  );
}
