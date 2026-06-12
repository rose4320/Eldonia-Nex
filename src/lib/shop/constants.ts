export const SHOP_REALMS = [
  { value: "all", label: "すべての領域" },
  { value: "apparel", label: "アパレル" },
  { value: "digital", label: "デジタル" },
  { value: "goods", label: "グッズ" },
  { value: "tools", label: "クリエイターツール" },
  { value: "books", label: "書籍・資料" },
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  apparel: "🧥",
  digital: "✦",
  goods: "⚱",
  tools: "⚒",
  books: "📜",
};

const REALM_LABELS = Object.fromEntries(
  SHOP_REALMS.filter((r) => r.value !== "all").map((r) => [r.value, r.label]),
) as Record<string, string>;

export function realmLabel(category: string): string {
  return REALM_LABELS[category] ?? category;
}

export function formatPrice(yen: number): string {
  return `¥${yen.toLocaleString("ja-JP")}`;
}

export function discountPercent(
  price: number,
  compareAt: number | null,
): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
