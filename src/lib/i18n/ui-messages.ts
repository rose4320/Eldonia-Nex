import type { UiLocale } from "@/lib/i18n/locale";
import { getContent } from "@/lib/i18n/content/messages";

export type UiMessageKey =
  | "searchPlaceholder"
  | "searchSubmit"
  | "login"
  | "signup"
  | "logout"
  | "menu"
  | "menuClose"
  | "footerTech"
  | "footerHelp"
  | "footerPartners"
  | "footerSitemap"
  | "footerCopyright"
  | "expNext";

export function uiMessage(locale: UiLocale, key: UiMessageKey): string {
  return getContent(locale).chrome[key];
}
