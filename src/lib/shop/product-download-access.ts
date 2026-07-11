import { parseOrderItemsPayload } from "@/lib/cart/order-items";
import { createClient } from "@/lib/supabase/server";
import type { ShopProduct } from "@/types/database";

type ProductDownloadTarget = Pick<ShopProduct, "id" | "seller_id" | "product_type">;

export async function canDownloadShopProduct(
  userId: string | null | undefined,
  product: ProductDownloadTarget,
): Promise<boolean> {
  if (!userId || product.product_type !== "digital") {
    return false;
  }

  if (product.seller_id === userId) {
    return true;
  }

  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("items")
    .eq("user_id", userId)
    .eq("status", "paid");

  if (error || !orders?.length) {
    return false;
  }

  return orders.some((order) => {
    const { lines } = parseOrderItemsPayload(order.items);
    return lines.some((line) => line.kind === "shop" && line.id === product.id);
  });
}
