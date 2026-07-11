import type { ShippingSnapshot } from "@/lib/cart/shipping";

export type OrderLineItem = {
  kind: "shop" | "event";
  id: string;
  quantity: number;
  unitPrice: number;
  product_type?: "physical" | "digital";
};

export type OrderItemsPayload = {
  lines: OrderLineItem[];
  shipping?: ShippingSnapshot;
  shipping_fee?: number;
};

export function buildOrderItemsPayload(
  lines: OrderLineItem[],
  shipping?: ShippingSnapshot,
  shippingFee?: number,
): OrderItemsPayload | OrderLineItem[] {
  if (!shipping && (shippingFee ?? 0) <= 0) {
    return lines;
  }
  return {
    lines,
    shipping,
    shipping_fee: shippingFee ?? 0,
  };
}

export function parseOrderItemsPayload(items: unknown): {
  lines: OrderLineItem[];
  shipping?: ShippingSnapshot;
  shippingFee: number;
} {
  if (Array.isArray(items)) {
    return {
      lines: items.filter(isOrderLineItem),
      shippingFee: 0,
    };
  }

  if (!items || typeof items !== "object") {
    return { lines: [], shippingFee: 0 };
  }

  const payload = items as OrderItemsPayload;
  const lines = Array.isArray(payload.lines) ? payload.lines.filter(isOrderLineItem) : [];
  return {
    lines,
    shipping: payload.shipping,
    shippingFee: typeof payload.shipping_fee === "number" ? payload.shipping_fee : 0,
  };
}

function isOrderLineItem(item: unknown): item is OrderLineItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "kind" in item &&
    "id" in item &&
    "quantity" in item &&
    "unitPrice" in item
  );
}
