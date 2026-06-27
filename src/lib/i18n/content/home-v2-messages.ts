import type { UiLocale } from "@/lib/i18n/locale";
import type { HomeV2ModuleKey } from "@/lib/design/home-v2-assets";

export type { HomeV2ModuleKey };

export type HomeV2QuestStepKey = "participate" | "challenge" | "evaluated" | "rewards";
export type HomeV2MetricKey = "exp" | "credit" | "revenue";
export type HomeV2StatKey = "creators" | "quests" | "returns";

export type HomeV2CirculationStepKey =
  | "publish"
  | "fans"
  | "quality"
  | "create"
  | "expand"
  | "loop";

export type HomeV2CirculationStep = {
  key: HomeV2CirculationStepKey;
  title: string;
  body: string;
  modules: HomeV2ModuleKey[];
};

export type HomeV2SeoModuleDetail = {
  key: HomeV2ModuleKey;
  heading: string;
  body: string;
  linkLabel: string;
};

export type HomeV2Content = {
  seo: {
    metaTitle: string;
    metaDescription: string;
    platformHeading: string;
    platformBody: string;
    modulesHeading: string;
    moduleDetails: HomeV2SeoModuleDetail[];
  };
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
    circulation: {
      eyebrow: string;
      title: string;
      lead: string;
      loopLabel: string;
      steps: HomeV2CirculationStep[];
    };
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
  seo: {
    metaTitle:
      "Eldonia-Nex｜イラスト投稿・Quest・同人グッズ販売の総合プラットフォーム",
    metaDescription:
      "イラスト・VTuber・ゲームクリエイター向けのクリエイターコミュニティ＆ポートフォリオサイト。作品投稿、Quest挑戦、同人グッズ販売、VTuberイベント、コミュニティ交流まで、創作活動をひとつのNexusで。",
    platformHeading: "イラスト・VTuber・ゲームクリエイターのための総合プラットフォーム",
    platformBody:
      "Eldonia-Nex（エルドニア・ネックス）は、イラスト投稿サイトとしての作品公開、Questによる挑戦とEXP獲得、ポートフォリオ作成、同人グッズ販売、VTuberイベントの開催、クリエイターコミュニティでの交流をひとつにつなぐ総合プラットフォームです。AI作品にも対応し、タグ検索で作品を発見できます。作品を投稿し、Questに参加し、Shopで販売し、Eventsでファンと出会う——創作活動の循環を、ブランド性を保ちながら検索エンジンにも伝わる形で提供します。",
    modulesHeading: "6つのモジュールで創作活動を支える",
    moduleDetails: [
      {
        key: "gallery",
        heading: "Galleryとは",
        body:
          "Galleryは、Eldonia-Nexのイラスト投稿サイトです。イラスト・漫画・3D・AI作品などを公開でき、タグ検索で作品を見つけられます。ポートフォリオとして作品を蓄積し、閲覧数や評価を通じてクリエイターの信用を可視化します。ファンとの接点にもなり、ShopやEventsへの導線にもつながります。",
        linkLabel: "Galleryで作品を見る",
      },
      {
        key: "works",
        heading: "Worksとは",
        body:
          "Worksは、ポートフォリオ管理とQuest参加実績の拠点です。Galleryの作品、Questでの挑戦記録、協業・受賞履歴を一覧し、クリエイターとしての信用を可視化します。",
        linkLabel: "Worksでポートフォリオを見る",
      },
      {
        key: "shop",
        heading: "Shopとは",
        body:
          "Shopは、同人グッズ販売やデジタル素材の販売に対応するECモジュールです。クリエイターが作品を商品化し、ファンへ直接届けられます。グッズ、DLデータ、限定商品など、創作活動の収益化を支援します。Galleryで公開した作品からShopへの導線も自然につながります。",
        linkLabel: "Shopで商品を見る",
      },
      {
        key: "events",
        heading: "Eventsとは",
        body:
          "Eventsは、VTuberイベント、ライブ配信、ワークショップ、展示会などの開催・参加を支援するモジュールです。オンライン・オフラインのイベント情報を一覧し、チケット申込や告知にも対応します。ファンとのリアルタイムな交流を生み出し、CommunityやGalleryと連携した企画も可能です。",
        linkLabel: "Eventsを見る",
      },
      {
        key: "community",
        heading: "Communityとは",
        body:
          "Communityは、クリエイターコミュニティとしてスレッド形式の掲示板で交流できるモジュールです。作品感想、制作相談、Quest情報の共有など、創作者同士の対話に最適です。Galleryの作品やEventsの告知とも自然につながり、サイト内の回遊性も高めます。",
        linkLabel: "Communityに参加する",
      },
      {
        key: "quest",
        heading: "Questとは",
        body:
          "Questは、管理者がユーザーへ投げかける挑戦の単位です。毎日ログインなどの簡単なQuestでEXPを獲得したり、企業案件では「新製品のPR動画を作れ」といった創作課題に挑戦できます。優秀作品には現金・PC・商品などのプレゼントが贈られ、参加者全員にEXPが付与され、ポートフォリオにも実績が記録されます。",
        linkLabel: "Questに参加する",
      },
    ],
  },
  hero: {
    title: "Eldonia-Nex",
    subtitle: "イラスト・VTuber・ゲームクリエイターのための総合プラットフォーム",
    lead:
      "イラスト投稿サイト、Quest挑戦、ポートフォリオ作成、同人グッズ販売、VTuberイベント、クリエイターコミュニティ——作品・EXP・コマースがひとつの循環になる創作経済圏です。",
    ctaPrimary: "無料で始める",
    ctaSecondary: "Questに参加する",
    stats: [
      { key: "creators", label: "Creators" },
      { key: "quests", label: "Quests in progress" },
      { key: "returns", label: "Creator Returns" },
    ],
  },
  questGuide: {
    eyebrow: "Questとは？",
    steps: [
      { key: "participate", title: "参加する", body: "管理者が公開したQuestを選び、条件を確認して参加する" },
      { key: "challenge", title: "挑戦する", body: "ログインや作品制作など、Questの課題に取り組む" },
      { key: "evaluated", title: "評価される", body: "EXPが付与され、挑戦記録がポートフォリオに残る" },
      { key: "rewards", title: "報酬を得る", body: "優秀作品は現金・PC・商品など。全参加者にEXP" },
    ],
    metrics: [
      { key: "exp", label: "EXP", body: "Quest参加・ログイン等が経験値に" },
      { key: "credit", label: "信用", body: "Quest実績がポートフォリオの信頼に" },
      { key: "revenue", label: "特典", body: "企業案件Questで現金・商品・PCなど" },
    ],
  },
  modules: {
    eyebrow: "Creator Modules",
    title: "創作経済圏の6つの扉",
    circulation: {
      eyebrow: "Creator Circulation",
      title: "創作経済圏の巡回",
      lead:
        "作品にファンが付き、クオリティと評価が育ち、新たな作品とスピンオフが生まれる——6つの扉はこの循環を止めません。",
      loopLabel: "循環",
      steps: [
        {
          key: "publish",
          title: "作品を公開",
          body: "Galleryで作品を届け、最初の露出と反応を得る",
          modules: ["gallery"],
        },
        {
          key: "fans",
          title: "ファンが集まる",
          body: "CommunityとEventsで応援が集まり、作品に物語が付いていく",
          modules: ["community", "events"],
        },
        {
          key: "quality",
          title: "評価が育つ",
          body: "いいね・閲覧・EXPでクオリティと信用が可視化され、次の依頼への信頼になる",
          modules: ["gallery", "works"],
        },
        {
          key: "create",
          title: "新たな創作へ",
          body: "Quest参加でEXPと実績が積み、企業案件では賞品付きの挑戦にも",
          modules: ["quest", "works"],
        },
        {
          key: "expand",
          title: "世界が広がる",
          body: "Shopのグッズ化やEventsのスピンオフ企画で、作品の幅とファン層が拡張する",
          modules: ["shop", "events"],
        },
        {
          key: "loop",
          title: "再び循環する",
          body: "還元・信用・収益が次の扉へ還流し、創作経済圏は止まらない",
          modules: ["gallery", "shop", "community"],
        },
      ],
    },
    items: [
      {
        key: "quest",
        name: "Quest",
        body: "管理者発信の挑戦。ログインでEXP、企業案件では賞品付き創作Quest",
        link: "Questに参加 →",
      },
      {
        key: "gallery",
        name: "Gallery",
        body: "イラスト投稿サイト。作品公開・タグ検索・ポートフォリオ作成",
        link: "Galleryを見る →",
      },
      {
        key: "shop",
        name: "Shop",
        body: "同人グッズ販売・デジタル素材の出品・販売",
        link: "Shopへ →",
      },
      {
        key: "events",
        name: "Events",
        body: "VTuberイベント・ライブ・WS・展示の開催と参加",
        link: "Eventsへ →",
      },
      {
        key: "community",
        name: "Community",
        body: "クリエイターコミュニティ。スレッドで交流・相談",
        link: "Communityへ →",
      },
      {
        key: "works",
        name: "Works",
        body: "ポートフォリオ管理・Quest参加実績の拠点",
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
    empty: "公開中のQuestは準備中です。管理者が新しい挑戦を公開するまでお待ちください。",
    viewAll: "すべて見る →",
  },
  investor: {
    eyebrow: "Investors & Supporters",
    title: "初期支援者・共創パートナーを募集しています",
    lead:
      "Eldonia-Nex は広告依存ではなく、クリエイターの成功に連動する成長モデルです。1,000万人参加からGPU・フランチャイズ・UBIまで、長期展望を描いています。",
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
  seo: {
    metaTitle:
      "Eldonia-Nex | Illustration Portfolio, Creator Jobs & Fan Goods Marketplace",
    metaDescription:
      "A creator community and portfolio platform for illustrators, VTubers, and game creators. Publish art, join Quests, sell fan goods, host VTuber events, and grow your community in one Nexus.",
    platformHeading: "An all-in-one platform for illustrators, VTubers, and game creators",
    platformBody:
      "Eldonia-Nex connects art publishing, Quest challenges and EXP, portfolio building, fan goods sales, VTuber events, and community discussion in one place. AI-assisted works are supported, and tag search helps audiences discover new art. Post work, join Quests, sell in Shop, meet fans at Events — a creator economy loop with strong brand identity and clear service value for search engines.",
    modulesHeading: "Six modules that support creative work",
    moduleDetails: [
      {
        key: "gallery",
        heading: "What is Gallery?",
        body:
          "Gallery is Eldonia-Nex's illustration publishing hub. Share illustrations, comics, 3D art, and AI-assisted works, then discover art through tag search. Build a portfolio, gain visibility through views and engagement, and connect with fans while linking naturally to Shop and Events.",
        linkLabel: "Browse Gallery",
      },
      {
        key: "works",
        heading: "What is Works?",
        body:
          "Works is your portfolio hub and Quest history. View Gallery pieces, Quest completions, and awards in one place to show creator credibility.",
        linkLabel: "View portfolio in Works",
      },
      {
        key: "shop",
        heading: "What is Shop?",
        body:
          "Shop supports fan goods and digital product sales. Creators can turn work into products and deliver them directly to fans — physical goods, downloads, and limited items included. It links naturally from published Gallery work.",
        linkLabel: "Visit Shop",
      },
      {
        key: "events",
        heading: "What is Events?",
        body:
          "Events supports VTuber streams, workshops, exhibitions, and other online or offline gatherings. List events, handle ticket requests, and build real-time fan engagement alongside Community and Gallery.",
        linkLabel: "Browse Events",
      },
      {
        key: "community",
        heading: "What is Community?",
        body:
          "Community is a thread-based creator forum for feedback, production advice, and Quest discussion. It connects naturally to Gallery works and Events announcements while improving site navigation.",
        linkLabel: "Join Community",
      },
      {
        key: "quest",
        heading: "What is a Quest?",
        body:
          "A Quest is a challenge published by admins for users. Simple Quests like daily login grant EXP; brand Quests might ask you to create a product promo video. Top entries win cash, PCs, or prizes — all participants earn EXP and portfolio records.",
        linkLabel: "Join a Quest",
      },
    ],
  },
  hero: {
    title: "Eldonia-Nex",
    subtitle: "An all-in-one platform for illustrators, VTubers, and game creators",
    lead:
      "Illustration publishing, Quest challenges, portfolio building, fan goods sales, VTuber events, and community — work, EXP, and commerce in one creator economy loop.",
    ctaPrimary: "Start for free",
    ctaSecondary: "Join Quests",
    stats: [
      { key: "creators", label: "Creators" },
      { key: "quests", label: "Quests in progress" },
      { key: "returns", label: "Creator Returns" },
    ],
  },
  questGuide: {
    eyebrow: "What is a Quest?",
    steps: [
      { key: "participate", title: "Participate", body: "Pick an admin-published Quest and join when you meet the rules" },
      { key: "challenge", title: "Challenge", body: "Complete the task — login streaks, creative submissions, and more" },
      { key: "evaluated", title: "Get evaluated", body: "Earn EXP; your Quest record is added to your portfolio" },
      { key: "rewards", title: "Earn rewards", body: "Top entries win cash, PCs, or products — all participants get EXP" },
    ],
    metrics: [
      { key: "exp", label: "EXP", body: "Quest participation and logins build experience" },
      { key: "credit", label: "Trust", body: "Quest history strengthens your portfolio" },
      { key: "revenue", label: "Prizes", body: "Brand Quests offer cash, goods, and hardware" },
    ],
  },
  modules: {
    eyebrow: "Creator Modules",
    title: "Six doors into the creator economy",
    circulation: {
      eyebrow: "Creator Circulation",
      title: "The creator economy circuit",
      lead:
        "Fans gather around work, quality and ratings grow, new pieces and spin-offs emerge — the six doors keep the loop moving.",
      loopLabel: "Loop",
      steps: [
        {
          key: "publish",
          title: "Publish work",
          body: "Share through Gallery and earn first exposure and feedback",
          modules: ["gallery"],
        },
        {
          key: "fans",
          title: "Fans gather",
          body: "Community and Events build support and story around the work",
          modules: ["community", "events"],
        },
        {
          key: "quality",
          title: "Ratings rise",
          body: "Likes, views, and EXP make quality and trust visible for the next commission",
          modules: ["gallery", "works"],
        },
        {
          key: "create",
          title: "Create anew",
          body: "Join Quests for EXP and records; brand Quests add prize-winning challenges",
          modules: ["quest", "works"],
        },
        {
          key: "expand",
          title: "Expand the world",
          body: "Shop goods and Event spin-offs widen the universe and fan base",
          modules: ["shop", "events"],
        },
        {
          key: "loop",
          title: "Circulate again",
          body: "Returns, trust, and revenue flow back into the next door — the loop never stops",
          modules: ["gallery", "shop", "community"],
        },
      ],
    },
    items: [
      {
        key: "quest",
        name: "Quest",
        body: "Admin-published challenges — daily login EXP and brand Quests with prizes",
        link: "Join Quests →",
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
        body: "Portfolio hub and Quest participation history",
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
    empty: "No open Quests yet. New challenges will appear when admins publish them.",
    viewAll: "View all →",
  },
  investor: {
    eyebrow: "Investors & Supporters",
    title: "We welcome early supporters and co-build partners",
    lead:
      "Eldonia-Nex grows with creator success, not ad dependence. Our horizon spans 10M participants, GPU rental, franchising, and super basic income.",
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
  seo: {
    ...HOME_V2_EN.seo,
    metaTitle:
      "Eldonia-Nex | 일러스트 게시·크리에이터 채용·동인 굿즈 판매 통합 플랫폼",
    metaDescription:
      "일러스트·VTuber·게임 크리에이터를 위한 커뮤니티 및 포트폴리오 사이트. 작품 게시, 채용 지원, 동인 굿즈 판매, VTuber 이벤트, 커뮤니티 교류를 하나의 Nexus에서.",
    platformHeading: "일러스트·VTuber·게임 크리에이터를 위한 통합 플랫폼",
    platformBody:
      "Eldonia-Nex는 일러스트 게시, 크리에이터 채용, 포트폴리오 작성, 동인 굿즈 판매, VTuber 이벤트, 커뮤니티 교류를 하나로 연결하는 통합 플랫폼입니다. AI 작품도 지원하며, 태그 검색으로 작품을 발견할 수 있습니다.",
    modulesHeading: "창작 활동을 지원하는 6개 모듈",
  },
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
      { key: "participate", title: "참여", body: "관리자가 공개한 Quest를 선택하고 조건을 확인해 참여" },
      { key: "challenge", title: "도전", body: "로그인·작품 제작 등 Quest 과제에 도전" },
      { key: "evaluated", title: "평가", body: "EXP가 부여되고 포트폴리오에 기록" },
      { key: "rewards", title: "보상", body: "우수작은 현금·PC·상품. 전원 EXP" },
    ],
    metrics: [
      { key: "exp", label: "EXP", body: "Quest 참여·로그인이 경험치로" },
      { key: "credit", label: "신뢰", body: "Quest 실적이 포트폴리오 신뢰로" },
      { key: "revenue", label: "특전", body: "기업 Quest에서 현금·상품·PC 등" },
    ],
  },
  modules: {
    ...HOME_V2_EN.modules,
    title: "창작 경제권의 6개의 문",
    circulation: {
      ...HOME_V2_EN.modules.circulation,
      title: "창작 경제권 순환",
      lead:
        "작품에 팬이 모이고, 품질과 평가가 자라며, 새 작품과 스핀오프가 탄생합니다. 여섯 문은 이 순환을 멈추지 않습니다.",
      loopLabel: "순환",
      steps: [
        {
          key: "publish",
          title: "작품 공개",
          body: "Gallery에서 작품을 공개하고 첫 반응을 얻습니다",
          modules: ["gallery"],
        },
        {
          key: "fans",
          title: "팬이 모인다",
          body: "Community와 Events에서 응원이 모이고 작품에 이야기가 붙습니다",
          modules: ["community", "events"],
        },
        {
          key: "quality",
          title: "평가가 자란다",
          body: "좋아요·조회·EXP로 품질과 신뢰가 다음 의뢰로 이어집니다",
          modules: ["gallery", "works"],
        },
        {
          key: "create",
          title: "새 창작으로",
          body: "Quest 참여로 EXP와 실적을 쌓고, 기업 Quest에서는 상품도",
          modules: ["quest", "works"],
        },
        {
          key: "expand",
          title: "세계가 넓어진다",
          body: "Shop 굿즈와 Events 스핀오프로 작품의 폭이 확장됩니다",
          modules: ["shop", "events"],
        },
        {
          key: "loop",
          title: "다시 순환",
          body: "환원·신뢰·수익이 다음 문으로 흘러 순환이 이어집니다",
          modules: ["gallery", "shop", "community"],
        },
      ],
    },
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
    empty: "공개 Quest가 아직 없습니다. 관리자가 새로운 도전을 공개할 때까지 기다려 주세요.",
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
  seo: {
    ...HOME_V2_EN.seo,
    metaTitle:
      "Eldonia-Nex｜插画投稿·创作者招聘·同人周边销售的综合平台",
    metaDescription:
      "面向插画师、VTuber、游戏创作者的社区与作品集网站。作品发布、招聘应聘、同人周边销售、VTuber 活动、社区交流，尽在一个 Nexus。",
    platformHeading: "面向插画师、VTuber、游戏创作者的综合平台",
    platformBody:
      "Eldonia-Nex 将插画发布、创作者招聘、作品集制作、同人周边销售、VTuber 活动与社区交流连接在一起。支持 AI 作品，可通过标签搜索发现作品。",
    modulesHeading: "六大模块支撑创作活动",
  },
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
      { key: "participate", title: "参与", body: "选择管理员发布的 Quest，确认条件后参加" },
      { key: "challenge", title: "挑战", body: "完成登录、作品制作等 Quest 任务" },
      { key: "evaluated", title: "被评价", body: "获得 EXP，挑战记录写入作品集" },
      { key: "rewards", title: "获得回报", body: "优秀作品获现金、PC、商品；全员 EXP" },
    ],
    metrics: [
      { key: "exp", label: "EXP", body: "Quest 参与与登录累积经验" },
      { key: "credit", label: "信用", body: "Quest 实绩强化作品集信任" },
      { key: "revenue", label: "特典", body: "企业 Quest 提供现金、商品、PC 等" },
    ],
  },
  modules: {
    ...HOME_V2_EN.modules,
    title: "创作经济体的六扇门",
    circulation: {
      ...HOME_V2_EN.modules.circulation,
      title: "创作经济体巡回",
      lead:
        "作品吸引粉丝，质量与评价提升，新作与衍生不断出现——六扇门让循环持续运转。",
      loopLabel: "循环",
      steps: [
        {
          key: "publish",
          title: "发布作品",
          body: "在 Gallery 发布作品，获得首批曝光与反馈",
          modules: ["gallery"],
        },
        {
          key: "fans",
          title: "粉丝聚集",
          body: "Community 与 Events 让支持与故事围绕作品生长",
          modules: ["community", "events"],
        },
        {
          key: "quality",
          title: "评价提升",
          body: "点赞、浏览与 EXP 让质量与信用可见，并导向下一单委托",
          modules: ["gallery", "works"],
        },
        {
          key: "create",
          title: "崭新创作",
          body: "参与 Quest 累积 EXP 与实绩，企业 Quest 还有奖品挑战",
          modules: ["quest", "works"],
        },
        {
          key: "expand",
          title: "世界扩展",
          body: "Shop 周边与 Events 衍生企划让作品版图扩大",
          modules: ["shop", "events"],
        },
        {
          key: "loop",
          title: "再次循环",
          body: "回报、信任与收益回流至下一扇门，循环不止",
          modules: ["gallery", "shop", "community"],
        },
      ],
    },
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
    empty: "暂无公开 Quest。管理员发布新挑战后将在此显示。",
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
