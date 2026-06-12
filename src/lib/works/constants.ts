export const JOB_TYPES = [
  { value: "freelance", label: "フリーランス" },
  { value: "full_time", label: "正社員" },
  { value: "part_time", label: "パート・アルバイト" },
  { value: "collab", label: "協業・コラボ" },
] as const;

export function jobTypeLabel(value: string): string {
  return JOB_TYPES.find((t) => t.value === value)?.label ?? value;
}

export function formatBudget(min: number | null, max: number | null): string {
  if (min === null && max === null) return "応相談";
  if (min !== null && max !== null) {
    return `¥${min.toLocaleString("ja-JP")} 〜 ¥${max.toLocaleString("ja-JP")}`;
  }
  if (min !== null) return `¥${min.toLocaleString("ja-JP")} 〜`;
  return `〜 ¥${max!.toLocaleString("ja-JP")}`;
}

export function levelFromExp(exp: number): number {
  return Math.max(1, Math.floor(exp / 500) + 1);
}

export const PORTFOLIO_VISIBILITY = [
  { value: "public", label: "公開" },
  { value: "employers_only", label: "求人主のみ" },
  { value: "private", label: "非公開" },
] as const;
