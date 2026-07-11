import { createClient } from "@/lib/supabase/server";
import type { ArtworkMediaType, ShopProductType } from "@/types/database";

const SHOP_REALM_VALUES = new Set(["apparel", "digital", "goods", "tools", "books"]);

const DIGITAL_MEDIA_TYPES = new Set<ArtworkMediaType>(["image", "document", "audio", "video"]);

export type ArtworkProductPrefill = {
  artworkId: string;
  title: string;
  description: string;
  imageUrl: string | null;
  category: string;
  productType: ShopProductType;
};

function defaultProductType(mediaType: ArtworkMediaType): ShopProductType {
  return DIGITAL_MEDIA_TYPES.has(mediaType) ? "digital" : "physical";
}

function mapShopCategory(artworkCategory: string): string {
  return SHOP_REALM_VALUES.has(artworkCategory) ? artworkCategory : "goods";
}

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

  return {
    artworkId: data.id,
    title: data.title,
    description: data.description ?? "",
    imageUrl: data.thumbnail_url ?? data.media_url,
    category: mapShopCategory(data.category),
    productType: defaultProductType(data.media_type),
  };
}
