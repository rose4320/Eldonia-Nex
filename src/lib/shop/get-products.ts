import { createClient } from "@/lib/supabase/server";
import type { ShopProductWithSeller } from "@/types/database";
import { SAMPLE_PRODUCTS } from "./sample-products";

type ProductFilters = {
  q?: string;
  category?: string;
};

function filterProducts(
  products: ShopProductWithSeller[],
  { q, category }: ProductFilters,
): ShopProductWithSeller[] {
  let result = products;

  if (category && category !== "all") {
    result = result.filter((p) => p.category === category);
  }

  const term = q?.trim().toLowerCase();
  if (term) {
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.tags.some((tag) => tag.toLowerCase().includes(term)),
    );
  }

  return result;
}

export async function getShopProducts(
  filters: ProductFilters = {},
): Promise<ShopProductWithSeller[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("shop_products")
      .select(
        `
        *,
        profiles:seller_id (
          display_name,
          username
        )
      `,
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      return filterProducts(SAMPLE_PRODUCTS, filters);
    }

    return filterProducts(data as ShopProductWithSeller[], filters);
  } catch {
    return filterProducts(SAMPLE_PRODUCTS, filters);
  }
}

export async function getShopProduct(
  id: string,
): Promise<ShopProductWithSeller | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("shop_products")
      .select(
        `
        *,
        profiles:seller_id (
          display_name,
          username
        )
      `,
      )
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (!error && data) {
      return data as ShopProductWithSeller;
    }
  } catch {
    // fall through to samples
  }

  return SAMPLE_PRODUCTS.find((p) => p.id === id) ?? null;
}
