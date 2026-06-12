import { getCart } from "@/lib/cart/cookie-cart";
import type { CartLine } from "@/lib/cart/types";
import { getEvent } from "@/lib/events/get-events";
import { getShopProduct } from "@/lib/shop/get-products";
import { formatPrice as formatShopPrice } from "@/lib/shop/constants";
import { formatPrice as formatEventPrice } from "@/lib/events/constants";

export type ResolvedCartItem = {
  line: CartLine;
  title: string;
  subtitle: string;
  unitPrice: number;
  lineTotal: number;
};

export async function resolveCart(): Promise<{
  items: ResolvedCartItem[];
  total: number;
}> {
  const cart = await getCart();
  const items: ResolvedCartItem[] = [];

  for (const line of cart) {
    if (line.kind === "shop") {
      const product = await getShopProduct(line.id);
      if (!product) continue;
      items.push({
        line,
        title: product.title,
        subtitle: "SHOP",
        unitPrice: product.price,
        lineTotal: product.price * line.quantity,
      });
    } else {
      const event = await getEvent(line.id);
      if (!event) continue;
      items.push({
        line,
        title: event.title,
        subtitle: "EVENTS",
        unitPrice: event.ticket_price,
        lineTotal: event.ticket_price * line.quantity,
      });
    }
  }

  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return { items, total };
}

export function formatCartPrice(yen: number): string {
  return `¥${yen.toLocaleString("ja-JP")}`;
}

export { formatShopPrice, formatEventPrice };
