import type { UiLocale } from "@/lib/i18n/locale";
import type { FieldTranslationMap } from "@/lib/translation/field-translations";
import type { ArtworkWithCreator } from "@/types/database";
import textbookMeta from "@/lib/gallery/curated/textbook-meta.json";
import mangaMeta from "@/lib/gallery/curated/manga-meta.json";
import photoAlbumMeta from "@/lib/gallery/curated/photo-album-meta.json";
import showcaseMeta from "@/lib/gallery/curated/showcase-meta.json";

type LocalizedMetaEntry = {
  title: string;
  excerpt?: string;
  captions?: string[];
};
type LocalizedMetaFile = Record<UiLocale, LocalizedMetaEntry>;

type SeedConfig = {
  ids: Set<string>;
  titles: Set<string>;
  meta: LocalizedMetaFile;
};

const TEXTBOOK: SeedConfig = {
  ids: new Set(["e305dbc6-bb63-4eb2-8f96-a3a94965068b"]),
  titles: new Set(["Eldonia-Nex 使い方テキストブック"]),
  meta: textbookMeta as LocalizedMetaFile,
};

const MANGA: SeedConfig = {
  ids: new Set(["97090590-90a3-4895-ac30-94388495ca0d"]),
  titles: new Set(["Nexusへようこそ — Eldonia-Nex 10ページガイド"]),
  meta: mangaMeta as LocalizedMetaFile,
};

const PHOTO_ALBUM: SeedConfig = {
  ids: new Set<string>(),
  titles: new Set(["幻想紀行 — ファンタジー世界写真集"]),
  meta: photoAlbumMeta as LocalizedMetaFile,
};

const SHOWCASE_IDS = new Set([
  "00000000-0000-4000-8000-000000000601",
  "00000000-0000-4000-8000-000000000602",
]);
const SHOWCASE_TITLES = new Set(["Eldonia-Nex", "Nexus Gate — Realm of Creators"]);

const ALL_SEEDS = [TEXTBOOK, MANGA, PHOTO_ALBUM];

function matchesSeed(config: SeedConfig, artworkId: string, title: string): boolean {
  return config.ids.has(artworkId) || config.titles.has(title);
}

export function isCuratedTextbookArtwork(artworkId: string, title: string): boolean {
  return matchesSeed(TEXTBOOK, artworkId, title);
}

export function isCuratedMangaArtwork(artworkId: string, title: string): boolean {
  return matchesSeed(MANGA, artworkId, title);
}

export function isCuratedPhotoAlbumArtwork(artworkId: string, title: string): boolean {
  return matchesSeed(PHOTO_ALBUM, artworkId, title);
}

function resolveShowcaseFields(
  artworkId: string,
  title: string,
  excerpt: string | null,
  locale: UiLocale,
): { title?: string; story_excerpt?: string } {
  if (!SHOWCASE_IDS.has(artworkId) && !SHOWCASE_TITLES.has(title)) return {};
  const pack =
    (showcaseMeta as Record<string, LocalizedMetaFile>)[artworkId] ??
    Object.values(showcaseMeta as Record<string, LocalizedMetaFile>).find(
      (entry) => entry.ja?.title === title || entry.en?.title === title,
    );
  if (!pack) return {};
  const entry = pack[locale] ?? pack.ja;
  if (!entry) return {};
  return {
    title: entry.title,
    story_excerpt: entry.excerpt ?? excerpt ?? undefined,
  };
}

export function resolveCuratedArtworkFields(
  artworkId: string,
  title: string,
  excerpt: string | null,
  locale: UiLocale,
): { title?: string; story_excerpt?: string } {
  const showcase = resolveShowcaseFields(artworkId, title, excerpt, locale);
  if (showcase.title) return showcase;

  for (const config of ALL_SEEDS) {
    if (!matchesSeed(config, artworkId, title)) continue;
    const entry = config.meta[locale] ?? config.meta.ja;
    if (!entry) continue;
    return {
      title: entry.title,
      story_excerpt: entry.excerpt ?? excerpt ?? undefined,
    };
  }

  return {};
}

/** Captions keyed by 1-based page index for curated photo albums. */
export function resolveCuratedPhotoCaptions(
  artworkId: string,
  title: string,
  locale: UiLocale,
): Record<number, string> | null {
  if (!matchesSeed(PHOTO_ALBUM, artworkId, title)) return null;
  const entry = PHOTO_ALBUM.meta[locale] ?? PHOTO_ALBUM.meta.ja;
  if (!entry?.captions?.length) return null;

  const byIndex: Record<number, string> = {};
  entry.captions.forEach((caption, index) => {
    byIndex[index + 1] = caption;
  });
  return byIndex;
}

export function getCuratedArtworkTranslations(
  artworks: ArtworkWithCreator[],
  locale: UiLocale,
): FieldTranslationMap {
  const result: FieldTranslationMap = {};
  for (const artwork of artworks) {
    const fields = resolveCuratedArtworkFields(
      artwork.id,
      artwork.title,
      artwork.story_excerpt,
      locale,
    );
    const row: Record<string, string> = {};
    if (fields.title && fields.title !== artwork.title) {
      row.title = fields.title;
    }
    if (
      fields.story_excerpt &&
      fields.story_excerpt !== (artwork.story_excerpt ?? "")
    ) {
      row.story_excerpt = fields.story_excerpt;
    }
    if (Object.keys(row).length > 0) {
      result[artwork.id] = row;
    }
  }
  return result;
}
