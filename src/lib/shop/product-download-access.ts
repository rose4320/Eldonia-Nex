import { parseOrderItemsPayload } from "@/lib/cart/order-items";
import { createClient } from "@/lib/supabase/server";
import type { ShopProduct } from "@/types/database";

type ProductAccessTarget = Pick<ShopProduct, "id" | "seller_id" | "product_type">;

function orderContainsShopProduct(items: unknown, productId: string): boolean {
  const { lines } = parseOrderItemsPayload(items);
  return lines.some((line) => line.kind === "shop" && line.id === productId);
}

/** 購入者として paid 注文に含まれるか（出品者本人は false） */
export async function userHasShopProductOrder(
  userId: string,
  productId: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("items")
    .eq("user_id", userId)
    .eq("status", "paid");

  if (error || !orders?.length) {
    return false;
  }

  return orders.some((order) => orderContainsShopProduct(order.items, productId));
}

export async function canDownloadShopProduct(
  userId: string | null | undefined,
  product: ProductAccessTarget,
): Promise<boolean> {
  if (!userId || product.product_type !== "digital") {
    return false;
  }

  if (product.seller_id === userId) {
    return true;
  }

  return userHasShopProductOrder(userId, product.id);
}

export type ShopProductBuyerAccess = {
  isSeller: boolean;
  hasClaimed: boolean;
  canDownload: boolean;
};

export async function getShopProductBuyerAccess(
  userId: string | null | undefined,
  product: ProductAccessTarget,
): Promise<ShopProductBuyerAccess> {
  const isSeller = Boolean(userId && product.seller_id === userId);
  const hasClaimed =
    Boolean(userId) && !isSeller && (await userHasShopProductOrder(userId!, product.id));
  const canDownload =
    product.product_type === "digital" &&
    Boolean(userId) &&
    (isSeller || hasClaimed);

  return { isSeller, hasClaimed, canDownload };
}
