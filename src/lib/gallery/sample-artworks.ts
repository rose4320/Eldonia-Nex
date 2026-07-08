import type { ArtworkWithCreator } from "@/types/database";

const now = "2026-01-01T00:00:00.000Z";

const ELDONIA_CREATOR = {
  display_name: "Eldonia-Nex Official",
  username: "eldonia_official",
  avatar_url: "/logo.png",
  disciplines: ["designer", "illustrator"] as string[],
};

const showcaseDefaults = {
  format: "single" as const,
  page_count: 1,
  series_id: null,
  story_excerpt: null,
  bgm_url: null,
};

/** 公式ショーケース作品（DB 未登録時も GALLEY / ホームに表示） */
export const SHOWCASE_ARTWORKS: ArtworkWithCreator[] = [
  {
    id: "00000000-0000-4000-8000-000000000601",
    creator_id: "00000000-0000-4000-8000-000000000001",
    title: "Eldonia-Nex",
    description:
      "黒と金の Nexus を象徴する公式キービジュアル。創作経済圏の世界観を体現したブランドイラスト。",
    media_type: "image",
    media_url: "/design/gallery/eldonia-nex-key-visual.png",
    thumbnail_url: null,
    category: "illustration",
    tags: ["公式", "キービジュアル", "ファンタジー"],
    is_public: true,
    view_count: 12840,
    created_at: now,
    updated_at: now,
    ...showcaseDefaults,
    profiles: ELDONIA_CREATOR,
  },
  {
    id: "00000000-0000-4000-8000-000000000602",
    creator_id: "00000000-0000-4000-8000-000000000001",
    title: "Nexus Gate — Realm of Creators",
    description:
      "Quest・作品・コマース・コミュニティが交差する創作の門。Home v2 ヒーローアート。",
    media_type: "image",
    media_url: "/design/v2/home-hero.png",
    thumbnail_url: null,
    category: "illustration",
    tags: ["公式", "ヒーロー", "Nexus"],
    is_public: true,
    view_count: 9620,
    created_at: now,
    updated_at: now,
    ...showcaseDefaults,
    profiles: ELDONIA_CREATOR,
  },
];

function escapeIlike(term: string): string {
  return term.replace(/[%_,()]/g, " ").trim();
}

function matchesRealm(artwork: ArtworkWithCreator, realm?: string): boolean {
  if (!realm || realm === "all") return true;
  return artwork.category === realm;
}

export function filterShowcaseArtworks(
  query?: string,
  realm?: string,
): ArtworkWithCreator[] {
  const items = SHOWCASE_ARTWORKS.filter((artwork) => matchesRealm(artwork, realm));
  const term = query?.trim().toLowerCase();
  if (!term) return items;

  const safe = escapeIlike(term).toLowerCase();
  if (!safe) return items;

  return items.filter(
    (artwork) =>
      artwork.title.toLowerCase().includes(safe) ||
      artwork.description?.toLowerCase().includes(safe) ||
      artwork.tags.some((tag) => tag.toLowerCase().includes(safe)) ||
      artwork.profiles?.display_name?.toLowerCase().includes(safe),
  );
}

export function getShowcaseArtworkById(id: string): ArtworkWithCreator | null {
  return SHOWCASE_ARTWORKS.find((artwork) => artwork.id === id) ?? null;
}

export function mergeWithShowcaseArtworks(
  dbArtworks: ArtworkWithCreator[],
  query?: string,
  realm?: string,
): ArtworkWithCreator[] {
  const showcase = filterShowcaseArtworks(query, realm);
  const showcaseIds = new Set(showcase.map((artwork) => artwork.id));
  const fromDb = dbArtworks.filter((artwork) => showcaseIds.has(artwork.id));
  const otherDb = dbArtworks.filter((artwork) => !showcaseIds.has(artwork.id));
  const missingShowcase = showcase.filter(
    (artwork) => !fromDb.some((row) => row.id === artwork.id),
  );
  return [...fromDb, ...missingShowcase, ...otherDb];
}
