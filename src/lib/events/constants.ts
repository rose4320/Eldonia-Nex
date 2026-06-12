export const EVENT_REALMS = [
  { value: "all", label: "すべての領域" },
  { value: "concert", label: "ライブ・演奏" },
  { value: "workshop", label: "ワークショップ" },
  { value: "meetup", label: "交流会・サミット" },
  { value: "exhibition", label: "展示・展覧会" },
  { value: "streaming", label: "配信・オンライン" },
  { value: "competition", label: "コンテスト" },
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  concert: "🎻",
  workshop: "⚒",
  meetup: "⚜",
  exhibition: "🖼",
  streaming: "📡",
  competition: "🏆",
};

const REALM_LABELS = Object.fromEntries(
  EVENT_REALMS.filter((r) => r.value !== "all").map((r) => [r.value, r.label]),
) as Record<string, string>;

export function realmLabel(category: string): string {
  return REALM_LABELS[category] ?? category;
}

export function formatLabel(format: string): string {
  if (format === "online") return "オンライン";
  if (format === "hybrid") return "ハイブリッド";
  return "会場";
}

export function formatPrice(yen: number): string {
  return yen === 0 ? "無料" : `¥${yen.toLocaleString("ja-JP")}`;
}

export function formatEventDate(iso: string): { day: string; month: string; time: string; full: string } {
  const d = new Date(iso);
  return {
    day: d.getDate().toString(),
    month: d.toLocaleDateString("ja-JP", { month: "short" }),
    time: d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
    full: d.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

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
