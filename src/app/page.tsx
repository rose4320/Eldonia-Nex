import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QuestCard } from "@/components/works/quest-card";
import { LpCard } from "@/components/ui/lp-card";
import { LpReveal } from "@/components/ui/lp-reveal";
import { LpSectionRule } from "@/components/ui/lp-section-rule";
import { LpSectionTitle } from "@/components/ui/lp-section-title";
import { getTopUsers } from "@/lib/home/get-top-users";
import { getTopPublicArtworks } from "@/lib/gallery/get-public-artworks";
import { getQuestListings, getUserQuestHistory } from "@/lib/quests/get-quests";
import { getUnreadNotificationCount } from "@/lib/notifications/get-notifications";
import { getPortfolioForUser } from "@/lib/works/get-works";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import type { UiLocale } from "@/lib/i18n/locale";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Home | Eldonia–Nex",
  description:
    "Eldonia–Nex のホーム。開催中の Quest、優秀ユーザー、サイトの概要をチェックできます。",
};

type ModuleKey = "gallery" | "lab" | "shop" | "community" | "works" | "events";

type ModuleItem = {
  key: ModuleKey;
  name: string;
  href: string;
  icon: string;
  desc: string;
};

type HomeCopy = {
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
  worldTitle: string;
  worldBody: string;
  visionEyebrow: string;
  visionTitle: string;
  visionLead: string;
  visionPillars: { title: string; body: string }[];
  modulesTitle: string;
  modulesLead: string;
  modules: ModuleItem[];
  investorTitle: string;
  investorLead: string;
  investorBody: string;
  investorPerks: string[];
  investorCta: string;
};

const MODULE_ICONS: Record<ModuleKey, string> = {
  gallery: "/aset/gallery_icon_1024.png",
  lab: "/aset/lab_icon_1024.png",
  shop: "/aset/shop_icon_1024.png",
  community: "/aset/community_icon_1024.png",
  works: "/aset/work_icon_1024.png",
  events: "/aset/event_icon_1024.png",
};

const MODULE_HREFS: Record<ModuleKey, string> = {
  gallery: "/gallery",
  lab: "/lab",
  shop: "/shop",
  community: "/community",
  works: "/works",
  events: "/events",
};

function buildModules(
  descs: Record<ModuleKey, string>,
): ModuleItem[] {
  const names: Record<ModuleKey, string> = {
    gallery: "Gallery",
    lab: "Lab",
    shop: "Shop",
    community: "Community",
    works: "Works",
    events: "Events",
  };
  return (Object.keys(names) as ModuleKey[]).map((key) => ({
    key,
    name: names[key],
    href: MODULE_HREFS[key],
    icon: MODULE_ICONS[key],
    desc: descs[key],
  }));
}

const HOME_COPY: Record<UiLocale, HomeCopy> = {
  ja: {
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
    investorTitle: "投資家・共創パートナーの皆さまへ",
    investorLead: "Eldonia–Nex の未来を、共に創る仲間を募集しています。",
    investorBody:
      "クリエイターエコノミーの次を形づくるプラットフォームへ。事業の成長性、収益モデル、共創の可能性について、専用ページで詳しくご案内します。",
    investorPerks: [
      "シリアル番号付き記念ピンバッジの贈呈（予定）",
      "限定コミュニティ・先行アクセスへの招待",
      "共創パートナーとしての特別優待",
    ],
    investorCta: "投資家向け情報を見る",
  },
  en: {
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
    investorTitle: "For investors & co-creation partners",
    investorLead: "We're looking for partners to build the future of Eldonia–Nex.",
    investorBody:
      "A platform shaping the next creator economy. Explore our growth, revenue model, and co-creation opportunities on the dedicated page.",
    investorPerks: [
      "Serial-numbered commemorative pin badge (planned)",
      "Invitation to a private community & early access",
      "Special benefits as a co-creation partner",
    ],
    investorCta: "See investor info",
  },
  ko: {
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
    investorTitle: "투자자·공동 창작 파트너 여러분께",
    investorLead: "Eldonia–Nex의 미래를 함께 만들 파트너를 찾습니다.",
    investorBody:
      "크리에이터 이코노미의 다음을 만드는 플랫폼. 사업 성장성, 수익 모델, 공동 창작 가능성을 전용 페이지에서 안내합니다.",
    investorPerks: [
      "일련번호가 있는 기념 핀 배지 증정(예정)",
      "한정 커뮤니티·선행 액세스 초대",
      "공동 창작 파트너 특별 우대",
    ],
    investorCta: "투자자 정보 보기",
  },
  "zh-CN": {
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
    investorTitle: "致投资者与共创伙伴",
    investorLead: "我们正在寻找共同打造 Eldonia–Nex 未来的伙伴。",
    investorBody:
      "塑造下一代创作者经济的平台。业务成长性、收益模型与共创机会，详见专属页面。",
    investorPerks: [
      "带编号的纪念徽章赠送（计划中）",
      "专属社区与抢先体验邀请",
      "作为共创伙伴的特别优待",
    ],
    investorCta: "查看投资者信息",
  },
};

export default async function HomePage() {
  const locale = await getUiLocale();
  const copy = HOME_COPY[locale] ?? HOME_COPY.ja;

  // 未ログインはマーケ LP へ（/ はログイン後ホーム）
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/lp");
  }

  const [profileRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, username, avatar_url")
      .eq("id", user.id)
      .maybeSingle(),
  ]);
  const profile = profileRes.data;
  const displayName =
    profile?.display_name ?? profile?.username ?? user.email?.split("@")[0] ?? "Creator";

  const [quests, topUsers, artworks, portfolio, questHistory, unreadCount] =
    await Promise.all([
      getQuestListings({}, locale),
      getTopUsers(6),
      getTopPublicArtworks(6),
      getPortfolioForUser(user.id, { useSampleFallback: false }),
      getUserQuestHistory(user.id),
      getUnreadNotificationCount(user.id),
    ]);

  const featuredQuests = quests.slice(0, 6);
  const activeQuests = questHistory
    .filter(
      (entry) =>
        entry.quests && (entry.status === "joined" || entry.status === "submitted"),
    )
    .slice(0, 3);
  const expPoints = portfolio?.exp_points ?? 0;
  const level = portfolio?.level ?? 1;
  const titleBadge = portfolio?.title_badge ?? null;
  const avatarUrl = profile?.avatar_url ?? null;

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        {/* Personal dashboard band */}
        <section className="lp-home-hero">
          <Image
            src="/aset/lp/hero.png?v=0.6.0"
            alt=""
            fill
            priority
            sizes="(max-width: 1240px) 100vw, 1240px"
            className="lp-home-hero__bg"
          />
          <div className="lp-home-hero__scrim" aria-hidden />
          <span className="lp-home-corner lp-home-corner--tl" aria-hidden />
          <span className="lp-home-corner lp-home-corner--tr" aria-hidden />
          <span className="lp-home-corner lp-home-corner--bl" aria-hidden />
          <span className="lp-home-corner lp-home-corner--br" aria-hidden />

          <div className="lp-home-hero__body">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d6a84f]/50 bg-[#060b14]">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display text-xl text-[#f0c978]">
                    {displayName.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </span>
              <div>
                <h1 className="font-display text-2xl font-bold tracking-wide text-[#f8f1df] drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)] sm:text-3xl">
                  {copy.greeting(displayName)}
                </h1>
                <p className="mt-1 text-sm text-[#e5d4ad]">{copy.greetingLead}</p>
              </div>
            </div>

            {/* EXP / Level */}
            <div className="mt-6 max-w-xl">
              <div className="flex items-center justify-between text-sm">
                <span className="font-display text-[#f0c978]">
                  {copy.levelLabel}
                  {level}
                  {titleBadge ? ` · ${titleBadge}` : ""}
                </span>
                <span className="text-[#d8c8a8]">
                  {expPoints.toLocaleString()} {copy.expLabel}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full border border-[#d6a84f]/25 bg-[#060b14]">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#d6a84f] to-[#f0c978]"
                  style={{ width: `${Math.min(100, expPoints % 100)}%` }}
                />
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/gallery/upload"
                className="inline-flex items-center justify-center rounded-md border border-[#d6a84f]/80 bg-linear-to-b from-[#f0c978] to-[#d6a84f] px-4 py-2.5 font-display text-xs font-semibold tracking-[0.12em] text-[#1a1208] transition hover:from-[#f8dfaa] hover:to-[#e0b868]"
              >
                {copy.quickPost}
              </Link>
              <Link
                href="/works"
                className="inline-flex items-center justify-center rounded-md border border-[#d6a84f]/60 px-4 py-2.5 font-display text-xs font-semibold tracking-[0.12em] text-[#f8f1df] transition hover:border-[#d6a84f] hover:bg-[#d6a84f]/10"
              >
                {copy.quickQuest}
              </Link>
              <Link
                href="/lab"
                className="inline-flex items-center justify-center rounded-md border border-[#d6a84f]/60 px-4 py-2.5 font-display text-xs font-semibold tracking-[0.12em] text-[#f8f1df] transition hover:border-[#d6a84f] hover:bg-[#d6a84f]/10"
              >
                {copy.quickLab}
              </Link>
              <Link
                href="/settings"
                className="inline-flex items-center justify-center rounded-md border border-[#d6a84f]/60 px-4 py-2.5 font-display text-xs font-semibold tracking-[0.12em] text-[#f8f1df] transition hover:border-[#d6a84f] hover:bg-[#d6a84f]/10"
              >
                {copy.quickSettings}
              </Link>
            </div>

            {/* Personal stats */}
            <dl className="mt-6 grid max-w-md grid-cols-2 gap-2.5">
              <Link href="/works/portfolio" className="lp-home-stat block transition hover:border-[#d6a84f]/60">
                <dt className="text-[0.6rem] uppercase tracking-wider text-[#9e927d]">
                  {copy.statInProgress}
                </dt>
                <dd className="mt-1 font-display text-lg text-[#f0c978]">{activeQuests.length}</dd>
              </Link>
              <div className="lp-home-stat">
                <dt className="text-[0.6rem] uppercase tracking-wider text-[#9e927d]">
                  {copy.statUnread}
                </dt>
                <dd className="mt-1 font-display text-lg text-[#f0c978]">{unreadCount}</dd>
              </div>
            </dl>
          </div>
        </section>

        {activeQuests.length > 0 && (
          <>
            <LpReveal>
              <LpSectionRule className="mx-auto my-2 max-w-4xl" variant="compact" />
            </LpReveal>
            <LpReveal as="section" id="my-quests" className="scroll-mt-24">
              <LpSectionTitle className="mb-6">{copy.inProgressTitle}</LpSectionTitle>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeQuests.map(
                  (entry) => entry.quests && <QuestCard key={entry.id} quest={entry.quests} />,
                )}
              </div>
            </LpReveal>
          </>
        )}

        <LpReveal>
          <LpSectionRule className="mx-auto my-2 max-w-4xl" variant="flourish" />
        </LpReveal>

        {/* Quests */}
        <LpReveal as="section" id="quests" className="scroll-mt-24">
          <LpSectionTitle className="mb-3">{copy.questsTitle}</LpSectionTitle>
          <p className="mb-8 text-center text-sm leading-7 text-[#9e927d]">
            {copy.questsLead}
          </p>

          {featuredQuests.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-[#9e927d]">{copy.questsEmpty}</p>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/works"
              className="font-display text-sm tracking-wide text-[#d6a84f] hover:text-[#f0c978]"
            >
              {copy.questsMore} →
            </Link>
          </div>
        </LpReveal>

        <LpReveal>
          <LpSectionRule className="mx-auto my-2 max-w-4xl" variant="seal" />
        </LpReveal>

        {/* Top users */}
        <LpReveal as="section" id="top-users" className="scroll-mt-24">
          <LpSectionTitle className="mb-3">{copy.usersTitle}</LpSectionTitle>
          <p className="mb-8 text-center text-sm leading-7 text-[#9e927d]">
            {copy.usersLead}
          </p>

          {topUsers.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topUsers.map((user, index) => (
                <li key={user.userId}>
                  <LpCard hover className="flex items-center gap-4 p-4">
                    <span
                      className={
                        index < 3
                          ? `lp-home-rank-badge lp-home-rank-badge--${index + 1}`
                          : "lp-home-rank-badge border border-[#d6a84f]/35 text-[#d6a84f]"
                      }
                    >
                      {index + 1}
                    </span>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d6a84f]/35 bg-[#060b14]">
                      {user.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.avatarUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="font-display text-sm text-[#f0c978]">
                          {user.displayName.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-display text-[#f8f1df]">
                        {user.displayName}
                      </span>
                      <span className="block text-xs text-[#9e927d]">
                        {user.titleBadge ? `${user.titleBadge} · ` : ""}
                        {user.expPoints.toLocaleString()} {copy.expSuffix}
                      </span>
                    </span>
                  </LpCard>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-sm text-[#9e927d]">{copy.usersEmpty}</p>
          )}
        </LpReveal>

        <LpReveal>
          <LpSectionRule className="mx-auto my-2 max-w-4xl" variant="ornate" />
        </LpReveal>

        {/* Recommendations */}
        <LpReveal as="section" id="recommended" className="scroll-mt-24">
          <LpSectionTitle className="mb-3">{copy.recTitle}</LpSectionTitle>
          <p className="mb-8 text-center text-sm leading-7 text-[#9e927d]">{copy.recLead}</p>

          {artworks.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {artworks.map((art) => (
                <Link key={art.id} href={`/gallery/${art.id}`} className="group">
                  <LpCard hover className="h-full overflow-hidden p-0">
                    <div className="relative aspect-4/3 overflow-hidden bg-[#060b14]">
                      {art.thumbnail_url || art.media_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={art.thumbnail_url ?? art.media_url}
                          alt=""
                          className="lp-module-icon h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <p className="truncate font-display text-sm text-[#f8f1df] group-hover:text-[#f0c978]">
                        {art.title}
                      </p>
                      <p className="mt-1 truncate text-xs text-[#9e927d]">
                        {art.profiles?.display_name ?? art.profiles?.username ?? "Creator"}
                      </p>
                    </div>
                  </LpCard>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-[#9e927d]">{copy.recEmpty}</p>
          )}
        </LpReveal>

        <LpReveal>
          <LpSectionRule className="mx-auto my-2 max-w-4xl" variant="compact" />
        </LpReveal>

        {/* World intro */}
        <LpReveal as="section" id="world" className="scroll-mt-24">
          <div className="lp-home-panel overflow-hidden rounded-2xl border border-[#d6a84f]/25">
            <span className="lp-home-corner lp-home-corner--tl" aria-hidden />
            <span className="lp-home-corner lp-home-corner--tr" aria-hidden />
            <span className="lp-home-corner lp-home-corner--bl" aria-hidden />
            <span className="lp-home-corner lp-home-corner--br" aria-hidden />
            <div className="grid lg:grid-cols-2">
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <p className="eldonia-eyebrow">World</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-wide text-[#f8f1df] sm:text-3xl">
                  {copy.worldTitle}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#d8c8a8]">{copy.worldBody}</p>
              </div>
              <div className="relative min-h-[220px] overflow-hidden lg:min-h-[300px]">
                <Image
                  src="/aset/lp/world.png?v=0.6.0"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#020817] via-[#020817]/35 to-transparent"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-[#020817] to-transparent"
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </LpReveal>

        <LpReveal>
          <LpSectionRule className="mx-auto my-2 max-w-4xl" variant="ornate" />
        </LpReveal>

        {/* Vision */}
        <LpReveal as="section" id="vision" className="scroll-mt-24">
          <LpSectionTitle className="mb-3">{copy.visionTitle}</LpSectionTitle>
          <p className="mb-8 text-center text-sm leading-7 text-[#9e927d]">
            {copy.visionLead}
          </p>

          <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,300px)_1fr]">
            <div className="relative mx-auto aspect-square w-full max-w-[260px]">
              <div className="lp-globe-figure relative h-full w-full">
                <Image
                  src="/aset/lp/globe.png?v=0.6.0"
                  alt=""
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              </div>
            </div>

            <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {copy.visionPillars.map((pillar) => (
                <li key={pillar.title}>
                  <LpCard className="h-full p-5">
                    <p className="font-display text-base font-semibold tracking-wider text-[#f0c978]">
                      {pillar.title}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-[#d8c8a8]">{pillar.body}</p>
                  </LpCard>
                </li>
              ))}
            </ul>
          </div>
        </LpReveal>

        <LpReveal>
          <LpSectionRule className="mx-auto my-2 max-w-4xl" variant="simple" />
        </LpReveal>

        {/* Modules showcase */}
        <LpReveal as="section" id="modules" className="scroll-mt-24">
          <LpSectionTitle className="mb-3">{copy.modulesTitle}</LpSectionTitle>
          <p className="mb-8 text-center text-sm leading-7 text-[#9e927d]">
            {copy.modulesLead}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.modules.map((mod) => (
              <Link key={mod.key} href={mod.href} className="group">
                <LpCard hover className="flex h-full items-start gap-4 p-5">
                  <Image
                    src={`${mod.icon}?v=0.6.0`}
                    alt=""
                    width={160}
                    height={160}
                    className="lp-module-icon h-20 w-20 shrink-0 object-contain"
                  />
                  <span className="min-w-0">
                    <span className="font-display text-lg font-semibold tracking-wider text-[#f0c978] group-hover:text-[#f8dfaa]">
                      {mod.name}
                    </span>
                    <span className="mt-1.5 block text-sm leading-6 text-[#e5d8bd]">
                      {mod.desc}
                    </span>
                  </span>
                </LpCard>
              </Link>
            ))}
          </div>
        </LpReveal>

        <LpReveal>
          <LpSectionRule className="mx-auto my-2 max-w-4xl" variant="ornate" />
        </LpReveal>

        {/* Investors */}
        <LpReveal as="section" id="investors" className="scroll-mt-24">
          <div className="lp-home-panel overflow-hidden rounded-2xl border border-[#7c5cff]/30">
            <span className="lp-home-corner lp-home-corner--tl" aria-hidden />
            <span className="lp-home-corner lp-home-corner--tr" aria-hidden />
            <span className="lp-home-corner lp-home-corner--bl" aria-hidden />
            <span className="lp-home-corner lp-home-corner--br" aria-hidden />
            <div className="grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,220px)_1fr] lg:p-10">
              <div className="mx-auto lg:mx-0">
                <Image
                  src="/aset/lp/pin-badge.png?v=0.6.0"
                  alt=""
                  width={200}
                  height={200}
                  className="h-auto w-40 sm:w-48"
                />
              </div>
              <div>
                <p className="eldonia-eyebrow text-[#c4b5fd]">Investors</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-wide text-[#f8f1df] sm:text-3xl">
                  {copy.investorTitle}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#d8c8a8]">{copy.investorLead}</p>
                <p className="mt-2 text-xs leading-6 text-[#9e927d]">{copy.investorBody}</p>

                <ul className="mt-4 grid gap-2">
                  {copy.investorPerks.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-2 text-xs leading-6 text-[#d8c8a8] sm:text-sm"
                    >
                      <span className="mt-0.5 shrink-0 text-[#7c5cff]" aria-hidden>
                        ✦
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <Link
                    href="/investors"
                    className="inline-flex items-center justify-center rounded-md border border-[#7c5cff]/60 bg-linear-to-b from-[#7c5cff]/90 to-[#5a3fd4]/90 px-5 py-2.5 font-display text-xs font-semibold tracking-[0.14em] text-white transition hover:from-[#8f72ff] hover:to-[#6b52e8] sm:text-sm"
                  >
                    {copy.investorCta} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </LpReveal>
      </main>

      <SiteFooter />
    </div>
  );
}

