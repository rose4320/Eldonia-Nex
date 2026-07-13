import type { UiLocale } from "@/lib/i18n/locale";
import { LP_FOOTER_NAV_LINKS, localizedFooterLabel } from "@/lib/layout/footer-links";

export type LpNavItem = { href: string; label: string };
export type LpFooterLink = { href: string; label: string };

export type LpFeatureCard = {
  key: "gallery" | "community" | "shop";
  title: string;
  body: string;
};

export type LpConceptStep = {
  no: string;
  key: string;
  title: string;
  body: string;
  loop: boolean;
};

export type LpConceptCycleNode = {
  no: string;
  left: string;
  top: string;
  callout: "bottom" | "right" | "left" | "top";
  hub?: boolean;
  title: string;
  body: string;
};

export type LpServiceItem = {
  key: string;
  title: string;
  tagline: string;
  body: string;
  href: string;
};

export type LpQuestPortfolioCard = {
  key: string;
  title: string;
  tagline: string;
  body: string;
  items: string[];
  href: string;
  cta: string;
};

export type LpPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  featured: boolean;
  badge?: string;
  features: string[];
  cta: string;
  href: string;
};

export type LpRewardPerk = {
  icon: "pin" | "community" | "early";
  label: string;
  desc: string;
};

export type LpContent = {
  LP_NAV: LpNavItem[];
  LP_FOOTER_LINKS: LpFooterLink[];
  LP_HERO: {
    title: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
  };
  LP_FEATURE_CARDS: LpFeatureCard[];
  LP_WORLD: { title: string; body: string };
  LP_CONCEPT: {
    eyebrow: string;
    title: string;
    analogy: string;
    lead: string;
    steps: LpConceptStep[];
    note: string;
    controls: { scrollHint: string; treeAriaLabel: string };
    cycle: LpConceptCycleNode[];
  };
  LP_FAN_NOTIFICATION: {
    eyebrow: string;
    title: string;
    lead: string;
    items: string[];
    note: string;
  };
  LP_SERVICES: {
    title: string;
    subtitle: string;
    more: string;
    items: LpServiceItem[];
  };
  LP_QUEST_PORTFOLIO: {
    eyebrow: string;
    title: string;
    flowHint: string;
    lead: string;
    flow: string;
    quest: LpQuestPortfolioCard;
    portfolio: LpQuestPortfolioCard;
  };
  LP_TRANSLATION: {
    title: string;
    lead: string;
    items: string[];
    imageAlt: string;
  };
  LP_PLANS_SECTION: {
    title: string;
    lead: string;
    note: string;
  };
  LP_PLANS: LpPlan[];
  LP_REFERRAL: {
    badge: string;
    title: string;
    body: string;
    note: string;
  };
  LP_REWARDS: {
    title: string;
    lead: string;
    serialTitle: string;
    serialBody: string;
    serialExampleLabel: string;
    serialExample: string;
    serialLegend: string;
    pinBadgeAlt: string;
    perks: LpRewardPerk[];
  };
  LP_CTA: {
    title: string;
    lead: string;
    placeholder: string;
    submit: string;
    submitting: string;
    success: string;
    alreadyRegistered: string;
    error: string;
    thankTitle: string;
    thankBody: string;
    thankDuplicateTitle: string;
    thankDuplicateBody: string;
    thankGoHome: string;
    thankClose: string;
    thankCarryOver: string;
  };
  LP_FOOTER: {
    copyright: string;
    social: { label: string; href: string }[];
  };
  LP_SEO: {
    title: string;
    description: string;
  };
};

function footerLinks(locale: UiLocale): LpFooterLink[] {
  return LP_FOOTER_NAV_LINKS.map(({ href, label }) => ({
    href,
    label: localizedFooterLabel(label, locale),
  }));
}

const LP_JA: LpContent = {
  LP_NAV: [
    { href: "#world", label: "World" },
    { href: "#concept", label: "Concept" },
    { href: "#fan", label: "Fan" },
    { href: "#quest", label: "Quest" },
    { href: "#services", label: "Services" },
    { href: "#plans", label: "Plans" },
    { href: "#rewards", label: "Rewards" },
    { href: "#start", label: "Start" },
  ],
  LP_FOOTER_LINKS: footerLinks("ja"),
  LP_HERO: {
    title: "エルドニアで、\nあなたの物語をはじめよう。",
    lead: "作品を公開し、仲間とつながり、創作を収益へ。\nクリエイターとファンが育て合う、新しい創作の場。",
    primaryCta: "無料で始める",
    secondaryCta: "機能を見る",
  },
  LP_FEATURE_CARDS: [
    { key: "gallery", title: "Gallery", body: "作品を発信" },
    { key: "community", title: "Community", body: "仲間と交流" },
    { key: "shop", title: "Shop", body: "作品を販売" },
  ],
  LP_WORLD: {
    title: "世界に、\n作品が巡る。",
    body: "クリエイターとファンが作品を育て合い、収益と経験が次の創作へ還る。公開・交流・販売・挑戦がひとつにつながり、次の物語が生まれる。あなたの物語が世界の一部になる場所です。",
  },
  LP_CONCEPT: {
    eyebrow: "Concept",
    title: "あなたの物語は、\n世界樹に刻まれる。",
    analogy: "世界樹は、作品・仲間・収益がつながるたとえです。",
    lead: "投稿が種となり、ファンの応援が光と雨。コラボで花が咲き、仕事と収益が実となり、また次の作品へ——物語は、ここで循環していきます。",
    steps: [
      { no: "01", key: "born", title: "生まれる", body: "作品を投稿する。世界に、あなたの“種”をまく。", loop: false },
      { no: "02", key: "grow", title: "育つ", body: "ファンがつき、応援され、あなたの作品が“推し”になっていく。", loop: false },
      { no: "03", key: "fruit", title: "実る", body: "仲間とコラボし、二次創作が生まれ、作品が世界へ広がる。", loop: false },
      { no: "04", key: "cycle", title: "また種に", body: "生まれた作品が、次の作品を生む。—— 作品が、作品を育てていく。", loop: true },
    ],
    note: "スクロールで、1→8 の循環をたどってください。",
    controls: {
      scrollHint: "スクロールで 1→8 の循環をたどれます",
      treeAriaLabel: "世界樹の創造循環アニメーション",
    },
    cycle: [
      { no: "1", left: "50%", top: "54%", callout: "bottom", hub: true, title: "幹：Eldonia–Nex", body: "クリエイターと作品を育てる場所。主役はあなたの創作——幹は、その芽吹きと成長を支える土台です。" },
      { no: "2", left: "33%", top: "41%", callout: "right", title: "枝：クリエイター", body: "幹から枝が伸びるように、作家・絵師・音楽家が参加する。その創作が Eldonia–Nex を育てる栄養となり、創造の輪が広がる。" },
      { no: "3", left: "62%", top: "35%", callout: "left", title: "葉：作品", body: "枝に葉が茂るように、Gallery で作品が公開され、一つひとつの創造が森を彩る。" },
      { no: "4", left: "58%", top: "9%", callout: "bottom", title: "光と雨：ファン・観覧者", body: "閲覧・いいね・コメント・応援が栄養となり、作品とクリエイターを育て、葉を大きくする。" },
      { no: "5", left: "68%", top: "56%", callout: "left", title: "花：花開く", body: "Lab の共同制作や Community、Events で作品が花開き、スピンオフや二次創作が芽吹く。" },
      { no: "6", left: "76%", top: "73%", callout: "left", title: "実：実る", body: "Shop・Events・Works で仕事を獲得する。充実したポートフォリオがあれば、よりつながりやすい。芽吹いたスピンオフも含め、ファンの支援とともに創作が実を結び、収益と評価がクリエイターへ還る。" },
      { no: "7", left: "49%", top: "80%", callout: "top", title: "種：次の作品へ", body: "実から種ができる。得た収益や実績、経験が次の制作の糧となり、新しい作品がまた幹から芽吹く。" },
      { no: "8", left: "18%", top: "58%", callout: "right", title: "Quest と大循環", body: "Quest に挑戦し、Gallery や Lab、Events などの活動とともに実績が蓄積され、Works のポートフォリオが充実する。ポートフォリオが充実すれば、仕事にもつながりやすい。得た経験と仲間が次の大作やスピンオフへつながり、世界樹はさらに育つ。" },
    ],
  },
  LP_FAN_NOTIFICATION: {
    eyebrow: "Fan",
    title: "Fan になると、\n活動が届く。",
    lead: "推しクリエイターの投稿・販売・イベントなどを、必要なものだけ受け取れる。応援の光が、あなたのもとへ届く仕組みです。",
    items: [
      "Gallery の新作投稿",
      "Shop の販売・新着",
      "Events・Live の告知",
      "Lab 公開・Works / コラボ",
    ],
    note: "受け取り方は「重要のみ」「すべて」「週まとめ」「OFF」などから選べます。",
  },
  LP_SERVICES: {
    title: "創作を巡る6つの場",
    subtitle: "公開・交流・販売・挑戦——創作に必要な場が、ひとつにつながります。",
    more: "もっと見る",
    items: [
      { key: "gallery", title: "Gallery", tagline: "作品を公開し、世界に届ける", body: "イラスト・漫画・写真・3DCGなど、あらゆる作品を投稿・展示。あなたの創造を世界へ。", href: "/gallery" },
      { key: "lab", title: "Lab", tagline: "仲間と共同制作する", body: "コラボ申請からチームを組み、Lab ルームで一緒に制作。成果は Gallery や Shop へ展開できます。", href: "/lab" },
      { key: "event", title: "Events", tagline: "イベントを見つけ、体験に参加する", body: "オンライン・オフラインのイベントやコンテストを掲載。新しい出会いや体験がここに。", href: "/events" },
      { key: "shop", title: "Shop", tagline: "作品やアイテムを販売する", body: "オリジナルグッズやデジタルデータを販売。あなたの作品が価値になる。", href: "/shop" },
      { key: "community", title: "Community", tagline: "仲間とつながり、支え合う", body: "フォーラムやグループで交流し、共に成長する。創造の輪を広げていこう。", href: "/community" },
      { key: "work", title: "Works", tagline: "仕事を依頼・受注する", body: "ポートフォリオを通じて仕事の依頼を受けたり、プロジェクトに参加できる。", href: "/works" },
    ],
  },
  LP_QUEST_PORTFOLIO: {
    eyebrow: "Growth Loop",
    title: "挑戦が、\n次の仕事につながる。",
    flowHint: "成長の流れを、シンプルに示します。",
    lead: "Quest で挑戦し、活動実績がポートフォリオにたまる。その証明が、コラボや仕事の扉を開きます。",
    flow: "挑戦 → 実績 → Portfolio → Works",
    quest: {
      key: "quest",
      title: "Quest",
      tagline: "挑戦して成長する",
      body: "公式・企業の Quest に参加し、EXP と実績を積み上げます。\n企業案件では、報酬や商品につながる挑戦も予定しています。",
      items: ["公式・企業の Quest に参加", "EXP・Lv・称号を獲得", "達成がポートフォリオに残る"],
      href: "/works",
      cta: "Quest を見る",
    },
    portfolio: {
      key: "work",
      title: "Portfolio",
      tagline: "実績をひとつにまとめる",
      body: "Gallery・Lab・Events・Shop・Quest——\nすべての活動が、ひとつのポートフォリオに集まります。",
      items: ["活動・実績を一元管理", "EXP / Lv / 称号と履歴を表示", "求人・コラボ応募に自動添付"],
      href: "/works/portfolio",
      cta: "ポートフォリオを見る",
    },
  },
  LP_TRANSLATION: {
    title: "言語の壁をこえて、\n作品が届く。",
    lead: "日本語・英語・中国語・韓国語に対応。投稿やコメントも、翻訳でつながれます。",
    items: [
      "世界中のクリエイターやファンにリーチ",
      "投稿・コメント・プロフィールを翻訳表示",
      "言語をこえて、交流とコラボを広げられる",
    ],
    imageAlt: "多言語翻訳を示すネオンアイコン",
  },
  LP_PLANS_SECTION: {
    title: "Plans",
    lead: "まずは無料ではじめて、必要に応じて創作・販売・仕事の範囲を広げられます。",
    note: "料金・特典はベータ期間中に調整する場合があります。",
  },
  LP_PLANS: [
    { id: "free", name: "Free", price: "¥0", period: "ずっと無料", featured: false, features: ["作品の公開（3点まで）", "コミュニティ参加", "基本プロフィール"], cta: "無料で始める", href: "/auth/signup" },
    { id: "standard", name: "Standard", price: "¥800", period: "/ 月", featured: false, features: ["作品の無制限公開", "ショップ機能（手数料5%）", "イベント参加・主催", "カスタムプロフィール"], cta: "このプランを選ぶ", href: "/auth/signup" },
    { id: "premium", name: "Premium", price: "¥2,980", period: "/ 月", featured: true, badge: "おすすめ", features: ["Standard のすべて", "ショップ手数料 3%", "仕事の依頼・応募", "高度な分析・レポート", "優先サポート"], cta: "このプランを選ぶ", href: "/auth/signup" },
    { id: "business", name: "Business", price: "¥10,000", period: "/ 月", featured: false, features: ["法人向け機能", "チーム管理・権限設定", "専用サポート・SLA"], cta: "お問い合わせ", href: "/help/contact" },
  ],
  LP_REFERRAL: {
    badge: "紹介報酬\n10%\n永久還元",
    title: "有料プランのユーザー紹介で、紹介した相手の利用が続く限り永久に10%還元",
    body: "創作活動を広げながら、あなたの貢献がずっと還ってきます。",
    note: "※日本以外のユーザー紹介は15%還元を予定。",
  },
  LP_REWARDS: {
    title: "貢献者への特別な感謝",
    lead: "ベータ期間中の継続利用や作品公開、紹介、コミュニティ参加など——Eldonia–Nexの立ち上げに貢献いただいた方へ、感謝の証として特製EN記念ピンバッジを贈呈予定。実績の高いクリエイターには、限定コミュニティへの招待や先行アクセスなど、ここでしか得られない特典をご用意しています。",
    serialTitle: "シリアル番号付き記念ピンバッジ",
    serialBody: "記念ピンバッジには、1点ごとに固有のシリアル番号を付与予定。番号構成は「年号・カテゴリー・通し番号」です。",
    serialExampleLabel: "例：",
    serialExample: "2026-CON-001",
    serialLegend: "CAT例：CON（貢献者） / EAR（早期支援） / CRE（クリエイター）",
    pinBadgeAlt: "EN記念ピンバッジ",
    perks: [
      { icon: "pin", label: "EN記念ピンバッジ", desc: "（予定）" },
      { icon: "community", label: "限定コミュニティ招待", desc: "" },
      { icon: "early", label: "先行アクセス", desc: "" },
    ],
  },
  LP_CTA: {
    title: "今すぐ Eldonia–Nex をはじめよう",
    lead: "事前登録で、ベータ版の先行案内と限定特典をお届けします。",
    placeholder: "メールアドレスを入力",
    submit: "事前登録する",
    submitting: "送信中...",
    success: "事前登録を受け付けました。ベータ先行案内をお送りします。",
    alreadyRegistered: "このメールアドレスは既に登録済みです。",
    error: "登録に失敗しました。時間をおいて再度お試しください。",
    thankTitle: "ご登録ありがとうございます！",
    thankBody: "ベータ版の先行案内と限定特典を、ご登録のメールアドレスにお届けします。公開までもうしばらくお待ちください。",
    thankDuplicateTitle: "すでにご登録済みです",
    thankDuplicateBody: "このメールアドレスは既に登録されています。公開の準備が整い次第、先行案内をお送りします。",
    thankGoHome: "ホームへ",
    thankClose: "閉じる",
    thankCarryOver: "試験期間中のご利用データ（作品・EXP・実績など）は、本格運用の開始後もそのまま引き継がれます。安心してお試しください。",
  },
  LP_FOOTER: {
    copyright: "© 2026 Eldonia–Nex. All rights reserved.",
    social: [
      { label: "X", href: "https://x.com" },
      { label: "Discord", href: "https://discord.com" },
      { label: "YouTube", href: "https://youtube.com" },
      { label: "Email", href: "mailto:support@eldonia-nex.com" },
    ],
  },
  LP_SEO: {
    title: "Eldonia–Nex｜エルドニアで、あなたの物語をはじめよう",
    description: "作品公開、コミュニティ、販売、イベント、仕事マッチングをつなぐ創作プラットフォーム。クリエイターとファンが育て合う、Eldonia–Nex。",
  },
};

const LP_EN: LpContent = {
  LP_NAV: [
    { href: "#world", label: "World" },
    { href: "#concept", label: "Concept" },
    { href: "#fan", label: "Fan" },
    { href: "#quest", label: "Quest" },
    { href: "#services", label: "Services" },
    { href: "#plans", label: "Plans" },
    { href: "#rewards", label: "Rewards" },
    { href: "#start", label: "Start" },
  ],
  LP_FOOTER_LINKS: footerLinks("en"),
  LP_HERO: {
    title: "In Eldonia,\nbegin your story.",
    lead: "Publish your work, connect with collaborators, and turn creativity into income.\nA new home where creators and fans grow together.",
    primaryCta: "Start for free",
    secondaryCta: "Explore features",
  },
  LP_FEATURE_CARDS: [
    { key: "gallery", title: "Gallery", body: "Share your work" },
    { key: "community", title: "Community", body: "Connect with peers" },
    { key: "shop", title: "Shop", body: "Sell your creations" },
  ],
  LP_WORLD: {
    title: "Across the world,\nwork finds its audience.",
    body: "Creators and fans nurture work together, and earnings and experience flow back into the next project. Publishing, community, commerce, and challenges connect in one loop — and your story becomes part of something larger.",
  },
  LP_CONCEPT: {
    eyebrow: "Concept",
    title: "Your story is etched\ninto the World Tree.",
    analogy: "The World Tree is a metaphor for how work, community, and earnings connect.",
    lead: "Posts become seeds. Fan support becomes light and rain. Collaborations bloom. Work and revenue bear fruit — then feed the next creation. Here, stories circulate.",
    steps: [
      { no: "01", key: "born", title: "Born", body: "Publish your work. Plant your seed in the world.", loop: false },
      { no: "02", key: "grow", title: "Grow", body: "Fans gather, cheer you on, and your work becomes someone's favorite.", loop: false },
      { no: "03", key: "fruit", title: "Bear fruit", body: "Collaborate, inspire derivative works, and let your creations spread.", loop: false },
      { no: "04", key: "cycle", title: "Back to seed", body: "What you make inspires what comes next — work nurtures more work.", loop: true },
    ],
    note: "Scroll to follow the 1→8 cycle.",
    controls: {
      scrollHint: "Scroll to follow the 1→8 cycle",
      treeAriaLabel: "World Tree creative cycle animation",
    },
    cycle: [
      { no: "1", left: "50%", top: "54%", callout: "bottom", hub: true, title: "Trunk: Eldonia–Nex", body: "The ground where creators and work grow. Your creativity leads — the trunk supports every sprout and every step forward." },
      { no: "2", left: "33%", top: "41%", callout: "right", title: "Branch: Creators", body: "Like branches from the trunk, writers, artists, and musicians join in. Their work nourishes Eldonia–Nex and widens the circle of creation." },
      { no: "3", left: "62%", top: "35%", callout: "left", title: "Leaves: Works", body: "As leaves fill the branches, Gallery publishes work — each creation adding color to the forest." },
      { no: "4", left: "58%", top: "9%", callout: "bottom", title: "Light & rain: Fans", body: "Views, likes, comments, and support become nourishment that helps creators and work grow." },
      { no: "5", left: "68%", top: "56%", callout: "left", title: "Bloom", body: "Through Lab collaborations, Community, and Events, work blossoms — spin-offs and fan creations take root." },
      { no: "6", left: "76%", top: "73%", callout: "left", title: "Harvest", body: "Earn through Shop, Events, and Works. A strong portfolio opens more doors. With fan support, creation bears fruit — income and recognition return to creators." },
      { no: "7", left: "49%", top: "80%", callout: "top", title: "Seed: Next work", body: "Fruit becomes seed. Earnings, achievements, and experience fuel the next project — and new work sprouts from the trunk again." },
      { no: "8", left: "18%", top: "58%", callout: "right", title: "Quest & the great cycle", body: "Take on Quests, build a record across Gallery, Lab, and Events, and strengthen your Works portfolio. A richer portfolio leads to better opportunities — experience and allies feed your next big project, and the World Tree keeps growing." },
    ],
  },
  LP_FAN_NOTIFICATION: {
    eyebrow: "Fan",
    title: "Become a Fan —\nstay close to the creators you love.",
    lead: "Get the updates that matter: new posts, shop drops, events, and more. Support travels like light — straight to you.",
    items: [
      "New Gallery posts",
      "Shop sales & new arrivals",
      "Events & live announcements",
      "Lab releases, Works & collabs",
    ],
    note: "Choose how you receive updates: important only, all, weekly digest, or off.",
  },
  LP_SERVICES: {
    title: "Six spaces for creative life",
    subtitle: "Publish, connect, sell, and challenge yourself — everything you need, linked together.",
    more: "Learn more",
    items: [
      { key: "gallery", title: "Gallery", tagline: "Publish and reach the world", body: "Share illustration, comics, photography, 3D, and more. Put your creativity where people can discover it.", href: "/gallery" },
      { key: "lab", title: "Lab", tagline: "Create together", body: "Request a collab, form a team, and build in Lab rooms. Ship results to Gallery and Shop.", href: "/lab" },
      { key: "event", title: "Events", tagline: "Find experiences worth joining", body: "Discover online and offline events and contests — new connections and moments live here.", href: "/events" },
      { key: "shop", title: "Shop", tagline: "Sell work and goods", body: "Offer originals, merch, and digital downloads. Turn what you make into lasting value.", href: "/shop" },
      { key: "community", title: "Community", tagline: "Connect and support each other", body: "Talk in forums and groups, grow together, and widen the circle of creation.", href: "/community" },
      { key: "work", title: "Works", tagline: "Commission and take on jobs", body: "Receive project requests and join paid work through your portfolio.", href: "/works" },
    ],
  },
  LP_QUEST_PORTFOLIO: {
    eyebrow: "Growth Loop",
    title: "Every challenge\nopens the next door.",
    flowHint: "A simple view of how growth compounds.",
    lead: "Take on Quests and let your activity build a portfolio. That proof opens collabs and paid work.",
    flow: "Challenge → Record → Portfolio → Works",
    quest: {
      key: "quest",
      title: "Quest",
      tagline: "Challenge yourself and level up",
      body: "Join official and brand Quests to earn EXP and achievements.\nBrand challenges may also lead to rewards and products.",
      items: ["Join official & brand Quests", "Earn EXP, levels, and titles", "Achievements stay on your portfolio"],
      href: "/works",
      cta: "Browse Quests",
    },
    portfolio: {
      key: "work",
      title: "Portfolio",
      tagline: "One home for everything you've done",
      body: "Gallery, Lab, Events, Shop, Quest —\nall your activity gathers in one portfolio.",
      items: ["Manage activity in one place", "Show EXP, level, titles, and history", "Attach automatically to job & collab applications"],
      href: "/works/portfolio",
      cta: "View portfolio",
    },
  },
  LP_TRANSLATION: {
    title: "Beyond language,\nwork still reaches people.",
    lead: "Japanese, English, Chinese, and Korean supported. Posts and comments can be translated so connection doesn't stop at borders.",
    items: [
      "Reach creators and fans worldwide",
      "Translate posts, comments, and profiles",
      "Build community and collabs across languages",
    ],
    imageAlt: "Neon icon representing multilingual translation",
  },
  LP_PLANS_SECTION: {
    title: "Plans",
    lead: "Start free, then expand into publishing, selling, and paid work when you're ready.",
    note: "Pricing and benefits may change during the beta period.",
  },
  LP_PLANS: [
    { id: "free", name: "Free", price: "¥0", period: "Free forever", featured: false, features: ["Publish up to 3 works", "Community access", "Basic profile"], cta: "Start for free", href: "/auth/signup" },
    { id: "standard", name: "Standard", price: "¥800", period: "/ month", featured: false, features: ["Unlimited publishing", "Shop (5% fee)", "Join & host events", "Custom profile"], cta: "Choose this plan", href: "/auth/signup" },
    { id: "premium", name: "Premium", price: "¥2,980", period: "/ month", featured: true, badge: "Recommended", features: ["Everything in Standard", "Shop fee 3%", "Job requests & applications", "Advanced analytics & reports", "Priority support"], cta: "Choose this plan", href: "/auth/signup" },
    { id: "business", name: "Business", price: "¥10,000", period: "/ month", featured: false, features: ["Business features", "Team management & permissions", "Dedicated support & SLA"], cta: "Contact us", href: "/help/contact" },
  ],
  LP_REFERRAL: {
    badge: "Referral\n10%\nlifetime",
    title: "Refer paid members and earn 10% for as long as they stay subscribed",
    body: "Grow the creative community — and keep earning from the people you bring in.",
    note: "Referrals outside Japan are planned at 15% return.",
  },
  LP_REWARDS: {
    title: "A thank-you to early contributors",
    lead: "During beta, sustained use, publishing, referrals, and community participation help Eldonia–Nex take root. As a token of thanks, we plan to award a limited EN commemorative pin badge. Top creators may also receive invites to private communities and early access you won't find anywhere else.",
    serialTitle: "Serial-numbered commemorative pin",
    serialBody: "Each badge is planned to carry a unique serial number in the format: year · category · sequence.",
    serialExampleLabel: "Example:",
    serialExample: "2026-CON-001",
    serialLegend: "CAT examples: CON (Contributor) / EAR (Early supporter) / CRE (Creator)",
    pinBadgeAlt: "EN commemorative pin badge",
    perks: [
      { icon: "pin", label: "EN commemorative pin", desc: "(planned)" },
      { icon: "community", label: "Private community invite", desc: "" },
      { icon: "early", label: "Early access", desc: "" },
    ],
  },
  LP_CTA: {
    title: "Start Eldonia–Nex today",
    lead: "Pre-register for early beta access and exclusive launch perks.",
    placeholder: "Enter your email",
    submit: "Pre-register",
    submitting: "Sending...",
    success: "You're on the list. We'll send beta access details soon.",
    alreadyRegistered: "This email is already registered.",
    error: "Registration failed. Please try again in a moment.",
    thankTitle: "Thanks for signing up!",
    thankBody: "We'll email you early beta access and launch perks. Hang tight — we're almost ready.",
    thankDuplicateTitle: "You're already registered",
    thankDuplicateBody: "This email is already on the list. We'll reach out as soon as we're ready to open.",
    thankGoHome: "Go to home",
    thankClose: "Close",
    thankCarryOver: "Data from the trial period — works, EXP, achievements, and more — carries over when full service launches. Explore freely.",
  },
  LP_FOOTER: {
    copyright: "© 2026 Eldonia–Nex. All rights reserved.",
    social: [
      { label: "X", href: "https://x.com" },
      { label: "Discord", href: "https://discord.com" },
      { label: "YouTube", href: "https://youtube.com" },
      { label: "Email", href: "mailto:support@eldonia-nex.com" },
    ],
  },
  LP_SEO: {
    title: "Eldonia–Nex | Begin your story in Eldonia",
    description: "A creator platform linking publishing, community, commerce, events, and job matching. Eldonia–Nex — where creators and fans grow together.",
  },
};

const LP_KO: LpContent = {
  LP_NAV: [
    { href: "#world", label: "World" },
    { href: "#concept", label: "Concept" },
    { href: "#fan", label: "Fan" },
    { href: "#quest", label: "Quest" },
    { href: "#services", label: "Services" },
    { href: "#plans", label: "Plans" },
    { href: "#rewards", label: "Rewards" },
    { href: "#start", label: "Start" },
  ],
  LP_FOOTER_LINKS: footerLinks("ko"),
  LP_HERO: {
    title: "엘도니아에서\n당신의 이야기를 시작하세요.",
    lead: "작품을 공개하고, 동료와 연결되며, 창작을 수익으로 이어가세요.\n크리에이터와 팬이 함께 키워 가는 새로운 창작의 장.",
    primaryCta: "무료로 시작하기",
    secondaryCta: "기능 살펴보기",
  },
  LP_FEATURE_CARDS: [
    { key: "gallery", title: "Gallery", body: "작품 발신" },
    { key: "community", title: "Community", body: "동료와 교류" },
    { key: "shop", title: "Shop", body: "작품 판매" },
  ],
  LP_WORLD: {
    title: "세계 속으로,\n작품이 흐릅니다.",
    body: "크리에이터와 팬이 작품을 함께 키우고, 수익과 경험은 다음 창작으로 돌아갑니다. 공개·교류·판매·도전이 하나로 이어지며, 다음 이야기가 태어납니다. 당신의 이야기가 세계의 일부가 되는 곳입니다.",
  },
  LP_CONCEPT: {
    eyebrow: "Concept",
    title: "당신의 이야기는\n세계수에 새겨집니다.",
    analogy: "세계수는 작품·동료·수익이 연결되는 비유입니다.",
    lead: "게시가 씨앗이 되고, 팬의 응원이 빛과 비가 됩니다. 콜라보로 꽃이 피고, 일과 수익이 열매가 되어 다시 다음 작품으로——이야기는 이곳에서 순환합니다.",
    steps: [
      { no: "01", key: "born", title: "태어남", body: "작품을 게시합니다. 세계에 당신의 ‘씨앗’을 뿌립니다.", loop: false },
      { no: "02", key: "grow", title: "자람", body: "팬이 모이고 응원받으며, 당신의 작품이 ‘최애’가 됩니다.", loop: false },
      { no: "03", key: "fruit", title: "결실", body: "동료와 콜라보하고, 2차 창작이 생기며 작품이 세계로 퍼집니다.", loop: false },
      { no: "04", key: "cycle", title: "다시 씨앗으로", body: "탄생한 작품이 다음 작품을 낳습니다——작품이 작품을 키웁니다.", loop: true },
    ],
    note: "스크롤하여 1→8 순환을 따라가 보세요.",
    controls: {
      scrollHint: "스크롤하여 1→8 순환을 따라갈 수 있습니다",
      treeAriaLabel: "세계수 창작 순환 애니메이션",
    },
    cycle: [
      { no: "1", left: "50%", top: "54%", callout: "bottom", hub: true, title: "줄기: Eldonia–Nex", body: "크리에이터와 작품을 키우는 곳. 주인공은 당신의 창작——줄기는 그 싹과 성장을 받쳐 주는 토대입니다." },
      { no: "2", left: "33%", top: "41%", callout: "right", title: "가지: 크리에이터", body: "줄기에서 가지가 뻗듯 작가·일러스트레이터·뮤지션이 참여합니다. 그 창작이 Eldonia–Nex를 키우는 영양이 되어 창조의 고리가 넓어집니다." },
      { no: "3", left: "62%", top: "35%", callout: "left", title: "잎: 작품", body: "가지에 잎이 무성해지듯 Gallery에서 작품이 공개되고, 하나하나의 창조가 숲을 물들입니다." },
      { no: "4", left: "58%", top: "9%", callout: "bottom", title: "빛과 비: 팬·관람자", body: "조회·좋아요·댓글·응원이 영양이 되어 작품과 크리에이터를 키우고 잎을 크게 합니다." },
      { no: "5", left: "68%", top: "56%", callout: "left", title: "꽃: 개화", body: "Lab 공동 제작과 Community, Events를 통해 작품이 꽃피고 스핀오프·2차 창작이 싹틉니다." },
      { no: "6", left: "76%", top: "73%", callout: "left", title: "열매: 결실", body: "Shop·Events·Works로 일을 얻습니다.충실한 포트폴리오가 더 많은 연결을 열어 줍니다. 팬의 지원과 함께 창작이 열매를 맺고, 수익과 평가가 크리에이터에게 돌아갑니다." },
      { no: "7", left: "49%", top: "80%", callout: "top", title: "씨앗: 다음 작품으로", body: "열매에서 씨앗이 됩니다. 얻은 수익·실적·경험이 다음 제작의 양분이 되어 새 작품이 다시 줄기에서 싹틉니다." },
      { no: "8", left: "18%", top: "58%", callout: "right", title: "Quest와 대순환", body: "Quest에 도전하고 Gallery·Lab·Events 등의 활동과 함께 실적이 쌓이며 Works 포트폴리오가 풍성해집니다. 포트폴리오가 충실하면 일로도 더 잘 이어집니다. 얻은 경험과 동료가 다음 대작·스핀오프로 이어지며 세계수는 더 자랍니다." },
    ],
  },
  LP_FAN_NOTIFICATION: {
    eyebrow: "Fan",
    title: "Fan이 되면\n활동 소식이 도착합니다.",
    lead: "최애 크리에이터의 게시·판매·이벤트 등 필요한 소식만 받을 수 있습니다. 응원의 빛이 당신에게 닿는 구조입니다.",
    items: [
      "Gallery 신작 게시",
      "Shop 판매·신상",
      "Events·Live 공지",
      "Lab 공개·Works / 콜라보",
    ],
    note: "수신 방식은 ‘중요만’ ‘전체’ ‘주간 요약’ ‘OFF’ 등에서 선택할 수 있습니다.",
  },
  LP_SERVICES: {
    title: "창작을 둘러싼 6개의 공간",
    subtitle: "공개·교류·판매·도전——창작에 필요한 공간이 하나로 연결됩니다.",
    more: "더 보기",
    items: [
      { key: "gallery", title: "Gallery", tagline: "작품을 공개하고 세계에 전달", body: "일러스트·만화·사진·3DCG 등 모든 작품을 게시·전시합니다. 당신의 창조를 세계로.", href: "/gallery" },
      { key: "lab", title: "Lab", tagline: "동료와 공동 제작", body: "콜라보 신청부터 팀 구성, Lab 룸에서 함께 제작합니다. 결과물은 Gallery·Shop으로 전개할 수 있습니다.", href: "/lab" },
      { key: "event", title: "Events", tagline: "이벤트를 찾고 체험에 참여", body: "온·오프라인 이벤트와 콘테스트를 게시합니다. 새로운 만남과 경험이 여기 있습니다.", href: "/events" },
      { key: "shop", title: "Shop", tagline: "작품·아이템 판매", body: "오리지널 굿즈와 디지털 데이터를 판매합니다. 당신의 작품이 가치가 됩니다.", href: "/shop" },
      { key: "community", title: "Community", tagline: "동료와 연결하고 서로 돕기", body: "포럼·그룹에서 교류하며 함께 성장합니다. 창조의 고리를 넓혀 봅시다.", href: "/community" },
      { key: "work", title: "Works", tagline: "일을 의뢰·수주", body: "포트폴리오를 통해 일 의뢰를 받거나 프로젝트에 참여할 수 있습니다.", href: "/works" },
    ],
  },
  LP_QUEST_PORTFOLIO: {
    eyebrow: "Growth Loop",
    title: "도전이\n다음 일로 이어집니다.",
    flowHint: "성장의 흐름을 간단히 보여 드립니다.",
    lead: "Quest에 도전하면 활동 실적이 포트폴리오에 쌓입니다. 그 증명이 콜라보와 일의 문을 엽니다.",
    flow: "도전 → 실적 → Portfolio → Works",
    quest: {
      key: "quest",
      title: "Quest",
      tagline: "도전하며 성장하기",
      body: "공식·기업 Quest에 참여해 EXP와 실적을 쌓습니다.\n기업 과제에서는 보상·상품으로 이어지는 도전도 예정되어 있습니다.",
      items: ["공식·기업 Quest 참여", "EXP·Lv·칭호 획득", "달성 기록이 포트폴리오에 남음"],
      href: "/works",
      cta: "Quest 보기",
    },
    portfolio: {
      key: "work",
      title: "Portfolio",
      tagline: "실적을 한곳에 모으기",
      body: "Gallery·Lab·Events·Shop·Quest——\n모든 활동이 하나의 포트폴리오에 모입니다.",
      items: ["활동·실적 일원 관리", "EXP / Lv / 칭호와 이력 표시", "채용·콜라보 지원에 자동 첨부"],
      href: "/works/portfolio",
      cta: "포트폴리오 보기",
    },
  },
  LP_TRANSLATION: {
    title: "언어의 벽을 넘어\n작품이 닿습니다.",
    lead: "일본어·영어·중국어·한국어를 지원합니다. 게시와 댓글도 번역으로 연결됩니다.",
    items: [
      "전 세계 크리에이터·팬에게 도달",
      "게시·댓글·프로필 번역 표시",
      "언어를 넘어 교류와 콜라보 확장",
    ],
    imageAlt: "다국어 번역을 나타내는 네온 아이콘",
  },
  LP_PLANS_SECTION: {
    title: "Plans",
    lead: "먼저 무료로 시작하고, 필요에 따라 창작·판매·일의 범위를 넓힐 수 있습니다.",
    note: "요금·혜택은 베타 기간 중 조정될 수 있습니다.",
  },
  LP_PLANS: [
    { id: "free", name: "Free", price: "¥0", period: "영구 무료", featured: false, features: ["작품 공개(최대 3점)", "커뮤니티 참여", "기본 프로필"], cta: "무료로 시작하기", href: "/auth/signup" },
    { id: "standard", name: "Standard", price: "¥800", period: "/ 월", featured: false, features: ["작품 무제한 공개", "샵 기능(수수료 5%)", "이벤트 참여·주최", "커스텀 프로필"], cta: "이 플랜 선택", href: "/auth/signup" },
    { id: "premium", name: "Premium", price: "¥2,980", period: "/ 월", featured: true, badge: "추천", features: ["Standard 전체", "샵 수수료 3%", "일 의뢰·지원", "고급 분석·리포트", "우선 지원"], cta: "이 플랜 선택", href: "/auth/signup" },
    { id: "business", name: "Business", price: "¥10,000", period: "/ 월", featured: false, features: ["법인용 기능", "팀 관리·권한 설정", "전담 지원·SLA"], cta: "문의하기", href: "/help/contact" },
  ],
  LP_REFERRAL: {
    badge: "소개 보상\n10%\n영구 환원",
    title: "유료 플랜 사용자 소개 시, 소개한 상대가 이용하는 한 영구 10% 환원",
    body: "창작 활동을 넓히는 동안, 당신의 기여가 계속 돌아옵니다.",
    note: "※일본 외 사용자 소개는 15% 환원을 예정합니다.",
  },
  LP_REWARDS: {
    title: "기여자를 위한 특별한 감사",
    lead: "베타 기간의 지속 이용·작품 공개·소개·커뮤니티 참여 등——Eldonia–Nex 론칭에 기여해 주신 분께 감사의 증표로 특제 EN 기념 핀 배지를 증정할 예정입니다. 실적이 높은 크리에이터에게는 한정 커뮤니티 초대·선행 액세스 등 이곳에서만 얻을 수 있는 혜택을 준비하고 있습니다.",
    serialTitle: "시리얼 번호 기념 핀 배지",
    serialBody: "기념 핀 배지에는 1점마다 고유 시리얼 번호를 부여할 예정입니다. 번호 구성은 ‘연호·카테고리·일련번호’입니다.",
    serialExampleLabel: "예:",
    serialExample: "2026-CON-001",
    serialLegend: "CAT 예: CON(기여자) / EAR(얼리 서포터) / CRE(크리에이터)",
    pinBadgeAlt: "EN 기념 핀 배지",
    perks: [
      { icon: "pin", label: "EN 기념 핀 배지", desc: "(예정)" },
      { icon: "community", label: "한정 커뮤니티 초대", desc: "" },
      { icon: "early", label: "선행 액세스", desc: "" },
    ],
  },
  LP_CTA: {
    title: "지금 Eldonia–Nex를 시작하세요",
    lead: "사전 등록으로 베타 선행 안내와 한정 혜택을 받아 보세요.",
    placeholder: "이메일 주소 입력",
    submit: "사전 등록",
    submitting: "전송 중...",
    success: "사전 등록이 완료되었습니다. 베타 선행 안내를 보내 드립니다.",
    alreadyRegistered: "이 이메일은 이미 등록되어 있습니다.",
    error: "등록에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    thankTitle: "등록해 주셔서 감사합니다!",
    thankBody: "베타 선행 안내와 한정 혜택을 등록하신 이메일로 보내 드립니다. 공개까지 조금만 기다려 주세요.",
    thankDuplicateTitle: "이미 등록되어 있습니다",
    thankDuplicateBody: "이 이메일은 이미 등록되어 있습니다. 공개 준비가 되는 대로 선행 안내를 보내 드립니다.",
    thankGoHome: "홈으로",
    thankClose: "닫기",
    thankCarryOver: "시험 기간 이용 데이터(작품·EXP·실적 등)는 본격 운영 시작 후에도 그대로 이어집니다. 안심하고 체험해 보세요.",
  },
  LP_FOOTER: {
    copyright: "© 2026 Eldonia–Nex. All rights reserved.",
    social: [
      { label: "X", href: "https://x.com" },
      { label: "Discord", href: "https://discord.com" },
      { label: "YouTube", href: "https://youtube.com" },
      { label: "Email", href: "mailto:support@eldonia-nex.com" },
    ],
  },
  LP_SEO: {
    title: "Eldonia–Nex｜엘도니아에서, 당신의 이야기를 시작하세요",
    description: "작품 공개, 커뮤니티, 판매, 이벤트, 일 매칭을 연결하는 창작 플랫폼. 크리에이터와 팬이 함께 키우는 Eldonia–Nex.",
  },
};

const LP_ZH_CN: LpContent = {
  LP_NAV: [
    { href: "#world", label: "World" },
    { href: "#concept", label: "Concept" },
    { href: "#fan", label: "Fan" },
    { href: "#quest", label: "Quest" },
    { href: "#services", label: "Services" },
    { href: "#plans", label: "Plans" },
    { href: "#rewards", label: "Rewards" },
    { href: "#start", label: "Start" },
  ],
  LP_FOOTER_LINKS: footerLinks("zh-CN"),
  LP_HERO: {
    title: "在艾尔朵尼亚，\n开启你的故事。",
    lead: "发布作品、结识伙伴、让创作转化为收益。\n创作者与粉丝彼此成就的全新创作场。",
    primaryCta: "免费开始",
    secondaryCta: "了解功能",
  },
  LP_FEATURE_CARDS: [
    { key: "gallery", title: "Gallery", body: "发布作品" },
    { key: "community", title: "Community", body: "与伙伴交流" },
    { key: "shop", title: "Shop", body: "销售作品" },
  ],
  LP_WORLD: {
    title: "作品流转世界，\n故事不断延伸。",
    body: "创作者与粉丝共同培育作品，收益与经验回馈下一次创作。发布、交流、销售与挑战彼此相连，新的故事在此诞生——你的故事，也将成为这个世界的一部分。",
  },
  LP_CONCEPT: {
    eyebrow: "Concept",
    title: "你的故事，\n铭刻于世界树。",
    analogy: "世界树是作品、伙伴与收益彼此相连的隐喻。",
    lead: "发布是种子，粉丝的声援是光与雨。协作让花朵绽放，工作与收益结出果实，再孕育下一部作品——故事在此循环生长。",
    steps: [
      { no: "01", key: "born", title: "诞生", body: "发布作品，向世界播下你的“种子”。", loop: false },
      { no: "02", key: "grow", title: "成长", body: "粉丝聚集、为你应援，你的作品成为某人的“本命”。", loop: false },
      { no: "03", key: "fruit", title: "结果", body: "与伙伴协作，催生二次创作，让作品传播到更远的地方。", loop: false },
      { no: "04", key: "cycle", title: "再成种子", body: "诞生的作品孕育下一部作品——作品滋养作品。", loop: true },
    ],
    note: "请滚动浏览，跟随 1→8 的循环。",
    controls: {
      scrollHint: "滚动即可跟随 1→8 的循环",
      treeAriaLabel: "世界树创作循环动画",
    },
    cycle: [
      { no: "1", left: "50%", top: "54%", callout: "bottom", hub: true, title: "主干：Eldonia–Nex", body: "培育创作者与作品的地方。主角是你的创作——主干支撑每一次萌芽与成长。" },
      { no: "2", left: "33%", top: "41%", callout: "right", title: "枝条：创作者", body: "如同主干伸出枝条，作家、绘师、音乐人纷纷加入。他们的创作滋养 Eldonia–Nex，让创造之环不断扩展。" },
      { no: "3", left: "62%", top: "35%", callout: "left", title: "叶片：作品", body: "枝条上叶茂成荫，Gallery 中的作品逐一公开，每一份创造都为森林添彩。" },
      { no: "4", left: "58%", top: "9%", callout: "bottom", title: "光与雨：粉丝·观众", body: "浏览、点赞、评论与应援成为养分，滋养作品与创作者，让叶片更加繁茂。" },
      { no: "5", left: "68%", top: "56%", callout: "left", title: "花：绽放", body: "通过 Lab 共同制作、Community 与 Events，作品绽放光彩，外传与二次创作随之萌芽。" },
      { no: "6", left: "76%", top: "73%", callout: "left", title: "果：结实", body: "通过 Shop、Events、Works 获得工作机会。充实的作品集带来更多连接。在粉丝支持下，创作结出果实，收益与认可回馈创作者。" },
      { no: "7", left: "49%", top: "80%", callout: "top", title: "种：走向下一部作品", body: "果实化为种子。获得的收益、实绩与经验成为下一次制作的食粮，新作品再次从主干萌芽。" },
      { no: "8", left: "18%", top: "58%", callout: "right", title: "Quest 与大循环", body: "挑战 Quest，在 Gallery、Lab、Events 等活动中积累实绩，充实 Works 作品集。作品集越充实，越容易连接到工作机会。所得经验与伙伴将引向下一部大作或外传，世界树愈发茁壮。" },
    ],
  },
  LP_FAN_NOTIFICATION: {
    eyebrow: "Fan",
    title: "成为 Fan，\n活动动态触手可及。",
    lead: "你支持的创作者的新发布、销售、活动等，可按需接收。应援之光，直达你手中。",
    items: [
      "Gallery 新作发布",
      "Shop 销售·上新",
      "Events·Live 公告",
      "Lab 公开·Works / 协作",
    ],
    note: "接收方式可选「仅重要」「全部」「每周汇总」「关闭」等。",
  },
  LP_SERVICES: {
    title: "环绕创作的六大空间",
    subtitle: "发布·交流·销售·挑战——创作所需的空间，在此一脉相连。",
    more: "了解更多",
    items: [
      { key: "gallery", title: "Gallery", tagline: "发布作品，触达世界", body: "插画、漫画、摄影、3DCG 等，各类作品均可发布与展示。让你的创造走向世界。", href: "/gallery" },
      { key: "lab", title: "Lab", tagline: "与伙伴共同制作", body: "从协作申请到组队，在 Lab 房间一起创作。成果可拓展至 Gallery 与 Shop。", href: "/lab" },
      { key: "event", title: "Events", tagline: "发现活动，参与体验", body: "刊登线上·线下活动与竞赛。新的相遇与体验，尽在于此。", href: "/events" },
      { key: "shop", title: "Shop", tagline: "销售作品与商品", body: "销售原创周边与数字内容。让你的作品产生价值。", href: "/shop" },
      { key: "community", title: "Community", tagline: "结识伙伴，彼此支持", body: "在论坛与群组中交流，共同成长。一起扩大创造之环。", href: "/community" },
      { key: "work", title: "Works", tagline: "委托与接单", body: "通过作品集接收工作委托，或参与各类项目。", href: "/works" },
    ],
  },
  LP_QUEST_PORTFOLIO: {
    eyebrow: "Growth Loop",
    title: "每一次挑战，\n通向下一份工作。",
    flowHint: "用简洁的方式呈现成长路径。",
    lead: "在 Quest 中挑战自我，活动实绩汇入作品集。这份证明，将打开协作与工作的大门。",
    flow: "挑战 → 实绩 → Portfolio → Works",
    quest: {
      key: "quest",
      title: "Quest",
      tagline: "挑战自我，不断成长",
      body: "参与官方与企业 Quest，积累 EXP 与实绩。\n企业任务中，也计划设有连接报酬与商品的挑战。",
      items: ["参与官方·企业 Quest", "获得 EXP·等级·称号", "成就记录留存于作品集"],
      href: "/works",
      cta: "查看 Quest",
    },
    portfolio: {
      key: "work",
      title: "Portfolio",
      tagline: "将实绩汇于一处",
      body: "Gallery·Lab·Events·Shop·Quest——\n所有活动汇聚于同一作品集。",
      items: ["统一管理活动与实绩", "展示 EXP / 等级 / 称号与履历", "求职·协作申请自动附带"],
      href: "/works/portfolio",
      cta: "查看作品集",
    },
  },
  LP_TRANSLATION: {
    title: "跨越语言之墙，\n作品依然抵达。",
    lead: "支持日语·英语·中文·韩语。发布与评论也可通过翻译彼此连接。",
    items: [
      "触达全球创作者与粉丝",
      "翻译显示发布·评论·个人资料",
      "跨越语言，拓展交流与协作",
    ],
    imageAlt: "象征多语言翻译的霓虹图标",
  },
  LP_PLANS_SECTION: {
    title: "Plans",
    lead: "先从免费开始，再按需扩展创作、销售与工作的范围。",
    note: "价格与权益在测试期间可能调整。",
  },
  LP_PLANS: [
    { id: "free", name: "Free", price: "¥0", period: "永久免费", featured: false, features: ["发布作品（最多 3 件）", "参与社区", "基础个人资料"], cta: "免费开始", href: "/auth/signup" },
    { id: "standard", name: "Standard", price: "¥800", period: "/ 月", featured: false, features: ["无限发布作品", "商店功能（手续费 5%）", "参与·主办活动", "自定义个人资料"], cta: "选择此方案", href: "/auth/signup" },
    { id: "premium", name: "Premium", price: "¥2,980", period: "/ 月", featured: true, badge: "推荐", features: ["Standard 全部权益", "商店手续费 3%", "工作委托·应征", "高级分析与报告", "优先支持"], cta: "选择此方案", href: "/auth/signup" },
    { id: "business", name: "Business", price: "¥10,000", period: "/ 月", featured: false, features: ["企业功能", "团队管理·权限设置", "专属支持·SLA"], cta: "联系我们", href: "/help/contact" },
  ],
  LP_REFERRAL: {
    badge: "推荐奖励\n10%\n永久返还",
    title: "推荐付费方案用户，只要对方持续使用，即永久返还 10%",
    body: "在拓展创作生态的同时，你的贡献也将持续回馈于你。",
    note: "※日本以外用户的推荐，计划为 15% 返还。",
  },
  LP_REWARDS: {
    title: "献给贡献者的特别感谢",
    lead: "测试期间的持续使用、作品发布、推荐与社区参与等——为 Eldonia–Nex 的起步做出贡献的各位，我们计划赠送特制 EN 纪念徽章，以表谢意。实绩突出的创作者还可获得限定社区邀请、抢先体验等独家权益。",
    serialTitle: "带序列号的纪念徽章",
    serialBody: "纪念徽章计划为每件作品赋予唯一序列号。编号格式为「年份·类别·流水号」。",
    serialExampleLabel: "例：",
    serialExample: "2026-CON-001",
    serialLegend: "CAT 示例：CON（贡献者）/ EAR（早期支持）/ CRE（创作者）",
    pinBadgeAlt: "EN 纪念徽章",
    perks: [
      { icon: "pin", label: "EN 纪念徽章", desc: "（计划中）" },
      { icon: "community", label: "限定社区邀请", desc: "" },
      { icon: "early", label: "抢先体验", desc: "" },
    ],
  },
  LP_CTA: {
    title: "立即开启 Eldonia–Nex",
    lead: "预先注册，获取测试版抢先通知与限定权益。",
    placeholder: "输入邮箱地址",
    submit: "预先注册",
    submitting: "提交中...",
    success: "已受理预先注册。我们将发送测试抢先通知。",
    alreadyRegistered: "该邮箱已注册。",
    error: "注册失败，请稍后重试。",
    thankTitle: "感谢注册！",
    thankBody: "测试版抢先通知与限定权益将发送至您注册的邮箱。正式发布前，请稍候。",
    thankDuplicateTitle: "您已注册",
    thankDuplicateBody: "该邮箱已注册。准备就绪后，我们将发送抢先通知。",
    thankGoHome: "返回首页",
    thankClose: "关闭",
    thankCarryOver: "试用期间的数据（作品·EXP·实绩等）将在正式运营后继续保留。请放心体验。",
  },
  LP_FOOTER: {
    copyright: "© 2026 Eldonia–Nex. All rights reserved.",
    social: [
      { label: "X", href: "https://x.com" },
      { label: "Discord", href: "https://discord.com" },
      { label: "YouTube", href: "https://youtube.com" },
      { label: "Email", href: "mailto:support@eldonia-nex.com" },
    ],
  },
  LP_SEO: {
    title: "Eldonia–Nex｜在艾尔朵尼亚，开启你的故事",
    description: "连接作品发布、社区、销售、活动与工作匹配的创作平台。创作者与粉丝彼此成就的 Eldonia–Nex。",
  },
};

export const LP_CONTENT: Record<UiLocale, LpContent> = {
  ja: LP_JA,
  en: LP_EN,
  ko: LP_KO,
  "zh-CN": LP_ZH_CN,
};

export function getLpContent(locale: UiLocale): LpContent {
  return LP_CONTENT[locale] ?? LP_JA;
}
