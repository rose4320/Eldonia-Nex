import {
  orderStatusLabel,
  parseOrderItems,
} from "@/lib/commerce/get-orders";
import type { Order } from "@/types/database";

type OrderCardProps = { order: Order };

export function OrderCard({ order }: OrderCardProps) {
  const items = parseOrderItems(order.items);
  const date = new Date(order.created_at).toLocaleString("ja-JP");

  return (
    <article className="eldonia-card space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="eldonia-eyebrow">Order</p>
          <p className="font-display text-lg text-[var(--eldonia-gold-light)]">
            ¥{order.total_amount.toLocaleString("ja-JP")}
          </p>
        </div>
        <span className="eldonia-badge-nexus-prime">{orderStatusLabel(order.status)}</span>
      </div>
      <p className="text-xs text-[var(--eldonia-text-dim)]">{date}</p>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={`${item.kind}-${item.id}`} className="text-[var(--eldonia-text-muted)]">
            {item.kind.toUpperCase()} · {item.quantity} × ¥{item.unitPrice.toLocaleString("ja-JP")}
          </li>
        ))}
      </ul>
      {order.stripe_session_id && (
        <p className="eldonia-hint break-all text-[10px]">
          Session: {order.stripe_session_id.slice(0, 24)}…
        </p>
      )}
    </article>
  );
}
