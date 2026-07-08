import { createClient } from "@/lib/supabase/server";
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
};

export async function getUserArtworks(userId: string): Promise<UserArtworkSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artworks")
    .select("id, title, is_public, created_at, thumbnail_url, media_url, media_type, category")
    .eq("creator_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[gallery] getUserArtworks failed:", error.message);
    return [];
  }

  return data ?? [];
}
