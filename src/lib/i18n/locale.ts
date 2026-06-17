export const LOCALE_COOKIE = "eldonia_locale";

export const UI_LOCALES = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
  { value: "ko", label: "한국어" },
  { value: "zh-CN", label: "中文" },
] as const;

export type UiLocale = (typeof UI_LOCALES)[number]["value"];

export function parseUiLocale(value: string | undefined): UiLocale {
  if (value === "en" || value === "ko" || value === "zh-CN") return value;
  return "ja";
}
