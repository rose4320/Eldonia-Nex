import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { MODULE_NAV_LINKS } from "@/lib/layout/nav-links";
import { categoryLabel } from "@/lib/gallery/constants";
import { getTopPublicArtworks } from "@/lib/gallery/get-public-artworks";
import { formatBudget, jobTypeLabel } from "@/lib/works/constants";
import type { UiLocale } from "@/lib/i18n/locale";
import type { ArtworkWithCreator, JobListingWithPoster } from "@/types/database";

const MODULE_HREF = Object.fromEntries(
  MODULE_NAV_LINKS.filter((l) => l.label !== "LAB").map((l) => [l.label, l.href]),
) as Record<string, string>;

type HomeArtwork = Pick<
  ArtworkWithCreator,
  | "id"
  | "title"
  | "category"
  | "media_type"
  | "media_url"
  | "thumbnail_url"
  | "view_count"
  | "profiles"
>;

type HomeCopy = {
  liveBadge: string;
  heroKicker: string;
  heroPromise: string;
  heroNote: string;
  ctaExploreQuests: string;
  ctaInvestor: string;
  orbitLabels: string[];
  stats: { value: string; label: string }[];
  questEyebrow: string;
  questTitle: string;
  questLead: string;
  questEmpty: string;
  topWorksEyebrow: string;
  topWorksTitle: string;
  topWorksLead: string;
  topWorksEmpty: string;
  investorEyebrow: string;
  investorTitle: string;
  investorLead: string;
  investorCards: { title: string; body: string; metric: string }[];
  revenueEyebrow: string;
  revenueTitle: string;
  revenueLead: string;
  revenueSteps: { title: string; body: string }[];
  referralTitle: string;
  referralBody: string;
  manifesto: string[];
};

const HOME_COPY: Record<UiLocale, HomeCopy> = {
  ja: {
    liveBadge: "NEXUS LIVE BUILD",
    heroKicker: "Quest, Works, Commerce, Community",
    heroPromise:
      "Eldonia-Nex は、ユーザーが遊び、作り、売り、紹介し、還元を受けるための創作経済圏です。",
    heroNote:
      "作品投稿だけで終わらせない。Questで経験値を得て、作品で信用を作り、紹介と販売で収益が循環する設計へ。",
    ctaExploreQuests: "Questを見る",
    ctaInvestor: "投資家向け思想を見る",
    orbitLabels: ["Quest", "Artwork", "EXP", "Referral", "Revenue"],
    stats: [
      { value: "5", label: "Creator Modules" },
      { value: "EXP", label: "Action Economy" },
      { value: "Rebate", label: "Paid Referral Return" },
    ],
    questEyebrow: "Guild Quest Board",
    questTitle: "今日のQuestから、仕事と信用が始まる",
    questLead:
      "求人・協業・制作依頼をQuestとして見せ、応募時にはポートフォリオ、EXP、称号が自然に信用情報になります。",
    questEmpty: "公開中のQuestは準備中です。WORKSで最初の募集を作成できます。",
    topWorksEyebrow: "Top User Works",
    topWorksTitle: "トップユーザー作品を、入口から主役にする",
    topWorksLead:
      "閲覧数の高い作品をホームで紹介し、才能の発見をプラットフォームの第一体験にします。",
    topWorksEmpty: "公開作品はまだありません。最初の作品がここに刻まれます。",
    investorEyebrow: "Investor Approach",
    investorTitle: "広告依存ではなく、ユーザーの成功に連動する成長モデル",
    investorLead:
      "Eldonia-Nexは、クリエイターの創作活動、紹介、販売、イベント、仕事が同じIDとEXPで接続される収益基盤です。",
    investorCards: [
      {
        title: "Creator-first retention",
        body: "使うほどポートフォリオとEXPが育ち、離脱しにくい信用資産になります。",
        metric: "LTV by trust",
      },
      {
        title: "Multi-market revenue",
        body: "SHOP、EVENTS、WORKS、紹介還元をひとつの循環に束ねます。",
        metric: "Stacked GMV",
      },
      {
        title: "Community-powered acquisition",
        body: "有料紹介者還元により、ユーザー自身が成長のパートナーになります。",
        metric: "Referral loop",
      },
    ],
    revenueEyebrow: "User Sovereign Revenue",
    revenueTitle: "他社サービスとは違う、ユーザー主義の収益構造",
    revenueLead:
      "プラットフォームだけが稼ぐのではなく、貢献したユーザーにも還元される設計を前面に出します。",
    revenueSteps: [
      {
        title: "Create",
        body: "作品・商品・イベント・Questを作るたびに信用とEXPが増える。",
      },
      {
        title: "Connect",
        body: "作品、仕事、コミュニティ、紹介が同じ導線でつながる。",
      },
      {
        title: "Earn",
        body: "販売、依頼、イベント、有料紹介者還元で複数の稼ぎ方を持てる。",
      },
    ],
    referralTitle: "有料紹介者還元",
    referralBody:
      "紹介は単なる招待リンクではなく、クリエイター経済に参加した人へ継続的な価値を戻す仕組みです。",
    manifesto: [
      "ユーザーの成果が、プラットフォームの成果になる。",
      "作品は消費物ではなく、信用と収益を生む資産になる。",
      "紹介者も観客ではなく、経済圏を育てる参加者になる。",
    ],
  },
  en: {
    liveBadge: "NEXUS LIVE BUILD",
    heroKicker: "Quest, Works, Commerce, Community",
    heroPromise:
      "Eldonia-Nex is a creator economy where users play, create, sell, refer, and receive value back.",
    heroNote:
      "Beyond posting. Quests grow EXP, artwork builds trust, and referrals plus commerce create a revenue loop.",
    ctaExploreQuests: "Explore Quests",
    ctaInvestor: "View investor thesis",
    orbitLabels: ["Quest", "Artwork", "EXP", "Referral", "Revenue"],
    stats: [
      { value: "5", label: "Creator Modules" },
      { value: "EXP", label: "Action Economy" },
      { value: "Rebate", label: "Paid Referral Return" },
    ],
    questEyebrow: "Guild Quest Board",
    questTitle: "Quests turn work into visible trust",
    questLead:
      "Jobs and collaborations become quests. Applications carry portfolio, EXP, and title badges as trust signals.",
    questEmpty: "No open quests yet. Create the first listing in WORKS.",
    topWorksEyebrow: "Top User Works",
    topWorksTitle: "Make user work the first thing people discover",
    topWorksLead:
      "High-view public works appear on the home screen, making talent discovery the first product experience.",
    topWorksEmpty: "No public works yet. The first work will be engraved here.",
    investorEyebrow: "Investor Approach",
    investorTitle: "Growth tied to user success, not ad dependence",
    investorLead:
      "Eldonia-Nex connects creation, referrals, sales, events, and work through one identity and EXP graph.",
    investorCards: [
      {
        title: "Creator-first retention",
        body: "Every action grows portfolio and EXP into a durable trust asset.",
        metric: "LTV by trust",
      },
      {
        title: "Multi-market revenue",
        body: "SHOP, EVENTS, WORKS, and referral returns stack into one loop.",
        metric: "Stacked GMV",
      },
      {
        title: "Community-powered acquisition",
        body: "Paid referral returns turn users into aligned growth partners.",
        metric: "Referral loop",
      },
    ],
    revenueEyebrow: "User Sovereign Revenue",
    revenueTitle: "A user-first revenue structure, built differently",
    revenueLead:
      "The platform does not stand apart from its users. Contributors can share in the value they help create.",
    revenueSteps: [
      { title: "Create", body: "Artwork, products, events, and quests grow trust and EXP." },
      { title: "Connect", body: "Works, commerce, community, and referrals share one path." },
      { title: "Earn", body: "Sell, receive work, host events, and benefit from paid referrals." },
    ],
    referralTitle: "Paid referral return",
    referralBody:
      "A referral is not only an invite link. It returns value to people who help grow the creator economy.",
    manifesto: [
      "User outcomes become platform outcomes.",
      "Artwork becomes an asset for trust and revenue.",
      "Referrers become participants in the economy they grow.",
    ],
  },
  ko: {
    liveBadge: "NEXUS LIVE BUILD",
    heroKicker: "Quest, Works, Commerce, Community",
    heroPromise:
      "Eldonia-Nex는 사용자가 만들고, 판매하고, 소개하고, 보상을 돌려받는 창작 경제권입니다.",
    heroNote:
      "작품 게시에서 끝나지 않습니다. Quest는 EXP를 키우고, 작품은 신뢰를 만들며, 소개와 판매는 수익을 순환시킵니다.",
    ctaExploreQuests: "Quest 보기",
    ctaInvestor: "투자자 관점 보기",
    orbitLabels: ["Quest", "Artwork", "EXP", "Referral", "Revenue"],
    stats: [
      { value: "5", label: "Creator Modules" },
      { value: "EXP", label: "Action Economy" },
      { value: "Rebate", label: "Paid Referral Return" },
    ],
    questEyebrow: "Guild Quest Board",
    questTitle: "오늘의 Quest에서 일과 신뢰가 시작됩니다",
    questLead:
      "채용과 협업을 Quest로 보여주고, 지원 시 포트폴리오, EXP, 칭호가 신뢰 신호가 됩니다.",
    questEmpty: "공개 Quest가 아직 없습니다. WORKS에서 첫 모집을 만들 수 있습니다.",
    topWorksEyebrow: "Top User Works",
    topWorksTitle: "사용자 작품을 홈의 주인공으로",
    topWorksLead:
      "조회수가 높은 공개 작품을 홈에서 소개해 재능 발견을 첫 경험으로 만듭니다.",
    topWorksEmpty: "아직 공개 작품이 없습니다. 첫 작품이 이곳에 새겨집니다.",
    investorEyebrow: "Investor Approach",
    investorTitle: "광고 의존이 아닌, 사용자 성공과 연결된 성장 모델",
    investorLead:
      "창작, 소개, 판매, 이벤트, 일을 하나의 ID와 EXP 그래프로 연결합니다.",
    investorCards: [
      {
        title: "Creator-first retention",
        body: "사용할수록 포트폴리오와 EXP가 신뢰 자산으로 성장합니다.",
        metric: "LTV by trust",
      },
      {
        title: "Multi-market revenue",
        body: "SHOP, EVENTS, WORKS, 소개 환원을 하나의 순환으로 묶습니다.",
        metric: "Stacked GMV",
      },
      {
        title: "Community-powered acquisition",
        body: "유료 소개자 환원으로 사용자가 성장 파트너가 됩니다.",
        metric: "Referral loop",
      },
    ],
    revenueEyebrow: "User Sovereign Revenue",
    revenueTitle: "다른 서비스와 다른 사용자 중심 수익 구조",
    revenueLead:
      "플랫폼만 수익을 가져가는 것이 아니라, 기여한 사용자에게도 가치가 돌아갑니다.",
    revenueSteps: [
      { title: "Create", body: "작품, 상품, 이벤트, Quest가 신뢰와 EXP를 키웁니다." },
      { title: "Connect", body: "작품, 일, 커뮤니티, 소개가 같은 동선으로 연결됩니다." },
      { title: "Earn", body: "판매, 의뢰, 이벤트, 유료 소개 환원으로 수익 경로를 넓힙니다." },
    ],
    referralTitle: "유료 소개자 환원",
    referralBody:
      "소개는 단순한 초대 링크가 아니라 창작 경제를 키운 사람에게 가치를 돌려주는 구조입니다.",
    manifesto: [
      "사용자의 성과가 플랫폼의 성과가 됩니다.",
      "작품은 신뢰와 수익을 만드는 자산이 됩니다.",
      "소개자는 경제권을 키우는 참여자가 됩니다.",
    ],
  },
  "zh-CN": {
    liveBadge: "NEXUS LIVE BUILD",
    heroKicker: "Quest, Works, Commerce, Community",
    heroPromise:
      "Eldonia-Nex 是让用户创作、销售、推荐并获得回报的创作者经济体。",
    heroNote:
      "不止于投稿。Quest 增长 EXP，作品建立信用，推荐与交易形成收益循环。",
    ctaExploreQuests: "查看 Quest",
    ctaInvestor: "查看投资者叙事",
    orbitLabels: ["Quest", "Artwork", "EXP", "Referral", "Revenue"],
    stats: [
      { value: "5", label: "Creator Modules" },
      { value: "EXP", label: "Action Economy" },
      { value: "Rebate", label: "Paid Referral Return" },
    ],
    questEyebrow: "Guild Quest Board",
    questTitle: "从今日 Quest 开始，连接工作与信用",
    questLead:
      "招聘与协作以 Quest 呈现，申请时自动携带作品集、EXP 与称号作为信用信号。",
    questEmpty: "暂无公开 Quest。可以在 WORKS 创建第一条募集。",
    topWorksEyebrow: "Top User Works",
    topWorksTitle: "让用户作品成为首页主角",
    topWorksLead:
      "首页展示高浏览公开作品，让发现创作者才华成为第一体验。",
    topWorksEmpty: "暂无公开作品。第一件作品将在这里被铭刻。",
    investorEyebrow: "Investor Approach",
    investorTitle: "不是广告依赖，而是与用户成功绑定的增长模型",
    investorLead:
      "Eldonia-Nex 用同一身份与 EXP 图谱连接创作、推荐、销售、活动与工作。",
    investorCards: [
      {
        title: "Creator-first retention",
        body: "使用越多，作品集与 EXP 越会沉淀为信用资产。",
        metric: "LTV by trust",
      },
      {
        title: "Multi-market revenue",
        body: "SHOP、EVENTS、WORKS 与推荐返还形成同一个循环。",
        metric: "Stacked GMV",
      },
      {
        title: "Community-powered acquisition",
        body: "有偿推荐返还让用户成为增长伙伴。",
        metric: "Referral loop",
      },
    ],
    revenueEyebrow: "User Sovereign Revenue",
    revenueTitle: "不同于其他服务的用户主义收益结构",
    revenueLead:
      "平台不应独占收益，真正贡献价值的用户也应获得回报。",
    revenueSteps: [
      { title: "Create", body: "作品、商品、活动与 Quest 会增长信用和 EXP。" },
      { title: "Connect", body: "作品、工作、社区与推荐在同一路径中连接。" },
      { title: "Earn", body: "通过销售、委托、活动和有偿推荐返还获得多种收益。" },
    ],
    referralTitle: "有偿推荐者返还",
    referralBody:
      "推荐不只是邀请链接，而是把价值返还给帮助创作者经济成长的人。",
    manifesto: [
      "用户的成果，就是平台的成果。",
      "作品会成为产生信用与收益的资产。",
      "推荐者也是共同建设经济圈的参与者。",
    ],
  },
};

const VIEW_LABEL: Record<UiLocale, string> = {
  ja: "閲覧",
  en: "views",
  ko: "조회",
  "zh-CN": "浏览",
};

function previewUrl(artwork: HomeArtwork): string | null {
  if (artwork.thumbnail_url) return artwork.thumbnail_url;
  if (artwork.media_type === "image") return artwork.media_url;
  return null;
}

export default async function HomePage() {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const copy = HOME_COPY[locale];
  const topArtworks: HomeArtwork[] = await getTopPublicArtworks(6);
  const quests: JobListingWithPoster[] = [];

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main max-w-7xl gap-8">
        <section className="eldonia-home-hero">
          <div className="eldonia-home-hero-copy">
            <p className="eldonia-eyebrow">{t.home.eyebrow}</p>
            <div className="mt-4 inline-flex rounded-full border border-eldonia-border bg-eldonia-surface-elevated/70 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-eldonia-gold-light">
              {copy.liveBadge}
            </div>
            <h1 className="eldonia-heading eldonia-heading-xl mt-6 max-w-4xl">
              {t.home.heroTitle}
            </h1>
            <p className="mt-5 font-display text-sm uppercase tracking-[0.28em] text-eldonia-gold">
              {copy.heroKicker}
            </p>
            <p className="eldonia-body mt-5 max-w-2xl text-lg">{copy.heroPromise}</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-eldonia-text-dim">
              {copy.heroNote}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/auth/signup" className="eldonia-btn-primary">
                {t.home.ctaSignup}
              </Link>
              <Link href="/settings/post/artwork" className="eldonia-btn-secondary">
                {t.home.ctaPostArtwork}
              </Link>
              <Link href="/works" className="eldonia-btn-secondary">
                {copy.ctaExploreQuests}
              </Link>
              <a href="#investor-thesis" className="eldonia-btn-ghost">
                {copy.ctaInvestor}
              </a>
            </div>
          </div>

          <div className="eldonia-nexus-orb" aria-label="Eldonia-Nex revenue loop">
            <div className="eldonia-nexus-orb-core">
              <span>NEX</span>
              <strong>User Value</strong>
            </div>
            {copy.orbitLabels.map((label, index) => (
              <span key={label} className={`eldonia-orbit-label eldonia-orbit-${index + 1}`}>
                {label}
              </span>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {copy.stats.map((stat) => (
            <div key={stat.label} className="eldonia-signal-card">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {t.home.modules.map((module) => (
            <Link
              key={module.name}
              href={MODULE_HREF[module.name] ?? "/"}
              className="eldonia-card eldonia-card-interactive"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-sm font-semibold tracking-wider text-eldonia-gold">
                  {module.name}
                </h2>
                <span className="eldonia-badge eldonia-badge-ready">
                  {t.common.available}
                </span>
              </div>
              <p className="eldonia-body mt-3 text-sm">{module.description}</p>
            </Link>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="eldonia-card">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eldonia-eyebrow">{copy.questEyebrow}</p>
                <h2 className="eldonia-heading eldonia-heading-lg mt-2">
                  {copy.questTitle}
                </h2>
              </div>
              <Link href="/works" className="eldonia-link text-sm font-semibold">
                {t.common.viewAll}
              </Link>
            </div>
            <p className="eldonia-body mt-4 text-sm">{copy.questLead}</p>
            <div className="mt-6 space-y-3">
              {quests.length > 0 ? (
                quests.map((quest) => (
                  <Link
                    key={quest.id}
                    href={`/works/${quest.id}`}
                    className="eldonia-quest-row group"
                  >
                    <span className="eldonia-quest-glyph" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <strong className="line-clamp-1">{quest.title}</strong>
                      <small>
                        {jobTypeLabel(quest.job_type, locale)} /{" "}
                        {formatBudget(quest.budget_min, quest.budget_max, locale)}
                      </small>
                    </span>
                    {quest.is_featured && (
                      <span className="eldonia-badge eldonia-badge-ready">
                        {t.pages.featured}
                      </span>
                    )}
                  </Link>
                ))
              ) : (
                <p className="rounded-lg border border-dashed border-eldonia-border p-4 text-sm text-eldonia-text-muted">
                  {copy.questEmpty}
                </p>
              )}
            </div>
          </div>

          <div className="eldonia-card overflow-hidden">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eldonia-eyebrow">{copy.topWorksEyebrow}</p>
                <h2 className="eldonia-heading eldonia-heading-lg mt-2">
                  {copy.topWorksTitle}
                </h2>
              </div>
              <Link href="/gallery" className="eldonia-link text-sm font-semibold">
                {t.common.viewAll}
              </Link>
            </div>
            <p className="eldonia-body mt-4 text-sm">{copy.topWorksLead}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {topArtworks.length > 0 ? (
                topArtworks.map((artwork, index) => {
                  const imageUrl = previewUrl(artwork);
                  const creatorName =
                    artwork.profiles?.display_name ??
                    artwork.profiles?.username ??
                    t.pages.creatorFallback;

                  return (
                    <Link
                      key={artwork.id}
                      href={`/gallery/${artwork.id}`}
                      className="eldonia-top-work group"
                    >
                      <div className="eldonia-top-work-rank">0{index + 1}</div>
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-eldonia-border bg-eldonia-surface">
                        {imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageUrl}
                            alt={artwork.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-wider text-eldonia-text-dim">
                            {artwork.media_type}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-eldonia-gold">
                          {categoryLabel(artwork.category, locale)}
                        </p>
                        <strong className="mt-1 line-clamp-1 block text-eldonia-gold-light">
                          {artwork.title}
                        </strong>
                        <p className="mt-1 text-sm text-eldonia-text-muted">
                          {creatorName}
                        </p>
                        <p className="mt-1 text-xs text-eldonia-text-dim">
                          {artwork.view_count.toLocaleString()} {VIEW_LABEL[locale]}
                        </p>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="rounded-lg border border-dashed border-eldonia-border p-4 text-sm text-eldonia-text-muted">
                  {copy.topWorksEmpty}
                </p>
              )}
            </div>
          </div>
        </section>

        <section id="investor-thesis" className="eldonia-investor-panel">
          <div className="max-w-3xl">
            <p className="eldonia-eyebrow">{copy.investorEyebrow}</p>
            <h2 className="eldonia-heading eldonia-heading-lg mt-2">
              {copy.investorTitle}
            </h2>
            <p className="eldonia-body mt-4">{copy.investorLead}</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {copy.investorCards.map((card) => (
              <article key={card.title} className="eldonia-investor-card">
                <span>{card.metric}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="eldonia-card">
            <p className="eldonia-eyebrow">{copy.revenueEyebrow}</p>
            <h2 className="eldonia-heading eldonia-heading-lg mt-2">
              {copy.revenueTitle}
            </h2>
            <p className="eldonia-body mt-4">{copy.revenueLead}</p>
            <EldoniaDivider />
            <div className="space-y-3">
              {copy.manifesto.map((line) => (
                <p key={line} className="eldonia-manifesto-line">
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="eldonia-revenue-loop">
            {copy.revenueSteps.map((step, index) => (
              <article key={step.title} className="eldonia-revenue-step">
                <span>0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
            <article className="eldonia-referral-card">
              <p className="eldonia-eyebrow">{copy.referralTitle}</p>
              <h3>Referral Dividend</h3>
              <p>{copy.referralBody}</p>
              <Link href="/settings" className="eldonia-link mt-4 inline-block text-sm font-semibold">
                {t.home.ctaSettings}
              </Link>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
