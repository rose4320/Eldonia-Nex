import type { UiLocale } from "@/lib/i18n/locale";
import {
  eventFormatLabel,
  eventRealmLabel,
  formatFreePrice,
  formatYenPrice,
  intlDateTag,
  ticketsRemainingLabel,
} from "@/lib/i18n/taxonomy";

export function formatEventDate(
  iso: string,
  locale: UiLocale = "ja",
): { day: string; month: string; time: string; full: string } {
  const d = new Date(iso);
  const tag = intlDateTag(locale);
  return {
    day: d.getDate().toString(),
    month: d.toLocaleDateString(tag, { month: "short" }),
    time: d.toLocaleTimeString(tag, { hour: "2-digit", minute: "2-digit" }),
    full: d.toLocaleDateString(tag, {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export function formatPrice(yen: number, locale: UiLocale = "ja"): string {
  return yen === 0 ? formatFreePrice(locale) : formatYenPrice(yen, locale);
}

export function formatLabel(format: string, locale: UiLocale = "ja"): string {
  return eventFormatLabel(format, locale);
}

export function realmLabel(category: string, locale: UiLocale = "ja"): string {
  return eventRealmLabel(category, locale);
}

export function ticketsRemainingText(
  remaining: number,
  locale: UiLocale = "ja",
): string {
  return ticketsRemainingLabel(remaining, locale);
}

export const EVENT_REALM_VALUES = [
  "all",
  "concert",
  "workshop",
  "meetup",
  "exhibition",
  "streaming",
  "competition",
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  concert: "🎻",
  workshop: "⚒",
  meetup: "⚜",
  exhibition: "🖼",
  streaming: "📡",
  competition: "🏆",
};

export function ticketsRemaining(capacity: number | null, sold: number): number | null {
  if (capacity === null) return null;
  return Math.max(0, capacity - sold);
}

export function isSoldOut(capacity: number | null, sold: number): boolean {
  if (capacity === null) return false;
  return sold >= capacity;
}

export function isPastEvent(startsAt: string): boolean {
  return new Date(startsAt) < new Date();
}
