import { createClient } from "@/lib/supabase/server";
import type { ShopProduct } from "@/types/database";

export async function getUserShopProducts(userId: string): Promise<ShopProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shop_products")
    .select("*")
    .eq("seller_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as ShopProduct[];
}
