import type { UiLocale } from "@/lib/i18n/locale";

export const CONTENT_TRANSLATION_LOCALES = ["ja", "en", "ko", "zh-CN"] as const satisfies readonly UiLocale[];

export type ContentTranslationLocale = (typeof CONTENT_TRANSLATION_LOCALES)[number];

export const TRANSLATION_PROVIDERS = ["manual", "google", "openai", "deepl"] as const;

export type TranslationProvider = (typeof TRANSLATION_PROVIDERS)[number];

export const DEFAULT_MACHINE_TRANSLATION_PROVIDER = "google" satisfies TranslationProvider;

export const TRANSLATABLE_ENTITIES = [
  "quest",
  "artwork",
  "profile",
  "works_listing",
  "event",
  "community_post",
  "community_comment",
] as const;

export type TranslatableEntity = (typeof TRANSLATABLE_ENTITIES)[number];

export type TranslationField = {
  entityType: TranslatableEntity;
  entityId: string;
  fieldName: string;
  sourceLocale: ContentTranslationLocale;
  sourceText: string;
  targetLocales?: readonly ContentTranslationLocale[];
};

export type TranslationResult = {
  targetLocale: ContentTranslationLocale;
  provider: TranslationProvider;
  translatedText: string;
  sourceHash: string;
};
