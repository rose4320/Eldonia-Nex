import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { hasNarrativeBody } from "@/lib/gallery/parse-story-sections";
import type { UiLocale } from "@/lib/i18n/locale";

const TEXTBOOK_DIR = join(process.cwd(), "public/aset/seed/composer-eldonia-textbook");
const TEXTBOOK_TITLE_JA = "Eldonia-Nex 使い方テキストブック";
const TEXTBOOK_IDS = new Set([
  "e305dbc6-bb63-4eb2-8f96-a3a94965068b",
]);

type TextbookMeta = Record<UiLocale, { title: string; excerpt: string }>;

export type ResolvedStoryReaderContent = {
  title: string;
  excerpt: string | null;
  body: string;
};

function loadTextbookMeta(): TextbookMeta | null {
  const path = join(TEXTBOOK_DIR, "textbook-meta.json");
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as TextbookMeta;
}

function loadTextbookBody(locale: UiLocale): string | null {
  const filename =
    locale === "ja" ? "textbook-body.md" : `textbook-body.${locale}.md`;
  const path = join(TEXTBOOK_DIR, filename);
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf8").trim();
}

function isTextbookArtwork(artworkId: string, title: string): boolean {
  return TEXTBOOK_IDS.has(artworkId) || title === TEXTBOOK_TITLE_JA;
}

export function resolveStoryReaderContent(
  artworkId: string,
  title: string,
  excerpt: string | null,
  description: string | null,
  locale: UiLocale,
): ResolvedStoryReaderContent | null {
  if (isTextbookArtwork(artworkId, title)) {
    const meta = loadTextbookMeta();
    const body = loadTextbookBody(locale) ?? loadTextbookBody("ja");
    if (!body) return null;
    const localized = meta?.[locale] ?? meta?.ja;
    return {
      title: localized?.title ?? title,
      excerpt: localized?.excerpt ?? excerpt,
      body,
    };
  }

  if (!hasNarrativeBody(description)) return null;
  return {
    title,
    excerpt,
    body: description!.trim(),
  };
}

export function canShowStoryReader(
  artworkId: string,
  title: string,
  category: string,
  description: string | null,
  locale: UiLocale,
): boolean {
  if (category !== "story") return false;
  return resolveStoryReaderContent(artworkId, title, null, description, locale) !== null;
}
