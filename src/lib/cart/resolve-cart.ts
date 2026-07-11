import { getCart } from "@/lib/cart/cookie-cart";
import type { CartLine } from "@/lib/cart/types";
import { calculateDomesticShippingFee } from "@/lib/cart/shipping";
import { getEvent } from "@/lib/events/get-events";
import { getShopProduct } from "@/lib/shop/get-products";
import { formatProductPrice } from "@/lib/shop/constants";
import type { UiLocale } from "@/lib/i18n/locale";
import type { ShopProductType } from "@/types/database";

export type ResolvedCartItem = {
  line: CartLine;
  title: string;
  subtitle: string;
  unitPrice: number;
  lineTotal: number;
  productType?: ShopProductType;
};

export type CartSummary = {
  items: ResolvedCartItem[];
  merchandiseTotal: number;
  shippingFee: number;
  orderTotal: number;
  hasPhysical: boolean;
  hasDigital: boolean;
  hasPaidMerchandise: boolean;
  physicalQuantity: number;
  canFreeCheckout: boolean;
  requiresShippingAddress: boolean;
  requiresShippingPayment: boolean;
};

export async function resolveCart(): Promise<CartSummary> {
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
        productType: product.product_type,
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

  const merchandiseTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const hasPaidMerchandise = items.some((item) => item.unitPrice > 0);
  const physicalQuantity = items
    .filter((item) => item.line.kind === "shop" && item.productType === "physical")
    .reduce((sum, item) => sum + item.line.quantity, 0);
  const hasPhysical = physicalQuantity > 0;
  const hasDigital = items.some(
    (item) => item.line.kind === "shop" && item.productType === "digital",
  );
  const shippingFee =
    hasPhysical && !hasPaidMerchandise ? calculateDomesticShippingFee(physicalQuantity) : 0;
  const orderTotal = merchandiseTotal + shippingFee;
  const canFreeCheckout = items.length > 0 && orderTotal === 0;
  const requiresShippingAddress = hasPhysical;
  const requiresShippingPayment = hasPhysical && shippingFee > 0 && !hasPaidMerchandise;

  return {
    items,
    merchandiseTotal,
    shippingFee,
    orderTotal,
    hasPhysical,
    hasDigital,
    hasPaidMerchandise,
    physicalQuantity,
    canFreeCheckout,
    requiresShippingAddress,
    requiresShippingPayment,
  };
}

export function formatCartPrice(yen: number, locale: UiLocale = "ja"): string {
  return formatProductPrice(yen, locale);
}
