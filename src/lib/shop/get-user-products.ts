import { getCreatorAssets } from "@/lib/settings/get-creator-assets";
import type { ShopProduct } from "@/types/database";

export async function getUserShopProducts(userId: string): Promise<ShopProduct[]> {
  const { products } = await getCreatorAssets(userId);
  return products;
}
