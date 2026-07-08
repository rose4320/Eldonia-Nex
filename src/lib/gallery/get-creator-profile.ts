import { createClient } from "@/lib/supabase/server";
import type { ArtworkWithCreator, Portfolio, Profile } from "@/types/database";

export type CreatorPublicProfile = {
  profile: Pick<
    Profile,
    "id" | "username" | "display_name" | "avatar_url" | "bio" | "disciplines" | "is_creator"
  >;
  portfolio: Pick<Portfolio, "headline" | "summary" | "skills" | "exp_points" | "level" | "title_badge"> | null;
  artworks: ArtworkWithCreator[];
  seriesAlbums: ArtworkWithCreator[];
};

const PROFILE_SELECT = `
  id,
  username,
  display_name,
  avatar_url,
  bio,
  disciplines,
  is_creator
`;

const ARTWORK_SELECT = `
  *,
  profiles:creator_id (
    display_name,
    username,
    avatar_url,
    disciplines
  )
`;

export async function getCreatorByUsername(
  username: string,
): Promise<CreatorPublicProfile | null> {
  const supabase = await createClient();
  const normalized = username.trim().toLowerCase();
  if (!normalized) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .ilike("username", normalized)
    .maybeSingle();

  if (profileError || !profile) {
    return null;
  }

  const [{ data: portfolio }, { data: artworks }, { data: seriesAlbums }] = await Promise.all([
    supabase
      .from("portfolios")
      .select("headline, summary, skills, exp_points, level, title_badge")
      .eq("user_id", profile.id)
      .maybeSingle(),
    supabase
      .from("artworks")
      .select(ARTWORK_SELECT)
      .eq("creator_id", profile.id)
      .eq("is_public", true)
      .is("series_id", null)
      .neq("format", "series_album")
      .order("created_at", { ascending: false })
      .limit(24),
    supabase
      .from("artworks")
      .select(ARTWORK_SELECT)
      .eq("creator_id", profile.id)
      .eq("is_public", true)
      .eq("format", "series_album")
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  return {
    profile,
    portfolio: portfolio ?? null,
    artworks: (artworks ?? []) as ArtworkWithCreator[],
    seriesAlbums: (seriesAlbums ?? []) as ArtworkWithCreator[],
  };
}

export async function getSeriesArtworks(seriesId: string): Promise<ArtworkWithCreator[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artworks")
    .select(ARTWORK_SELECT)
    .eq("series_id", seriesId)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[gallery] getSeriesArtworks failed:", error.message);
    return [];
  }

  return (data ?? []) as ArtworkWithCreator[];
}
