import { createClient } from "@/lib/supabase/server";
import {
  filterShowcaseArtworks,
  getShowcaseArtworkById,
  mergeWithShowcaseArtworks,
} from "@/lib/gallery/sample-artworks";
import type { ArtworkWithCreator } from "@/types/database";

const ARTWORK_SELECT = `
  *,
  profiles:creator_id (
    display_name,
    username,
    avatar_url
  )
`;

function escapeIlike(term: string): string {
  return term.replace(/[%_,()]/g, " ").trim();
}

async function queryPublicArtworks(options: {
  query?: string;
  limit: number;
  orderBy: "created_at" | "view_count";
}) {
  const supabase = await createClient();
  let dbQuery = supabase
    .from("artworks")
    .select(ARTWORK_SELECT)
    .eq("is_public", true)
    .order(options.orderBy, { ascending: false })
    .limit(options.limit);

  const term = options.query?.trim();
  if (term) {
    const safe = escapeIlike(term);
    if (safe) {
      dbQuery = dbQuery.or(`title.ilike.%${safe}%,description.ilike.%${safe}%`);
    }
  }

  const { data, error } = await dbQuery;
  if (error) {
    console.error("[gallery] getPublicArtworks failed:", error.message);
    return filterShowcaseArtworks(options.query).slice(0, options.limit);
  }

  return mergeWithShowcaseArtworks(
    (data ?? []) as ArtworkWithCreator[],
    options.query,
  ).slice(0, options.limit);
}

export async function getPublicArtworks(
  query?: string,
): Promise<ArtworkWithCreator[]> {
  return queryPublicArtworks({ query, limit: 24, orderBy: "created_at" });
}

export async function getTopPublicArtworks(limit = 6): Promise<ArtworkWithCreator[]> {
  return queryPublicArtworks({ limit, orderBy: "view_count" });
}

export async function getPublicArtworkById(
  id: string,
): Promise<ArtworkWithCreator | null> {
  const showcase = getShowcaseArtworkById(id);
  if (showcase) return showcase;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artworks")
    .select(ARTWORK_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[gallery] getPublicArtworkById failed:", error.message);
    return null;
  }

  return (data as ArtworkWithCreator | null) ?? null;
}
