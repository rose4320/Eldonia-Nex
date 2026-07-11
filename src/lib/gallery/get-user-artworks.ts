import { getCreatorAssets } from "@/lib/settings/get-creator-assets";
import type { ArtworkMediaType } from "@/types/database";

export type UserArtworkSummary = {
  id: string;
  title: string;
  is_public: boolean;
  created_at: string;
  thumbnail_url: string | null;
  media_url: string;
  media_type: ArtworkMediaType;
  category: string;
  shop_product_id: string | null;
};

export async function getUserArtworks(userId: string): Promise<UserArtworkSummary[]> {
  const { artworks } = await getCreatorAssets(userId);
  return artworks;
}
