import type { UiLocale } from "@/lib/i18n/locale";
import type { QuestKind } from "@/types/database";

const QUEST_KIND_LABELS: Record<QuestKind, Record<UiLocale, string>> = {
  daily: {
    ja: "デイリー",
    en: "Daily",
    ko: "데일리",
    "zh-CN": "每日",
  },
  brand: {
    ja: "企業案件",
    en: "Brand",
    ko: "브랜드",
    "zh-CN": "企业",
  },
  community: {
    ja: "コミュニティ",
    en: "Community",
    ko: "커뮤니티",
    "zh-CN": "社区",
  },
};

export function questKindLabel(kind: QuestKind, locale: UiLocale): string {
  return QUEST_KIND_LABELS[kind][locale] ?? QUEST_KIND_LABELS[kind].ja;
}

export function questKindOptions(locale: UiLocale): { value: string; label: string }[] {
  return [
    { value: "daily", label: questKindLabel("daily", locale) },
    { value: "brand", label: questKindLabel("brand", locale) },
    { value: "community", label: questKindLabel("community", locale) },
  ];
}

export function formatQuestReward(expReward: number, locale: UiLocale): string {
  const tag =
    locale === "ja" ? "ja-JP" : locale === "ko" ? "ko-KR" : locale === "zh-CN" ? "zh-CN" : "en-US";
  return `+${expReward.toLocaleString(tag)} EXP`;
}
