import { parseOrderItems } from "@/lib/commerce/get-orders";
import { orderStatusLabel } from "@/lib/i18n/taxonomy";
import { getContent, intlLocale } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import type { Order } from "@/types/database";

type OrderCardProps = { order: Order };

export async function OrderCard({ order }: OrderCardProps) {
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const items = parseOrderItems(order.items);
  const date = new Date(order.created_at).toLocaleString(intlLocale(locale));
  const formatPrice = (amount: number) =>
    amount === 0
      ? pages.dashboard.freePriceLabel
      : `¥${amount.toLocaleString(intlLocale(locale))}`;

  return (
    <article className="eldonia-card space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="eldonia-eyebrow">{pages.dashboard.orderLabel}</p>
          <p className="font-display text-lg text-[var(--eldonia-gold-light)]">
            {formatPrice(order.total_amount)}
          </p>
        </div>
        <span className="eldonia-badge-nexus-prime">{orderStatusLabel(order.status, locale)}</span>
      </div>
      <p className="text-xs text-[var(--eldonia-text-dim)]">{date}</p>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={`${item.kind}-${item.id}`} className="text-[var(--eldonia-text-muted)]">
            {item.kind.toUpperCase()} · {item.quantity} × {formatPrice(item.unitPrice)}
          </li>
        ))}
      </ul>
      {order.stripe_session_id && (
        <p className="eldonia-hint break-all text-[10px]">
          {pages.checkout.sessionLabel}: {order.stripe_session_id.slice(0, 24)}…
        </p>
      )}
    </article>
  );
}
