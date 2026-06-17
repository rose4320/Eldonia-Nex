import type { UiLocale } from "@/lib/i18n/locale";
import type { JobListingWithPoster, Portfolio } from "@/types/database";

const now = new Date().toISOString();

const SAMPLE_JOBS_JA: JobListingWithPoster[] = [
  {
    id: "00000000-0000-4000-8000-000000000401",
    poster_id: null,
    title: "ファンタジーBGMコンポーザー（短期）",
    description:
      "TRPG用 BGM 5 曲。ダークファンタジー調。リファレンス共有あり。",
    job_type: "freelance",
    location: "リモート",
    budget_min: 80000,
    budget_max: 150000,
    skills_required: ["作曲", "DAW", "オーケストラ"],
    status: "open",
    is_featured: true,
    created_at: now,
    updated_at: now,
    profiles: { display_name: "Game Studio Alpha", username: "studio_alpha" },
  },
  {
    id: "00000000-0000-4000-8000-000000000402",
    poster_id: null,
    title: "キャラクターデザイナー（協業）",
    description: "インディーゲームの主要キャラ 3 体。世界観資料あり。",
    job_type: "collab",
    location: "ハイブリッド",
    budget_min: null,
    budget_max: null,
    skills_required: ["イラスト", "キャラデザ", "Blender"],
    status: "open",
    is_featured: true,
    created_at: now,
    updated_at: now,
    profiles: { display_name: "Indie Forge", username: "indie_forge" },
  },
  {
    id: "00000000-0000-4000-8000-000000000403",
    poster_id: null,
    title: "ライブ2Dモデラー",
    description: "VTuber 向け Live2D モデル制作。分割納品可。",
    job_type: "freelance",
    location: "リモート",
    budget_min: 200000,
    budget_max: 350000,
    skills_required: ["Live2D", "Illustrator"],
    status: "open",
    is_featured: false,
    created_at: now,
    updated_at: now,
    profiles: { display_name: "Stream Nexus", username: "stream_nexus" },
  },
  {
    id: "00000000-0000-4000-8000-000000000404",
    poster_id: null,
    title: "コミュニティモデレーター（パート）",
    description: "Discord / 掲示板のモデレーション。日本語・英語。",
    job_type: "part_time",
    location: "リモート",
    budget_min: 1500,
    budget_max: 2000,
    skills_required: ["モデレーション", "英語"],
    status: "open",
    is_featured: false,
    created_at: now,
    updated_at: now,
    profiles: { display_name: "Eldonia Ops", username: "eldonia_ops" },
  },
];

const SAMPLE_JOBS_EN: JobListingWithPoster[] = [
  {
    id: "00000000-0000-4000-8000-000000000401",
    poster_id: null,
    title: "Fantasy BGM Composer (Short-term)",
    description:
      "Five TRPG background tracks in a dark fantasy style. Reference material provided.",
    job_type: "freelance",
    location: "Remote",
    budget_min: 80000,
    budget_max: 150000,
    skills_required: ["Composition", "DAW", "Orchestration"],
    status: "open",
    is_featured: true,
    created_at: now,
    updated_at: now,
    profiles: { display_name: "Game Studio Alpha", username: "studio_alpha" },
  },
  {
    id: "00000000-0000-4000-8000-000000000402",
    poster_id: null,
    title: "Character Designer (Collaboration)",
    description: "Three lead characters for an indie game. World bible included.",
    job_type: "collab",
    location: "Hybrid",
    budget_min: null,
    budget_max: null,
    skills_required: ["Illustration", "Character design", "Blender"],
    status: "open",
    is_featured: true,
    created_at: now,
    updated_at: now,
    profiles: { display_name: "Indie Forge", username: "indie_forge" },
  },
  {
    id: "00000000-0000-4000-8000-000000000403",
    poster_id: null,
    title: "Live2D Model Artist",
    description: "Live2D model for VTuber use. Milestone deliveries welcome.",
    job_type: "freelance",
    location: "Remote",
    budget_min: 200000,
    budget_max: 350000,
    skills_required: ["Live2D", "Illustrator"],
    status: "open",
    is_featured: false,
    created_at: now,
    updated_at: now,
    profiles: { display_name: "Stream Nexus", username: "stream_nexus" },
  },
  {
    id: "00000000-0000-4000-8000-000000000404",
    poster_id: null,
    title: "Community Moderator (Part-time)",
    description: "Moderate Discord and forums. Japanese and English.",
    job_type: "part_time",
    location: "Remote",
    budget_min: 1500,
    budget_max: 2000,
    skills_required: ["Moderation", "English"],
    status: "open",
    is_featured: false,
    created_at: now,
    updated_at: now,
    profiles: { display_name: "Eldonia Ops", username: "eldonia_ops" },
  },
];

const SAMPLE_JOBS_KO: JobListingWithPoster[] = [
  {
    id: "00000000-0000-4000-8000-000000000401",
    poster_id: null,
    title: "판타지 BGM 작곡가 (단기)",
    description:
      "TRPG용 BGM 5곡. 다크 판타지 톤. 레퍼런스 자료 제공.",
    job_type: "freelance",
    location: "원격",
    budget_min: 80000,
    budget_max: 150000,
    skills_required: ["작곡", "DAW", "오케스트라"],
    status: "open",
    is_featured: true,
    created_at: now,
    updated_at: now,
    profiles: { display_name: "Game Studio Alpha", username: "studio_alpha" },
  },
  {
    id: "00000000-0000-4000-8000-000000000402",
    poster_id: null,
    title: "캐릭터 디자이너 (협업)",
    description: "인디 게임 주요 캐릭터 3명. 세계관 자료 포함.",
    job_type: "collab",
    location: "하이브리드",
    budget_min: null,
    budget_max: null,
    skills_required: ["일러스트", "캐릭터 디자인", "Blender"],
    status: "open",
    is_featured: true,
    created_at: now,
    updated_at: now,
    profiles: { display_name: "Indie Forge", username: "indie_forge" },
  },
  {
    id: "00000000-0000-4000-8000-000000000403",
    poster_id: null,
    title: "Live2D 모델러",
    description: "VTuber용 Live2D 모델 제작. 분할 납품 가능.",
    job_type: "freelance",
    location: "원격",
    budget_min: 200000,
    budget_max: 350000,
    skills_required: ["Live2D", "Illustrator"],
    status: "open",
    is_featured: false,
    created_at: now,
    updated_at: now,
    profiles: { display_name: "Stream Nexus", username: "stream_nexus" },
  },
  {
    id: "00000000-0000-4000-8000-000000000404",
    poster_id: null,
    title: "커뮤니티 모더레이터 (파트)",
    description: "Discord·게시판 모더레이션. 일본어·영어.",
    job_type: "part_time",
    location: "원격",
    budget_min: 1500,
    budget_max: 2000,
    skills_required: ["모더레이션", "영어"],
    status: "open",
    is_featured: false,
    created_at: now,
    updated_at: now,
    profiles: { display_name: "Eldonia Ops", username: "eldonia_ops" },
  },
];

const SAMPLE_JOBS_ZH: JobListingWithPoster[] = [
  {
    id: "00000000-0000-4000-8000-000000000401",
    poster_id: null,
    title: "奇幻 BGM 作曲（短期）",
    description: "TRPG 用 BGM 5 首，暗黑奇幻风格，提供参考素材。",
    job_type: "freelance",
    location: "远程",
    budget_min: 80000,
    budget_max: 150000,
    skills_required: ["作曲", "DAW", "管弦乐"],
    status: "open",
    is_featured: true,
    created_at: now,
    updated_at: now,
    profiles: { display_name: "Game Studio Alpha", username: "studio_alpha" },
  },
  {
    id: "00000000-0000-4000-8000-000000000402",
    poster_id: null,
    title: "角色设计师（协作）",
    description: "独立游戏主要角色 3 名，含世界观资料。",
    job_type: "collab",
    location: "混合",
    budget_min: null,
    budget_max: null,
    skills_required: ["插画", "角色设计", "Blender"],
    status: "open",
    is_featured: true,
    created_at: now,
    updated_at: now,
    profiles: { display_name: "Indie Forge", username: "indie_forge" },
  },
  {
    id: "00000000-0000-4000-8000-000000000403",
    poster_id: null,
    title: "Live2D 建模师",
    description: "VTuber 用 Live2D 模型制作，可分阶段交付。",
    job_type: "freelance",
    location: "远程",
    budget_min: 200000,
    budget_max: 350000,
    skills_required: ["Live2D", "Illustrator"],
    status: "open",
    is_featured: false,
    created_at: now,
    updated_at: now,
    profiles: { display_name: "Stream Nexus", username: "stream_nexus" },
  },
  {
    id: "00000000-0000-4000-8000-000000000404",
    poster_id: null,
    title: "社区版主（兼职）",
    description: "Discord / 论坛版务，需日语与英语。",
    job_type: "part_time",
    location: "远程",
    budget_min: 1500,
    budget_max: 2000,
    skills_required: ["审核", "英语"],
    status: "open",
    is_featured: false,
    created_at: now,
    updated_at: now,
    profiles: { display_name: "Eldonia Ops", username: "eldonia_ops" },
  },
];

/** @deprecated use getSampleJobs(locale) */
export const SAMPLE_JOBS = SAMPLE_JOBS_JA;

export function getSampleJobs(locale: UiLocale): JobListingWithPoster[] {
  switch (locale) {
    case "ja":
      return SAMPLE_JOBS_JA;
    case "ko":
      return SAMPLE_JOBS_KO;
    case "zh-CN":
      return SAMPLE_JOBS_ZH;
    default:
      return SAMPLE_JOBS_EN;
  }
}

const SAMPLE_PORTFOLIO_JA: Portfolio = {
  id: "00000000-0000-4000-8000-000000000501",
  user_id: "demo-user",
  headline: "Dark Fantasy Illustrator",
  summary: "TRPG・ゲーム向けイラスト。Gold & Obsidian テイスト。",
  skills: ["イラスト", "Live2D", "Blender"],
  exp_points: 2400,
  level: 5,
  title_badge: "Nexus Artisan",
  visibility: "public",
  attach_on_apply: true,
  created_at: now,
  updated_at: now,
};

const SAMPLE_PORTFOLIO_EN: Portfolio = {
  ...SAMPLE_PORTFOLIO_JA,
  summary: "Illustration for TRPG and games. Gold & Obsidian aesthetic.",
  skills: ["Illustration", "Live2D", "Blender"],
};

const SAMPLE_PORTFOLIO_KO: Portfolio = {
  ...SAMPLE_PORTFOLIO_JA,
  summary: "TRPG·게임 일러스트. Gold & Obsidian 톤.",
  skills: ["일러스트", "Live2D", "Blender"],
};

const SAMPLE_PORTFOLIO_ZH: Portfolio = {
  ...SAMPLE_PORTFOLIO_JA,
  summary: "TRPG / 游戏插画，Gold & Obsidian 风格。",
  skills: ["插画", "Live2D", "Blender"],
};

/** @deprecated use getSamplePortfolio(locale) */
export const SAMPLE_PORTFOLIO = SAMPLE_PORTFOLIO_JA;

export function getSamplePortfolio(locale: UiLocale): Portfolio {
  switch (locale) {
    case "ja":
      return SAMPLE_PORTFOLIO_JA;
    case "ko":
      return SAMPLE_PORTFOLIO_KO;
    case "zh-CN":
      return SAMPLE_PORTFOLIO_ZH;
    default:
      return SAMPLE_PORTFOLIO_EN;
  }
}
