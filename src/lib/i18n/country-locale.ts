import type { UiLocale } from "@/lib/i18n/locale";

const COUNTRY_LOCALE: Record<string, UiLocale> = {
  JP: "ja",
  KR: "ko",
  CN: "zh-CN",
  TW: "zh-CN",
  HK: "zh-CN",
  MO: "zh-CN",
};

/** ISO 3166-1 alpha-2 国コードから UI 言語を推定する */
export function localeFromCountry(countryCode: string | null | undefined): UiLocale {
  const code = countryCode?.trim().toUpperCase();
  if (!code) return "en";
  return COUNTRY_LOCALE[code] ?? "en";
}
