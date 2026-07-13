import type { UiLocale } from "@/lib/i18n/locale";

export type HomeModuleKey = "gallery" | "lab" | "shop" | "community" | "works" | "events";

export type HomeModuleItem = {
  key: HomeModuleKey;
  name: string;
  href: string;
  icon: string;
  desc: string;
};

export type HomeAuthenticatedContent = {
  metaTitle: string;
  metaDescription: string;
  greeting: (name: string) => string;
  greetingLead: string;
  levelLabel: string;
  expLabel: string;
  statInProgress: string;
  statUnread: string;
  quickPost: string;
  quickQuest: string;
  quickLab: string;
  quickSettings: string;
  inProgressTitle: string;
  inProgressEmpty: string;
  recTitle: string;
  recLead: string;
  recEmpty: string;
  questsTitle: string;
  questsLead: string;
  questsMore: string;
  questsEmpty: string;
  usersTitle: string;
  usersLead: string;
  usersEmpty: string;
  expSuffix: string;
  worldEyebrow: string;
  worldTitle: string;
  worldBody: string;
  visionEyebrow: string;
  visionTitle: string;
  visionLead: string;
  visionPillars: { title: string; body: string }[];
  modulesTitle: string;
  modulesLead: string;
  modules: HomeModuleItem[];
  contributorEyebrow: string;
  contributorTitle: string;
  contributorLead: string;
  contributorBody: string;
  contributorPerks: string[];
  contributorCta: string;
  contributorPinAlt: string;
};

const MODULE_ICONS: Record<HomeModuleKey, string> = {
  gallery: "/aset/gallery_icon_1024.png",
  lab: "/aset/lab_icon_1024.png",
  shop: "/aset/shop_icon_1024.png",
  community: "/aset/community_icon_1024.png",
  works: "/aset/work_icon_1024.png",
  events: "/aset/event_icon_1024.png",
};

const MODULE_HREFS: Record<HomeModuleKey, string> = {
  gallery: "/gallery",
  lab: "/lab",
  shop: "/shop",
  community: "/community",
  works: "/works",
  events: "/events",
};

function buildModules(
  descs: Record<HomeModuleKey, string>,
): HomeModuleItem[] {
  const names: Record<HomeModuleKey, string> = {
    gallery: "Gallery",
    lab: "Lab",
    shop: "Shop",
    community: "Community",
    works: "Works",
    events: "Events",
  };
  return (Object.keys(names) as HomeModuleKey[]).map((key) => ({
    key,
    name: names[key],
    href: MODULE_HREFS[key],
    icon: MODULE_ICONS[key],
    desc: descs[key],
  }));
}

export const HOME_AUTHENTICATED: Record<UiLocale, HomeAuthenticatedContent> = {
  ja: {
    metaTitle: "Home | Eldonia–Nex",
    metaDescription: "Eldonia–Nex のホーム。開催中の Quest、優秀ユーザー、サイトの概要をチェックできます。",
    greeting: (name) => `おかえりなさい、${name} さん`,
    greetingLead: "今日も創造の冒険を続けましょう。",
    levelLabel: "Lv.",
    expLabel: "EXP",
    statInProgress: "参加中 Quest",
    statUnread: "未読通知",
    quickPost: "作品を投稿",
    quickQuest: "Quest を探す",
    quickLab: "Lab",
    quickSettings: "設定",
    inProgressTitle: "参加中の Quest",
    inProgressEmpty: "参加中の Quest はありません。新しい Quest に挑戦しましょう。",
    recTitle: "あなたへのおすすめ",
    recLead: "注目の作品をピックアップ。",
    recEmpty: "おすすめ作品がまだありません。",
    questsTitle: "開催中の Quest",
    questsLead: "参加して EXP を獲得し、ポートフォリオ実績を積み上げよう。",
    questsMore: "すべての Quest を見る",
    questsEmpty: "現在開催中の Quest はありません。",
    usersTitle: "優秀ユーザー",
    usersLead: "EXP ランキング上位のクリエイターたち。",
    usersEmpty: "ランキングデータがまだありません。",
    expSuffix: "EXP",
    worldEyebrow: "World",
    worldTitle: "エルドニアの世界へようこそ",
    worldBody:
      "Eldonia–Nex は、創造と交流が交差する架空世界「エルドニア」を舞台にしたクリエータープラットフォーム。あなたの創作が物語となり、仲間と出会い、世界とつながり、そして未来を形づくります。",
    visionEyebrow: "Our Vision",
    visionTitle: "Eldonia–Nex が目指す世界",
    visionLead:
      "すべての創造者が、言語や国境を越えて正当に評価され、創作だけで生きていける世界へ。",
    visionPillars: [
      {
        title: "創造の解放",
        body: "誰もが表現し、発表し、仲間と共創できる。創作のハードルを下げ、才能が埋もれない場所をつくります。",
      },
      {
        title: "国境を越える",
        body: "多言語・リアルタイム翻訳で、世界中のファンと作り手がつながる。言葉の壁のない創作圏を目指します。",
      },
      {
        title: "公正な循環",
        body: "貢献が正当に報われる仕組み。収益・EXP・紹介還元で、創作の努力が持続的な価値に変わります。",
      },
    ],
    modulesTitle: "できること",
    modulesLead: "すべての創造活動を、ひとつの場所で。",
    modules: buildModules({
      gallery: "作品を美しく公開・展示し、世界中のファンへ届ける。",
      lab: "仲間と共同制作。新しい表現と技術を研究・実験する。",
      shop: "デジタル・フィジカル作品を販売。安全な決済に対応。",
      community: "ジャンルや興味でつながり、交流して共に成長する。",
      works: "Quest や仕事の依頼・募集。才能を実績と収入に変える。",
      events: "イベントや展示会を開催・参加。創作の輪を広げる。",
    }),
    contributorEyebrow: "Contributors",
    contributorTitle: "貢献者の皆さまへ",
    contributorLead: "立ち上げを支える創作・参加・紹介への感謝として、記念ピンバッジをお届け予定です。",
    contributorBody:
      "ベータ期間中の継続利用や作品公開、コミュニティ参加など——Nexus の成長に貢献いただいた方へ、シリアル番号付き EN ピンバッジと限定特典をご用意しています。",
    contributorPerks: [
      "シリアル番号付き記念ピンバッジの贈呈（予定）",
      "限定コミュニティ・先行アクセスへの招待",
      "貢献度に応じた特別な感謝特典",
    ],
    contributorCta: "貢献者特典を見る",
    contributorPinAlt: "EN記念ピンバッジ",
  },
  en: {
    metaTitle: "Home | Eldonia–Nex",
    metaDescription: "Your Eldonia–Nex home — open Quests, top creators, and platform overview.",
    greeting: (name) => `Welcome back, ${name}`,
    greetingLead: "Continue your creative adventure today.",
    levelLabel: "Lv.",
    expLabel: "EXP",
    statInProgress: "Active Quests",
    statUnread: "Unread",
    quickPost: "Post work",
    quickQuest: "Find Quests",
    quickLab: "Lab",
    quickSettings: "Settings",
    inProgressTitle: "Your active Quests",
    inProgressEmpty: "No active Quests. Take on a new challenge.",
    recTitle: "Recommended for you",
    recLead: "Featured works we picked for you.",
    recEmpty: "No recommendations yet.",
    questsTitle: "Open Quests",
    questsLead: "Join to earn EXP and build your portfolio track record.",
    questsMore: "View all Quests",
    questsEmpty: "There are no open Quests right now.",
    usersTitle: "Top Creators",
    usersLead: "Creators leading the EXP ranking.",
    usersEmpty: "No ranking data yet.",
    expSuffix: "EXP",
    worldEyebrow: "World",
    worldTitle: "Welcome to the world of Eldonia",
    worldBody:
      "Eldonia–Nex is a creator platform set in the fictional world of Eldonia, where creation and connection intersect. Your work becomes a story — meet allies, connect with the world, and shape the future.",
    visionEyebrow: "Our Vision",
    visionTitle: "The world Eldonia–Nex aims for",
    visionLead:
      "A world where every creator is fairly recognized across languages and borders — and can live from creating alone.",
    visionPillars: [
      {
        title: "Liberate creation",
        body: "Anyone can express, publish, and co-create. We lower the barriers so talent is never buried.",
      },
      {
        title: "Beyond borders",
        body: "Multilingual, real-time translation connects fans and makers worldwide — a creative sphere without language walls.",
      },
      {
        title: "A fair cycle",
        body: "Contribution is rewarded fairly. Revenue, EXP, and referral returns turn effort into lasting value.",
      },
    ],
    modulesTitle: "What you can do",
    modulesLead: "Every creative activity, in one place.",
    modules: buildModules({
      gallery: "Publish and exhibit your work beautifully for fans worldwide.",
      lab: "Co-create with peers and experiment with new expression.",
      shop: "Sell digital and physical works with secure checkout.",
      community: "Connect by genre and interest, and grow together.",
      works: "Quests and job matching — turn talent into results and income.",
      events: "Host or join events and exhibitions to widen your circle.",
    }),
    contributorEyebrow: "Contributors",
    contributorTitle: "For our contributors",
    contributorLead:
      "As thanks for creating, joining, and inviting others during our launch, a commemorative pin badge is planned.",
    contributorBody:
      "Continued use in beta, publishing work, community participation — if you help grow the Nexus, we plan a serial-numbered EN pin and limited contributor perks.",
    contributorPerks: [
      "Serial-numbered commemorative pin badge (planned)",
      "Invitation to a private community & early access",
      "Special thank-you benefits based on contribution",
    ],
    contributorCta: "See contributor rewards",
    contributorPinAlt: "EN commemorative pin badge",
  },
  ko: {
    metaTitle: "Home | Eldonia–Nex",
    metaDescription: "Eldonia–Nex 홈 — 진행 중 Quest, 우수 사용자, 플랫폼 개요.",
    greeting: (name) => `다시 오신 것을 환영합니다, ${name} 님`,
    greetingLead: "오늘도 창작의 모험을 이어가세요.",
    levelLabel: "Lv.",
    expLabel: "EXP",
    statInProgress: "진행 중 Quest",
    statUnread: "안 읽음",
    quickPost: "작품 게시",
    quickQuest: "Quest 찾기",
    quickLab: "Lab",
    quickSettings: "설정",
    inProgressTitle: "진행 중인 Quest",
    inProgressEmpty: "진행 중인 Quest가 없습니다. 새로운 도전을 시작하세요.",
    recTitle: "추천 작품",
    recLead: "주목할 작품을 골랐습니다.",
    recEmpty: "추천 작품이 아직 없습니다.",
    questsTitle: "진행 중인 Quest",
    questsLead: "참여해 EXP를 얻고 포트폴리오 실적을 쌓아보세요.",
    questsMore: "모든 Quest 보기",
    questsEmpty: "현재 진행 중인 Quest가 없습니다.",
    usersTitle: "우수 사용자",
    usersLead: "EXP 랭킹 상위 크리에이터.",
    usersEmpty: "랭킹 데이터가 아직 없습니다.",
    expSuffix: "EXP",
    worldEyebrow: "World",
    worldTitle: "엘도니아의 세계에 오신 것을 환영합니다",
    worldBody:
      "Eldonia–Nex는 창작과 교류가 교차하는 가상 세계 '엘도니아'를 무대로 한 크리에이터 플랫폼입니다. 당신의 창작이 이야기가 되어 동료를 만나고 세계와 이어지며 미래를 만들어 갑니다.",
    visionEyebrow: "Our Vision",
    visionTitle: "Eldonia–Nex가 지향하는 세계",
    visionLead:
      "모든 창작자가 언어와 국경을 넘어 정당하게 평가받고, 창작만으로 살아갈 수 있는 세계로.",
    visionPillars: [
      {
        title: "창작의 해방",
        body: "누구나 표현하고 발표하며 동료와 공동 창작할 수 있도록. 창작의 문턱을 낮춰 재능이 묻히지 않게 합니다.",
      },
      {
        title: "국경을 넘어",
        body: "다국어·실시간 번역으로 전 세계 팬과 창작자를 연결. 언어의 벽이 없는 창작권을 지향합니다.",
      },
      {
        title: "공정한 순환",
        body: "기여가 정당하게 보상되는 구조. 수익·EXP·추천 환원으로 노력이 지속적 가치가 됩니다.",
      },
    ],
    modulesTitle: "할 수 있는 것",
    modulesLead: "모든 창작 활동을 한곳에서.",
    modules: buildModules({
      gallery: "작품을 아름답게 공개·전시하고 전 세계 팬에게 전달합니다.",
      lab: "동료와 공동 제작하고 새로운 표현과 기술을 실험합니다.",
      shop: "디지털·실물 작품을 판매. 안전한 결제를 지원합니다.",
      community: "장르와 관심으로 연결되어 교류하며 함께 성장합니다.",
      works: "Quest와 구인 매칭. 재능을 실적과 수입으로 바꿉니다.",
      events: "이벤트·전시를 개최·참여하여 창작의 폭을 넓힙니다.",
    }),
    contributorEyebrow: "Contributors",
    contributorTitle: "기여자 여러분께",
    contributorLead:
      "런칭을 돕는 창작·참여·소개에 대한 감사로, 기념 핀 배지를 증정할 예정입니다.",
    contributorBody:
      "베타 기간의 지속 이용, 작품 공개, 커뮤니티 참여 등 Nexus 성장에 기여해 주신 분께 일련번호 EN 핀과 한정 특전을 준비합니다.",
    contributorPerks: [
      "일련번호가 있는 기념 핀 배지 증정(예정)",
      "한정 커뮤니티·선행 액세스 초대",
      "기여도에 따른 특별 감사 특전",
    ],
    contributorCta: "기여자 특전 보기",
    contributorPinAlt: "EN 기념 핀 배지",
  },
  "zh-CN": {
    metaTitle: "Home | Eldonia–Nex",
    metaDescription: "Eldonia–Nex 首页 — 进行中的 Quest、优秀用户与平台概览。",
    greeting: (name) => `欢迎回来，${name}`,
    greetingLead: "今天也继续你的创作冒险吧。",
    levelLabel: "Lv.",
    expLabel: "EXP",
    statInProgress: "进行中 Quest",
    statUnread: "未读",
    quickPost: "发布作品",
    quickQuest: "寻找 Quest",
    quickLab: "Lab",
    quickSettings: "设置",
    inProgressTitle: "进行中的 Quest",
    inProgressEmpty: "暂无进行中的 Quest，去挑战新的吧。",
    recTitle: "为你推荐",
    recLead: "为你精选的作品。",
    recEmpty: "暂无推荐作品。",
    questsTitle: "进行中的 Quest",
    questsLead: "参与获取 EXP，积累作品集实绩。",
    questsMore: "查看全部 Quest",
    questsEmpty: "目前没有进行中的 Quest。",
    usersTitle: "优秀用户",
    usersLead: "EXP 排行榜前列的创作者。",
    usersEmpty: "暂无排行数据。",
    expSuffix: "EXP",
    worldEyebrow: "World",
    worldTitle: "欢迎来到艾尔多尼亚的世界",
    worldBody:
      "Eldonia–Nex 是以创作与交流交汇的虚构世界「艾尔多尼亚」为舞台的创作者平台。你的创作化为故事，结识伙伴，连接世界，塑造未来。",
    visionEyebrow: "Our Vision",
    visionTitle: "Eldonia–Nex 追求的世界",
    visionLead:
      "让每一位创作者跨越语言与国界获得公正评价，仅凭创作也能生活的世界。",
    visionPillars: [
      {
        title: "解放创作",
        body: "人人皆可表达、发布并与伙伴共创。降低创作门槛，让才华不被埋没。",
      },
      {
        title: "跨越国界",
        body: "多语言实时翻译，连接全球粉丝与创作者，打造没有语言壁垒的创作圈。",
      },
      {
        title: "公正的循环",
        body: "贡献获得公正回报。收益、EXP 与推荐返还，让努力化为持续价值。",
      },
    ],
    modulesTitle: "你可以做什么",
    modulesLead: "所有创作活动，尽在一处。",
    modules: buildModules({
      gallery: "精美地公开与展示作品，传递给全球粉丝。",
      lab: "与伙伴共同创作，研究与实验全新表达。",
      shop: "销售数字与实体作品，支持安全支付。",
      community: "按题材与兴趣连接，交流并共同成长。",
      works: "Quest 与工作匹配，把才华化为实绩与收入。",
      events: "举办或参与活动与展览，扩大创作圈。",
    }),
    contributorEyebrow: "Contributors",
    contributorTitle: "致贡献者",
    contributorLead: "感谢在启动阶段创作、参与与介绍——计划赠送纪念徽章。",
    contributorBody:
      "测试期间的持续使用、作品发布、社区参与等，凡助力 Nexus 成长的贡献者，我们计划提供带编号的 EN 徽章与限定特典。",
    contributorPerks: [
      "带编号的纪念徽章赠送（计划中）",
      "专属社区与抢先体验邀请",
      "按贡献度提供特别感谢特典",
    ],
    contributorCta: "查看贡献者特典",
    contributorPinAlt: "EN 纪念徽章",
  },
};
export function getHomeAuthenticated(locale: UiLocale): HomeAuthenticatedContent {
  return HOME_AUTHENTICATED[locale] ?? HOME_AUTHENTICATED.ja;
}
