import { createHash } from "node:crypto";

import type { ContentTranslationLocale } from "@/lib/translation/config";

export function normalizeTranslationText(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

export function createTranslationHash(params: {
  sourceLocale: ContentTranslationLocale;
  targetLocale: ContentTranslationLocale;
  text: string;
}): string {
  const normalizedText = normalizeTranslationText(params.text);

  return createHash("sha256")
    .update(`${params.sourceLocale}:${params.targetLocale}:${normalizedText}`)
    .digest("hex");
}

export function shouldTranslate(params: {
  sourceLocale: ContentTranslationLocale;
  targetLocale: ContentTranslationLocale;
  text: string;
}): boolean {
  return params.sourceLocale !== params.targetLocale && normalizeTranslationText(params.text).length > 0;
}
