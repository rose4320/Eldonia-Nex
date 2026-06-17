import type { UiLocale } from "@/lib/i18n/locale";
import { intlLocale } from "@/lib/i18n/content/messages";

export const COMMUNITY_BOARDS = [
  { slug: "general", name: "General Hall", description: "総合・雑談" },
  { slug: "gallery", name: "Gallery Circle", description: "GALLEY 作品" },
  { slug: "shop", name: "Merchant Row", description: "SHOP・取引" },
  { slug: "events", name: "Chronicle Plaza", description: "EVENTS" },
  { slug: "works", name: "Guild Board", description: "WORKS・協業" },
  { slug: "lore", name: "Ancient Lore", description: "世界観・考察" },
] as const;

export const LOCALE_LABELS: Record<string, string> = {
  ja: "日本語",
  en: "English",
  ko: "한국어",
  "zh-CN": "中文",
};

export function formatRelativeTime(iso: string, locale: UiLocale = "ja"): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const rtf = new Intl.RelativeTimeFormat(intlLocale(locale), { numeric: "auto" });

  if (mins < 60) {
    return rtf.format(-Math.max(1, mins), "minute");
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return rtf.format(-hours, "hour");
  }
  const days = Math.floor(hours / 24);
  return rtf.format(-days, "day");
}

export function boardBySlug(slug: string) {
  return COMMUNITY_BOARDS.find((b) => b.slug === slug);
}
