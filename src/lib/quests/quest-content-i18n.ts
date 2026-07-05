import type { UiLocale } from "@/lib/i18n/locale";
import type { Quest } from "@/types/database";

type QuestText = {
  title: string;
  description: string;
  prizeSummary?: string | null;
};

/**
 * シード Quest の多言語辞書。
 * キーは DB に保存されているベース（日本語）タイトル。
 * 本格運用で quests テーブルに翻訳列（*_i18n）を持たせるまでの暫定対応。
 */
const QUEST_I18N: Record<string, Partial<Record<UiLocale, QuestText>>> = {
  "毎日ログイン Quest": {
    en: {
      title: "Daily Login Quest",
      description:
        "Log in to Eldonia-Nex to earn EXP. Experience points are granted automatically once per day.",
    },
    ko: {
      title: "매일 로그인 Quest",
      description:
        "Eldonia-Nex에 로그인하여 EXP를 획득하세요. 매일 1회 자동으로 경험치가 지급됩니다.",
    },
    "zh-CN": {
      title: "每日登录 Quest",
      description: "登录 Eldonia-Nex 即可获得 EXP。每天自动发放一次经验值。",
    },
  },
  "新製品PR動画チャレンジ": {
    en: {
      title: "New Product PR Video Challenge",
      description:
        "Create a PR video of up to 60 seconds themed on the specified new product. Outstanding works receive 50,000 yen in cash or a high-spec PC. All participants earn EXP and a portfolio record.",
      prizeSummary: "¥50,000 cash / High-spec PC / Limited goods",
    },
    ko: {
      title: "신제품 PR 영상 챌린지",
      description:
        "지정된 신제품을 주제로 60초 이내의 PR 영상을 제작하세요. 우수 작품에는 현금 5만 엔 또는 고성능 PC를 증정합니다. 참가자 전원에게 EXP와 포트폴리오 실적이 기록됩니다.",
      prizeSummary: "현금 5만 엔 / 고성능 PC / 한정 굿즈",
    },
    "zh-CN": {
      title: "新产品 PR 视频挑战",
      description:
        "以指定的新产品为主题，制作 60 秒以内的 PR 视频。优秀作品将获得 5 万日元现金或高性能 PC。所有参与者都会获得 EXP 和作品集记录。",
      prizeSummary: "5万日元现金 / 高性能PC / 限定周边",
    },
  },
  "初めてのGallery投稿": {
    en: {
      title: "Your First Gallery Post",
      description:
        "Publish at least one work in the Gallery and take your first step as a creator.",
    },
    ko: {
      title: "첫 Gallery 게시",
      description:
        "Gallery에 작품을 1점 이상 공개하고 크리에이터로서 첫걸음을 내디뎌 보세요.",
    },
    "zh-CN": {
      title: "首次 Gallery 投稿",
      description: "在 Gallery 公开至少一件作品，迈出成为创作者的第一步。",
    },
  },
};

export type LocalizedQuest = {
  title: string;
  description: string;
  prizeSummary: string | null;
};

/** UI 言語に合わせて Quest の表示テキストを解決する（未対応は日本語ベースにフォールバック） */
export function localizeQuest(quest: Quest, locale: UiLocale): LocalizedQuest {
  const base: LocalizedQuest = {
    title: quest.title,
    description: quest.description,
    prizeSummary: quest.prize_summary ?? null,
  };

  if (locale === "ja") return base;

  const entry = QUEST_I18N[quest.title.trim()]?.[locale];
  if (!entry) return base;

  return {
    title: entry.title ?? base.title,
    description: entry.description ?? base.description,
    prizeSummary: entry.prizeSummary ?? base.prizeSummary,
  };
}
