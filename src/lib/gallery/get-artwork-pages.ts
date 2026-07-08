import { createClient } from "@/lib/supabase/server";
import type { ArtworkPage } from "@/types/database";

export async function getArtworkPages(artworkId: string): Promise<ArtworkPage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artwork_pages")
    .select("id, artwork_id, page_index, media_url, caption, created_at")
    .eq("artwork_id", artworkId)
    .order("page_index", { ascending: true });

  if (error) {
    console.error("[gallery] getArtworkPages failed:", error.message);
    return [];
  }

  return data ?? [];
}
