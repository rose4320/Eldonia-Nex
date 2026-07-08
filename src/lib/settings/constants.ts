import { levelFromExp } from "@/lib/works/constants";

export type SettingsRecommendation = {
  id: string;
  title: string;
  description: string;
  href: string;
  priority: number;
};

export function expForNextLevel(level: number): number {
  return level * 500;
}

export function expProgress(exp: number): {
  level: number;
  current: number;
  needed: number;
  percent: number;
} {
  const level = levelFromExp(exp);
  const prevThreshold = (level - 1) * 500;
  const nextThreshold = level * 500;
  const current = exp - prevThreshold;
  const needed = nextThreshold - prevThreshold;
  const percent = needed > 0 ? Math.min(100, Math.round((current / needed) * 100)) : 100;
  return { level, current, needed, percent };
}

export const SETTINGS_SECTIONS = [
  { id: "recommendations", label: "おすすめ" },
  { id: "basics", label: "基本情報" },
  { id: "posts", label: "投稿" },
  { id: "artworks", label: "作品管理" },
  { id: "portfolio", label: "ポートフォリオ" },
  { id: "finance", label: "収支" },
  { id: "notifications", label: "告知・通知" },
] as const;
