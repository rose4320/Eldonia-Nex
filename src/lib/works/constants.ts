import { intlLocale } from "@/lib/i18n/content/messages";
import type { UiLocale } from "@/lib/i18n/locale";
import { jobTypeLabel as taxonomyJobTypeLabel } from "@/lib/i18n/taxonomy";

export const JOB_TYPE_VALUES = [
  "freelance",
  "full_time",
  "part_time",
  "collab",
] as const;

export function jobTypeLabel(value: string, locale: UiLocale = "ja"): string {
  return taxonomyJobTypeLabel(value, locale);
}

export function formatBudget(
  min: number | null,
  max: number | null,
  locale: UiLocale = "ja",
): string {
  const negotiable: Record<UiLocale, string> = {
    ja: "応相談",
    en: "Negotiable",
    ko: "협의",
    "zh-CN": "面议",
  };
  if (min === null && max === null) return negotiable[locale];
  const tag = intlLocale(locale);
  if (min !== null && max !== null) {
    return `¥${min.toLocaleString(tag)} 〜 ¥${max.toLocaleString(tag)}`;
  }
  if (min !== null) return `¥${min.toLocaleString(tag)} 〜`;
  return `〜 ¥${max!.toLocaleString(tag)}`;
}

export function levelFromExp(exp: number): number {
  return Math.max(1, Math.floor(exp / 500) + 1);
}

export const PORTFOLIO_VISIBILITY_VALUES = ["public", "employers_only", "private"] as const;

export const PORTFOLIO_VISIBILITY = [
  { value: "public", label: "公開" },
  { value: "employers_only", label: "求人主のみ" },
  { value: "private", label: "非公開" },
] as const;
