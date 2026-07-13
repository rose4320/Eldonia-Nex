import {
  isCuratedTextbookArtwork,
  resolveCuratedArtworkFields,
} from "@/lib/gallery/artwork-localized-meta";
import { hasNarrativeBody } from "@/lib/gallery/parse-story-sections";
import type { UiLocale } from "@/lib/i18n/locale";
import { join } from "node:path";
import { existsSync, readFileSync } from "node:fs";

export type ResolvedStoryReaderContent = {
  title: string;
  excerpt: string | null;
  body: string;
};

function loadTextbookBody(locale: UiLocale): string | null {
  // Keep fs scoped so NFT does not pull the whole repo into serverless bundles.
  const dir = join(
    /* turbopackIgnore: true */ process.cwd(),
    "public",
    "aset",
    "seed",
    "composer-eldonia-textbook",
  );
  const filename =
    locale === "ja" ? "textbook-body.md" : `textbook-body.${locale}.md`;
  const path = join(dir, filename);
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf8").trim();
}

export function resolveStoryReaderContent(
  artworkId: string,
  title: string,
  excerpt: string | null,
  description: string | null,
  locale: UiLocale,
): ResolvedStoryReaderContent | null {
  if (isCuratedTextbookArtwork(artworkId, title)) {
    const body = loadTextbookBody(locale) ?? loadTextbookBody("ja");
    if (!body) return null;
    const localized = resolveCuratedArtworkFields(artworkId, title, excerpt, locale);
    return {
      title: localized.title ?? title,
      excerpt: localized.story_excerpt ?? excerpt,
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
