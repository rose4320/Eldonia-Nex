import type { UiLocale } from "@/lib/i18n/locale";
import type { Quest } from "@/types/database";

const SAMPLE_QUESTS_JA: Quest[] = [
  {
    id: "sample-quest-daily",
    title: "毎日ログイン Quest",
    description:
      "Eldonia-Nex にログインして EXP を獲得しましょう。毎日1回、自動で経験値が付与されます。",
    kind: "daily",
    status: "open",
    exp_reward: 10,
    prize_summary: null,
    submission_hint: null,
    starts_at: null,
    ends_at: null,
    is_featured: false,
    published_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sample-quest-brand",
    title: "新製品PR動画チャレンジ",
    description:
      "指定の新製品をテーマに、60秒以内のPR動画を制作してください。優秀作品には現金5万円または高性能PCを贈呈。",
    kind: "brand",
    status: "open",
    exp_reward: 50,
    prize_summary: "現金5万円 / 高性能PC / 限定グッズ",
    submission_hint: "完成動画のURLを提出してください。",
    starts_at: null,
    ends_at: null,
    is_featured: true,
    published_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function getSampleQuests(_locale: UiLocale = "ja"): Quest[] {
  void _locale;
  return SAMPLE_QUESTS_JA;
}
