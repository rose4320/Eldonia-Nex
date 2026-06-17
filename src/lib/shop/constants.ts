import type { UiLocale } from "@/lib/i18n/locale";
import { formatYenPrice, shopRealmLabel } from "@/lib/i18n/taxonomy";

export { shopRealmLabel as realmLabel };

export const SHOP_REALM_VALUES = [
  "all",
  "apparel",
  "digital",
  "goods",
  "tools",
  "books",
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  apparel: "🧥",
  digital: "✦",
  goods: "⚱",
  tools: "⚒",
  books: "📜",
};

export function formatPrice(yen: number, locale: UiLocale = "ja"): string {
  return formatYenPrice(yen, locale);
}

export function discountPercent(
  price: number,
  compareAt: number | null,
): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
