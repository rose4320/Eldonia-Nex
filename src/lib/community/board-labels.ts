import { getContent } from "@/lib/i18n/content/messages";
import type { UiLocale } from "@/lib/i18n/locale";

const BOARD_SLUGS = [
  "general",
  "gallery",
  "shop",
  "events",
  "works",
  "lore",
] as const;

export type CommunityBoardSlug = (typeof BOARD_SLUGS)[number];

function isBoardSlug(slug: string): slug is CommunityBoardSlug {
  return (BOARD_SLUGS as readonly string[]).includes(slug);
}

export function getBoardDescription(
  slug: string,
  locale: UiLocale,
  fallback?: string | null,
): string {
  if (isBoardSlug(slug)) {
    return getContent(locale).community.boardDescriptions[slug];
  }
  return fallback?.trim() ?? "";
}

export function getBoardName(
  slug: string,
  locale: UiLocale,
  fallback?: string | null,
): string {
  if (isBoardSlug(slug)) {
    return getContent(locale).community.boardNames[slug];
  }
  return fallback?.trim() ?? "";
}
