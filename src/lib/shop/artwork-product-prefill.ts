import { buildArtworkShopListing } from "@/lib/shop/artwork-to-product";
import { createClient } from "@/lib/supabase/server";
import type { ShopProductType } from "@/types/database";

export type ArtworkProductPrefill = {
  artworkId: string;
  title: string;
  description: string;
  imageUrl: string | null;
  downloadUrl: string | null;
  category: string;
  productType: ShopProductType;
};

export async function getArtworkProductPrefill(
  userId: string,
  artworkId: string,
): Promise<ArtworkProductPrefill | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artworks")
    .select("id, title, description, thumbnail_url, media_url, media_type, category")
    .eq("id", artworkId)
    .eq("creator_id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const listing = buildArtworkShopListing(data);

  return {
    artworkId: data.id,
    title: listing.title,
    description: listing.description ?? "",
    imageUrl: listing.image_url,
    downloadUrl: listing.download_url,
    category: listing.category,
    productType: listing.product_type,
  };
}
