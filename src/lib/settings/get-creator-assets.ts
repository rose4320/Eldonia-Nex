import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { UserArtworkSummary } from "@/lib/gallery/get-user-artworks";
import type { ShopProduct } from "@/types/database";

export type CreatorAssets = {
  artworks: UserArtworkSummary[];
  products: ShopProduct[];
};

function linkArtworksToShopProducts(
  artworks: Omit<UserArtworkSummary, "shop_product_id">[],
  products: Pick<ShopProduct, "id" | "source_artwork_id" | "is_active">[],
): UserArtworkSummary[] {
  const shopByArtwork = new Map<string, string>();
  for (const product of products) {
    if (product.is_active && product.source_artwork_id) {
      shopByArtwork.set(product.source_artwork_id, product.id);
    }
  }

  return artworks.map((artwork) => ({
    ...artwork,
    shop_product_id: shopByArtwork.get(artwork.id) ?? null,
  }));
}

export const getCreatorAssets = cache(async (userId: string): Promise<CreatorAssets> => {
  const supabase = await createClient();
  const [artworksRes, productsRes] = await Promise.all([
    supabase
      .from("artworks")
      .select("id, title, is_public, created_at, thumbnail_url, media_url, media_type, category")
      .eq("creator_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("shop_products")
      .select("*")
      .eq("seller_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  if (artworksRes.error) {
    console.error("[settings] getCreatorAssets artworks failed:", artworksRes.error.message);
  }
  if (productsRes.error) {
    console.error("[settings] getCreatorAssets products failed:", productsRes.error.message);
  }

  const artworks = artworksRes.data ?? [];
  const products = (productsRes.data ?? []) as ShopProduct[];

  return {
    artworks: linkArtworksToShopProducts(artworks, products),
    products,
  };
});
