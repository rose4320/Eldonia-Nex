import type { UiLocale } from "@/lib/i18n/locale";
import {
  artworkCategoryLabel,
  creatorDisciplineLabel,
  galleryRealmLabel as galleryRealmLabelI18n,
} from "@/lib/i18n/taxonomy";

/** 作者の活動領域 */
export const CREATOR_DISCIPLINE_VALUES = [
  "illustrator",
  "manga_artist",
  "photographer",
  "writer",
  "musician",
  "filmmaker",
  "designer",
  "other",
] as const;

export type CreatorDiscipline = (typeof CREATOR_DISCIPLINE_VALUES)[number];

/** 作品カテゴリ（format とは別 — 発見・ラベル用） */
export const ARTWORK_CATEGORY_VALUES = [
  "illustration",
  "manga",
  "photo",
  "story",
  "video",
  "music",
  "document",
  "other",
] as const;

export type ArtworkCategory = (typeof ARTWORK_CATEGORY_VALUES)[number];

export const IMAGE_ARTWORK_CATEGORY_VALUES = ["illustration", "photo", "manga"] as const;

export const DOCUMENT_ARTWORK_CATEGORY_VALUES = ["document", "story"] as const;

/** 作品の表示フォーマット */
export const ARTWORK_FORMAT_VALUES = [
  "single",
  "multi_page",
  "story",
  "series_album",
] as const;

export type ArtworkFormat = (typeof ARTWORK_FORMAT_VALUES)[number];

/** Gallery トップの領域フィルタ */
export const GALLERY_REALM_FILTER_VALUES = [
  "all",
  "illustration",
  "manga",
  "photo",
  "story",
  "video",
  "music",
] as const;

export type GalleryRealmFilter = (typeof GALLERY_REALM_FILTER_VALUES)[number];

const CATEGORY_SET = new Set<string>(ARTWORK_CATEGORY_VALUES);
const DISCIPLINE_SET = new Set<string>(CREATOR_DISCIPLINE_VALUES);

export function isArtworkCategory(value: string): value is ArtworkCategory {
  return CATEGORY_SET.has(value);
}

export function isCreatorDiscipline(value: string): value is CreatorDiscipline {
  return DISCIPLINE_SET.has(value);
}

export function sanitizeDisciplines(values: string[]): CreatorDiscipline[] {
  const seen = new Set<CreatorDiscipline>();
  const result: CreatorDiscipline[] = [];
  for (const value of values) {
    if (!isCreatorDiscipline(value) || seen.has(value)) continue;
    seen.add(value);
    result.push(value);
    if (result.length >= 4) break;
  }
  return result;
}

export function resolveArtworkFormat(category: string, pageCount: number): ArtworkFormat {
  if (category === "story") return "story";
  if (pageCount > 1) return "multi_page";
  return "single";
}

export function categoryLabel(value: string, locale: UiLocale = "ja"): string {
  return artworkCategoryLabel(value, locale);
}

export function disciplineLabel(value: string, locale: UiLocale = "ja"): string {
  return creatorDisciplineLabel(value, locale);
}

export function galleryRealmFilterLabel(
  value: GalleryRealmFilter,
  locale: UiLocale = "ja",
): string {
  return galleryRealmLabelI18n(value, locale);
}

export function formatBadgeLabel(
  format: ArtworkFormat,
  category: string,
  pageCount: number,
  locale: UiLocale = "ja",
): string | null {
  if (format === "multi_page" || pageCount > 1) {
    if (category === "manga") {
      return locale === "ja" ? `全${pageCount}P` : `${pageCount} pages`;
    }
    if (category === "photo") {
      return locale === "ja" ? `${pageCount}枚` : `${pageCount} photos`;
    }
    return locale === "ja" ? `${pageCount}ページ` : `${pageCount} pages`;
  }
  if (format === "story" || category === "story") {
    return categoryLabel("story", locale);
  }
  if (format === "series_album") {
    return locale === "ja" ? "シリーズ" : "Series";
  }
  return null;
}
