import type { UiLocale } from "@/lib/i18n/locale";
import type { HomeV2ModuleKey } from "@/lib/design/home-v2-assets";

export type HomeV2QuestStepKey = "participate" | "challenge" | "evaluated" | "rewards";
export type HomeV2MetricKey = "exp" | "credit" | "revenue";
export type HomeV2StatKey = "creators" | "quests" | "returns";

export type HomeV2Content = {
  hero: {
    title: string;
    subtitle: string;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: { key: HomeV2StatKey; label: string }[];
  };
  questGuide: {
    eyebrow: string;
    steps: { key: HomeV2QuestStepKey; title: string; body: string }[];
    metrics: { key: HomeV2MetricKey; label: string; body: string }[];
  };
  modules: {
    eyebrow: string;
    title: string;
    items: { key: HomeV2ModuleKey; name: string; body: string; link: string }[];
  };
  featuredWorks: {
    eyebrow: string;
    title: string;
    lead: string;
    empty: string;
    viewAll: string;
    views: string;
  };
  openQuests: {
    eyebrow: string;
    title: string;
    empty: string;
    viewAll: string;
  };
  investor: {
    eyebrow: string;
    title: string;
    lead: string;
    perks: { title: string; body: string }[];
    serialTitle: string;
    serialFormat: string;
    serialParts: { part: string; label: string }[];
    cta: string;
  };
  categories: {
    title: string;
    items: { num: string; label: string }[];
    cta: string;
    ctaLead: string;
  };
};

const HOME_V2_JA: HomeV2Content = {
  hero: {
    title: "Quest. Create. Earn.",
    subtitle: "冒険が、創造を動かし、未来をつくる。",
    lead:
      "Eldonia-Nex は、Quest・作品・コマース・コミュニティがひとつの循環になる創作経済圏です。経験値と信用が可視化され、挑戦が収益へつながる Nexus へ。",
    ctaPrimary: "無料で始める",
    ctaSecondary: "Questを探す",
    stats: [
      { key: "creators", label: "Creators" },
      { key: "quests", label: "Quests in progress" },
      { key: "returns", label: "Creator Returns" },
    ],
  },
  questGuide: {
    eyebrow: "Questとは？",
    steps: [
      { key: "participate", title: "参加する", body: "Quest に応募し、挑戦を始める" },
      { key: "challenge", title: "挑戦する", body: "作品・実績・協力で成果を出す" },
      { key: "evaluated", title: "評価される", body: "EXP・称号・信用が可視化される" },
      { key: "rewards", title: "報酬を得る", body: "還元・依頼・販売へつながる" },
    ],
    metrics: [
      { key: "exp", label: "EXP", body: "行動が経験値として蓄積" },
      { key: "credit", label: "信用", body: "ポートフォリオと称号が信頼に" },
      { key: "revenue", label: "収益", body: "創作活動が還元ループへ" },
    ],
  },
  modules: {
    eyebrow: "Creator Modules",
    title: "創作経済圏の6つの扉",
    items: [
      {
        key: "quest",
        name: "Quest",
        body: "求人・協業・制作依頼を Quest として発見・応募",
        link: "Questを探す →",
      },
      {
        key: "gallery",
        name: "Gallery",
        body: "作品を公開し、ファンと評価を獲得",
        link: "Galleryを見る →",
      },
      {
        key: "shop",
        name: "Shop",
        body: "デジタル・物理商品を出品・販売",
        link: "Shopへ →",
      },
      {
        key: "events",
        name: "Events",
        body: "ライブ・WS・展示などイベントを開催",
        link: "Eventsへ →",
      },
      {
        key: "community",
        name: "Community",
        body: "スレッドと交流でコミュニティを育てる",
        link: "Communityへ →",
      },
      {
        key: "works",
        name: "Works",
        body: "ポートフォリオと Quest 管理の拠点",
        link: "Worksへ →",
      },
    ],
  },
  featuredWorks: {
    eyebrow: "Top User Works",
    title: "トップユーザー作品",
    lead: "閲覧数の高い公開作品を、Nexus の入口から紹介します。",
    empty: "公開作品はまだありません。最初の作品がここに刻まれます。",
    viewAll: "Galleryを見る →",
    views: "閲覧",
  },
  openQuests: {
    eyebrow: "Guild Quest Board",
    title: "公開中の Quest",
    empty: "公開中のQuestは準備中です。WORKSで最初の募集を作成できます。",
    viewAll: "すべて見る →",
  },
  investor: {
    eyebrow: "Investors & Supporters",
    title: "初期支援者・共創パートナーを募集しています",
    lead:
      "Eldonia-Nex は広告依存ではなく、クリエイターの成功に連動する成長モデルです。初期支援にはシリアル番号入りピンバッジを贈呈します。",
    perks: [
      { title: "初期参加", body: "ローンチ前から Nexus の設計に関与" },
      { title: "限定コミュニティ", body: "支援者向けディスカッションへ招待" },
      { title: "特別還元", body: "将来の還元・特典設計を優先案内" },
    ],
    serialTitle: "シリアル番号の意味",
    serialFormat: "24-01-0001",
    serialParts: [
      { part: "24", label: "参加年" },
      { part: "01", label: "カテゴリ（Investor / Partner 等）" },
      { part: "0001", label: "通し番号" },
    ],
    cta: "詳しく見る・お問い合わせ",
  },
  categories: {
    title: "支援カテゴリ",
    items: [
      { num: "01", label: "Investor" },
      { num: "02", label: "Partner" },
      { num: "03", label: "Advisor" },
      { num: "04", label: "Media" },
      { num: "05", label: "Community" },
    ],
    cta: "お問い合わせ",
    ctaLead: "ご関心をお持ちの方は、お気軽にご連絡ください。",
  },
};

const HOME_V2_EN: HomeV2Content = {
  hero: {
    title: "Quest. Create. Earn.",
    subtitle: "Adventure drives creation — and creation shapes the future.",
    lead:
      "Eldonia-Nex is a creator economy where quests, works, commerce, and community form one loop. EXP and trust become visible, and every challenge can lead to revenue.",
    ctaPrimary: "Start for free",
    ctaSecondary: "Find Quests",
    stats: [
      { key: "creators", label: "Creators" },
      { key: "quests", label: "Quests in progress" },
      { key: "returns", label: "Creator Returns" },
    ],
  },
  questGuide: {
    eyebrow: "What is a Quest?",
    steps: [
      { key: "participate", title: "Participate", body: "Apply to a Quest and begin the challenge" },
      { key: "challenge", title: "Challenge", body: "Deliver work, results, and collaboration" },
      { key: "evaluated", title: "Get evaluated", body: "EXP, titles, and trust become visible" },
      { key: "rewards", title: "Earn rewards", body: "Connect to returns, commissions, and sales" },
    ],
    metrics: [
      { key: "exp", label: "EXP", body: "Actions accumulate as experience" },
      { key: "credit", label: "Trust", body: "Portfolio and titles build credibility" },
      { key: "revenue", label: "Revenue", body: "Creative activity feeds the return loop" },
    ],
  },
  modules: {
    eyebrow: "Creator Modules",
    title: "Six doors into the creator economy",
    items: [
      {
        key: "quest",
        name: "Quest",
        body: "Discover and apply to jobs, collaborations, and commissions",
        link: "Find Quests →",
      },
      {
        key: "gallery",
        name: "Gallery",
        body: "Publish work and earn fans and recognition",
        link: "View Gallery →",
      },
      {
        key: "shop",
        name: "Shop",
        body: "List and sell digital and physical goods",
        link: "Go to Shop →",
      },
      {
        key: "events",
        name: "Events",
        body: "Host live shows, workshops, and exhibitions",
        link: "Go to Events →",
      },
      {
        key: "community",
        name: "Community",
        body: "Grow community through threads and conversation",
        link: "Go to Community →",
      },
      {
        key: "works",
        name: "Works",
        body: "Your hub for portfolio and Quest management",
        link: "Go to Works →",
      },
    ],
  },
  featuredWorks: {
    eyebrow: "Top User Works",
    title: "Featured public works",
    lead: "High-view public works appear at the gateway to the Nexus.",
    empty: "No public works yet. The first work will be engraved here.",
    viewAll: "View Gallery →",
    views: "views",
  },
  openQuests: {
    eyebrow: "Guild Quest Board",
    title: "Open Quests",
    empty: "No open quests yet. Create the first listing in WORKS.",
    viewAll: "View all →",
  },
  investor: {
    eyebrow: "Investors & Supporters",
    title: "We welcome early supporters and co-build partners",
    lead:
      "Eldonia-Nex grows with creator success, not ad dependence. Early supporters receive a serial-numbered pin badge.",
    perks: [
      { title: "Early participation", body: "Shape the Nexus before launch" },
      { title: "Private community", body: "Join supporter-only discussions" },
      { title: "Priority returns", body: "First access to future return and perk design" },
    ],
    serialTitle: "Serial number meaning",
    serialFormat: "24-01-0001",
    serialParts: [
      { part: "24", label: "Join year" },
      { part: "01", label: "Category (Investor / Partner, etc.)" },
      { part: "0001", label: "Sequence number" },
    ],
    cta: "Learn more & contact",
  },
  categories: {
    title: "Support categories",
    items: [
      { num: "01", label: "Investor" },
      { num: "02", label: "Partner" },
      { num: "03", label: "Advisor" },
      { num: "04", label: "Media" },
      { num: "05", label: "Community" },
    ],
    cta: "Contact us",
    ctaLead: "If you are interested, we would love to hear from you.",
  },
};

const HOME_V2_KO: HomeV2Content = {
  ...HOME_V2_EN,
  hero: {
    ...HOME_V2_EN.hero,
    subtitle: "모험이 창작을 움직이고, 미래를 만듭니다.",
    lead:
      "Eldonia-Nex는 Quest·작품·커머스·커뮤니티가 하나의 순환을 이루는 창작 경제권입니다. EXP와 신뢰가 가시화되고, 도전이 수익으로 이어집니다.",
    ctaPrimary: "무료로 시작",
    ctaSecondary: "Quest 찾기",
  },
  questGuide: {
    eyebrow: "Quest란?",
    steps: [
      { key: "participate", title: "참여", body: "Quest에 지원하고 도전을 시작" },
      { key: "challenge", title: "도전", body: "작품·성과·협업으로 결과를 만듦" },
      { key: "evaluated", title: "평가", body: "EXP·칭호·신뢰가 가시화" },
      { key: "rewards", title: "보상", body: "환원·의뢰·판매로 연결" },
    ],
    metrics: [
      { key: "exp", label: "EXP", body: "행동이 경험치로 축적" },
      { key: "credit", label: "신뢰", body: "포트폴리오와 칭호가 신뢰로" },
      { key: "revenue", label: "수익", body: "창작 활동이 환원 루프로" },
    ],
  },
  modules: {
    ...HOME_V2_EN.modules,
    title: "창작 경제권의 6개의 문",
  },
  featuredWorks: {
    eyebrow: "Top User Works",
    title: "주요 사용자 작품",
    lead: "조회수가 높은 공개 작품을 Nexus 입구에서 소개합니다.",
    empty: "아직 공개 작품이 없습니다. 첫 작품이 이곳에 새겨집니다.",
    viewAll: "Gallery 보기 →",
    views: "조회",
  },
  openQuests: {
    eyebrow: "Guild Quest Board",
    title: "공개 Quest",
    empty: "공개 Quest가 아직 없습니다. WORKS에서 첫 모집을 만들 수 있습니다.",
    viewAll: "모두 보기 →",
  },
  investor: {
    ...HOME_V2_EN.investor,
    title: "초기 후원자·공동 창작 파트너를 모집합니다",
    lead:
      "Eldonia-Nex는 광고 의존이 아닌, 크리에이터 성공과 연동된 성장 모델입니다. 초기 후원자에게 시리얼 번호 핀 배지를 드립니다.",
    perks: [
      { title: "초기 참여", body: "런치 전부터 Nexus 설계에 참여" },
      { title: "한정 커뮤니티", body: "후원자 전용 토론에 초대" },
      { title: "특별 환원", body: "향후 환원·특전 설계 우선 안내" },
    ],
    serialTitle: "시리얼 번호 의미",
    serialParts: [
      { part: "24", label: "참여 연도" },
      { part: "01", label: "카테고리 (Investor / Partner 등)" },
      { part: "0001", label: "일련 번호" },
    ],
    cta: "자세히 보기·문의",
  },
  categories: {
    title: "후원 카테고리",
    items: HOME_V2_EN.categories.items,
    cta: "문의하기",
    ctaLead: "관심이 있으시면 편하게 연락 주세요.",
  },
};

const HOME_V2_ZH: HomeV2Content = {
  ...HOME_V2_EN,
  hero: {
    ...HOME_V2_EN.hero,
    subtitle: "冒险驱动创作，创作塑造未来。",
    lead:
      "Eldonia-Nex 是 Quest、作品、商业与社区形成同一循环的创作者经济体。EXP 与信用可见，挑战可通向收益。",
    ctaPrimary: "免费开始",
    ctaSecondary: "寻找 Quest",
  },
  questGuide: {
    eyebrow: "什么是 Quest？",
    steps: [
      { key: "participate", title: "参与", body: "申请 Quest，开始挑战" },
      { key: "challenge", title: "挑战", body: "以作品、成果与协作交付结果" },
      { key: "evaluated", title: "被评价", body: "EXP、称号与信用被可视化" },
      { key: "rewards", title: "获得回报", body: "连接返还、委托与销售" },
    ],
    metrics: [
      { key: "exp", label: "EXP", body: "行动累积为经验值" },
      { key: "credit", label: "信用", body: "作品集与称号建立信任" },
      { key: "revenue", label: "收益", body: "创作活动进入返还循环" },
    ],
  },
  modules: {
    ...HOME_V2_EN.modules,
    title: "创作经济体的六扇门",
  },
  featuredWorks: {
    eyebrow: "Top User Works",
    title: "热门用户作品",
    lead: "在 Nexus 入口展示高浏览量的公开作品。",
    empty: "暂无公开作品。第一件作品将在这里被铭刻。",
    viewAll: "查看 Gallery →",
    views: "浏览",
  },
  openQuests: {
    eyebrow: "Guild Quest Board",
    title: "公开 Quest",
    empty: "暂无公开 Quest。可在 WORKS 创建第一条募集。",
    viewAll: "查看全部 →",
  },
  investor: {
    ...HOME_V2_EN.investor,
    title: "招募早期支持者与共创伙伴",
    lead:
      "Eldonia-Nex 不与广告绑定，而与创作者成功同频增长。早期支持者将获得带序列号的徽章。",
    perks: [
      { title: "早期参与", body: "在上线前参与 Nexus 设计" },
      { title: "限定社区", body: "受邀进入支持者讨论" },
      { title: "优先返还", body: "优先获知未来返还与特典设计" },
    ],
    serialTitle: "序列号含义",
    serialParts: [
      { part: "24", label: "参与年份" },
      { part: "01", label: "类别（Investor / Partner 等）" },
      { part: "0001", label: "通序号" },
    ],
    cta: "了解更多并联系",
  },
  categories: {
    title: "支援类别",
    items: HOME_V2_EN.categories.items,
    cta: "联系我们",
    ctaLead: "如有兴趣，欢迎随时联系。",
  },
};

export const HOME_V2_CONTENT: Record<UiLocale, HomeV2Content> = {
  ja: HOME_V2_JA,
  en: HOME_V2_EN,
  ko: HOME_V2_KO,
  "zh-CN": HOME_V2_ZH,
};

export function getHomeV2Content(locale: UiLocale): HomeV2Content {
  return HOME_V2_CONTENT[locale] ?? HOME_V2_JA;
}

export const HOME_MODULE_HREFS: Record<HomeV2ModuleKey, string> = {
  quest: "/works",
  gallery: "/gallery",
  shop: "/shop",
  events: "/events",
  community: "/community",
  works: "/works",
};
