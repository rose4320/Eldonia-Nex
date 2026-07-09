export const LP_NAV = [
  { href: "#world", label: "World" },
  { href: "#concept", label: "Concept" },
  { href: "#quest", label: "Quest" },
  { href: "#services", label: "Services" },
  { href: "#plans", label: "Plans" },
  { href: "#rewards", label: "Rewards" },
  { href: "#start", label: "Start" },
] as const;

import { LP_FOOTER_NAV_LINKS } from "@/lib/layout/footer-links";

export const LP_FOOTER_LINKS = LP_FOOTER_NAV_LINKS.map(({ href, label }) => ({
  href,
  label: label.ja,
}));

export const LP_HERO = {
  title: "エルドニアで、\nあなたの物語をはじめよう。",
  lead: "架空世界「エルドニア」を舞台に、作品・仲間・収益が巡る。\nクリエイターとファンが育て合う、新しい創作の場。",
  primaryCta: "無料で始める",
  secondaryCta: "機能を見る",
};

export const LP_FEATURE_CARDS = [
  {
    key: "gallery",
    title: "Gallery",
    body: "作品を世界へ発信",
  },
  {
    key: "global",
    title: "Global",
    body: "多言語でつながる",
  },
  {
    key: "market",
    title: "Market",
    body: "創作が価値になる",
  },
] as const;

export const LP_WORLD = {
  title: "物語は、\nここから育つ。",
  body: "夜空の下、世界樹がそびえるエルドニア。クリエイターとファンが作品を育て合い、収益と経験が次の創作へ還る。あなたの物語が、世界の一部になる場所です。",
};

export const LP_CONCEPT = {
  eyebrow: "Concept",
  title: "あなたの物語は、\n世界樹に刻まれる。",
  lead: "投稿が種となり、ファンの応援が光と雨。コラボで花が咲き、仕事と収益が実となり、また次の作品へ——物語は、ここで循環していきます。",
  steps: [
    {
      no: "01",
      key: "born",
      title: "生まれる",
      body: "作品を投稿する。世界に、あなたの“種”をまく。",
      loop: false,
    },
    {
      no: "02",
      key: "grow",
      title: "育つ",
      body: "ファンがつき、応援され、あなたの作品が“推し”になっていく。",
      loop: false,
    },
    {
      no: "03",
      key: "fruit",
      title: "実る",
      body: "仲間とコラボし、二次創作が生まれ、作品が世界へ広がる。",
      loop: false,
    },
    {
      no: "04",
      key: "cycle",
      title: "また種に",
      body: "生まれた作品が、次の作品を生む。—— 作品が、作品を育てていく。",
      loop: true,
    },
  ],
  note: "スクロールで、1→8 の循環をたどってください。",
  controls: {
    scrollHint: "スクロールで 1→8 の循環をたどれます",
  },
  // 世界樹の生態循環。left/top = 樹上のノード位置（%）、callout = 説明カードの展開方向。
  cycle: [
    {
      no: "1",
      left: "50%",
      top: "54%",
      callout: "bottom",
      hub: true,
      title: "幹：Eldonia–Nex",
      body: "クリエイターと作品を育てる場所。主役はあなたの創作——幹は、その芽吹きと成長を支える土台です。",
    },
    {
      no: "2",
      left: "33%",
      top: "41%",
      callout: "right",
      title: "枝：クリエイター",
      body: "幹から枝が伸びるように、作家・絵師・音楽家が参加する。その創作が Eldonia–Nex を育てる栄養となり、創造の輪が広がる。",
    },
    {
      no: "3",
      left: "62%",
      top: "35%",
      callout: "left",
      title: "葉：作品",
      body: "枝に葉が茂るように、Gallery で作品が公開され、一つひとつの創造が森を彩る。",
    },
    {
      no: "4",
      left: "58%",
      top: "9%",
      callout: "bottom",
      title: "光と雨：ファン・観覧者",
      body: "閲覧・いいね・コメント・応援が栄養となり、作品とクリエイターを育て、葉を大きくする。",
    },
    {
      no: "5",
      left: "68%",
      top: "56%",
      callout: "left",
      title: "花：花開く",
      body: "Lab の共同制作や Community、Events で作品が花開き、スピンオフや二次創作が芽吹く。",
    },
    {
      no: "6",
      left: "76%",
      top: "73%",
      callout: "left",
      title: "実：実る",
      body: "Shop・Events・Works で仕事を獲得する。充実したポートフォリオがあれば、よりつながりやすい。芽吹いたスピンオフも含め、ファンの支援とともに創作が実を結び、収益と評価がクリエイターへ還る。",
    },
    {
      no: "7",
      left: "49%",
      top: "80%",
      callout: "top",
      title: "種：次の作品へ",
      body: "実から種ができる。得た収益や実績、経験が次の制作の糧となり、新しい作品がまた幹から芽吹く。",
    },
    {
      no: "8",
      left: "18%",
      top: "58%",
      callout: "right",
      title: "Quest と大循環",
      body: "Quest に挑戦し、Gallery や Lab、Events などの活動とともに実績が蓄積され、Works のポートフォリオが充実する。ポートフォリオが充実すれば、仕事にもつながりやすい。得た経験と仲間が次の大作やスピンオフへつながり、世界樹はさらに育つ。",
    },
  ],
} as const;

export const LP_SERVICES = {
  title: "6つの機能",
  subtitle: "Eldonia–Nex の世界で、あなたの創造はすべてつながる。",
  more: "もっと見る",
  items: [
    {
      key: "gallery",
      title: "Gallery",
      tagline: "作品を公開し、世界に届ける",
      body: "イラスト・漫画・写真・3DCGなど、あらゆる作品を投稿・展示。あなたの創造を世界へ。",
      href: "/gallery",
    },
    {
      key: "lab",
      title: "Lab",
      tagline: "技術と知識を深める",
      body: "チュートリアルやTips、メイキングを共有し、創造のスキルを磨くことができます。",
      href: "/lab",
    },
    {
      key: "event",
      title: "Events",
      tagline: "イベントを見つけ、体験に参加する",
      body: "オンライン・オフラインのイベントやコンテストを掲載。新しい出会いや体験がここに。",
      href: "/events",
    },
    {
      key: "shop",
      title: "Shop",
      tagline: "作品やアイテムを販売する",
      body: "オリジナルグッズやデジタルデータを販売。あなたの作品が価値になる。",
      href: "/shop",
    },
    {
      key: "community",
      title: "Community",
      tagline: "仲間とつながり、支え合う",
      body: "フォーラムやグループで交流し、共に成長する。創造の輪を広げていこう。",
      href: "/community",
    },
    {
      key: "work",
      title: "Works",
      tagline: "仕事を依頼・受注する",
      body: "ポートフォリオを通じて仕事の依頼を受けたり、プロジェクトに参加できる。",
      href: "/works",
    },
  ],
} as const;

export const LP_QUEST_PORTFOLIO = {
  eyebrow: "Growth Loop",
  title: "Quest で成長し、\nポートフォリオで証明する。",
  lead: "Quest だけでなく、Gallery・Lab・Events・Shop など Eldonia–Nex でのあらゆる活動が実績として蓄積され、ポートフォリオが次の仕事やコラボへの扉を開きます。",
  flow: "創作・挑戦 → 実績蓄積 → Portfolio → Works",
  quest: {
    key: "quest",
    title: "Quest",
    tagline: "挑戦して EXP を稼ぐ",
    body: "管理者が公開する Quest に参加し、創作の実績と EXP を積み上げます。",
    items: [
      "公式・企業案件の Quest に参加",
      "EXP・Lv・称号を獲得",
      "達成実績がポートフォリオに加わる",
    ],
    href: "/works",
    cta: "Quest を見る",
  },
  portfolio: {
    key: "work",
    title: "Portfolio",
    tagline: "すべての実績をひとつに",
    body: "Gallery の投稿、Lab の共同制作、Events、Shop、Quest——プラットフォーム上の活動がすべてポートフォリオに蓄積されます。WORKS 応募時には自動で添付できます。",
    items: [
      "全モジュールの活動・実績を一元管理",
      "EXP / Lv / 称号と作品・達成履歴を表示",
      "公開設定で見せ方をコントロール",
      "求人・コラボ応募に自動添付",
    ],
    href: "/works/portfolio",
    cta: "ポートフォリオを整える",
  },
} as const;

export const LP_TRANSLATION = {
  title: "多言語対応・リアルタイム翻訳",
  items: [
    "世界中のクリエイターやファンにリーチ",
    "投稿・コメント・プロフィールを自動翻訳",
    "言語の壁をなくし、円滑なコミュニケーションを実現",
  ],
};

export const LP_PLANS = [
  {
    id: "free",
    name: "Free",
    price: "¥0",
    period: "ずっと無料",
    featured: false,
    features: ["作品の公開（3点まで）", "コミュニティ参加", "基本プロフィール"],
    cta: "無料で始める",
    href: "/auth/signup",
  },
  {
    id: "standard",
    name: "Standard",
    price: "¥800",
    period: "/ 月",
    featured: false,
    features: [
      "作品の無制限公開",
      "ショップ機能（手数料5%）",
      "イベント参加・主催",
      "カスタムプロフィール",
    ],
    cta: "このプランを選ぶ",
    href: "/auth/signup",
  },
  {
    id: "premium",
    name: "Premium",
    price: "¥2,980",
    period: "/ 月",
    featured: true,
    badge: "おすすめ",
    features: [
      "ショップ手数料 3%",
      "仕事の依頼・応募",
      "高度な分析・レポート",
      "優先サポート",
    ],
    cta: "このプランを選ぶ",
    href: "/auth/signup",
  },
  {
    id: "business",
    name: "Business",
    price: "¥10,000",
    period: "/ 月",
    featured: false,
    features: ["法人向け機能", "チーム管理・権限設定", "専用サポート・SLA"],
    cta: "お問い合わせ",
    href: "/help/contact",
  },
] as const;

export const LP_REFERRAL = {
  badge: "紹介報酬\n10%\n永久還元",
  title: "有料プランのユーザー紹介で、紹介した相手の利用が続く限り永久に10%還元",
  body: "創作活動を広げながら、あなたの貢献がずっと還ってきます。",
  note: "※日本以外のユーザー紹介は15%還元を予定。",
};

export const LP_REWARDS = {
  title: "貢献者への特別な感謝",
  lead: "ベータ期間中の継続利用や作品公開、紹介、コミュニティ参加など——Eldonia–Nexの立ち上げに貢献いただいた方へ、感謝の証として特製EN記念ピンバッジを贈呈予定。実績の高いクリエイターには、限定コミュニティへの招待や先行アクセスなど、ここでしか得られない特典をご用意しています。",
  serialTitle: "シリアル番号付き記念ピンバッジ",
  serialBody:
    "記念ピンバッジには、1点ごとに固有のシリアル番号を付与予定。番号構成は「年号・カテゴリー・通し番号」です。",
  serialExample: "2026-CON-001",
  serialLegend: "CAT例：CON（貢献者） / EAR（早期支援） / CRE（クリエイター）",
  perks: [
    { icon: "pin", label: "EN記念ピンバッジ", desc: "（予定）" },
    { icon: "community", label: "限定コミュニティ招待", desc: "" },
    { icon: "early", label: "先行アクセス", desc: "" },
  ],
};

export const LP_CTA = {
  title: "今すぐ Eldonia–Nex をはじめよう",
  lead: "事前登録で、ベータ版の先行案内と限定特典をお届けします。",
  placeholder: "メールアドレスを入力",
  submit: "事前登録する",
  submitting: "送信中...",
  success: "事前登録を受け付けました。ベータ先行案内をお送りします。",
  alreadyRegistered: "このメールアドレスは既に登録済みです。",
  error: "登録に失敗しました。時間をおいて再度お試しください。",
  thankTitle: "ご登録ありがとうございます！",
  thankBody:
    "ベータ版の先行案内と限定特典を、ご登録のメールアドレスにお届けします。公開までもうしばらくお待ちください。",
  thankDuplicateTitle: "すでにご登録済みです",
  thankDuplicateBody:
    "このメールアドレスは既に登録されています。公開の準備が整い次第、先行案内をお送りします。",
  thankGoHome: "ホームへ",
  thankClose: "閉じる",
  thankCarryOver:
    "試験期間中のご利用データ（作品・EXP・実績など）は、本格運用の開始後もそのまま引き継がれます。安心してお試しください。",
};

export const LP_FOOTER = {
  copyright: "© 2026 Eldonia–Nex. All rights reserved.",
  social: [
    { label: "X", href: "https://x.com" },
    { label: "Discord", href: "https://discord.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "Email", href: "mailto:support@eldonia-nex.com" },
  ],
};

export const LP_SEO = {
  title: "Eldonia–Nex｜創造者たちが集い、次の世界をひらく",
  description:
    "作品公開、コミュニティ、販売、イベント、仕事マッチングをひとつにつなぐ、多言語対応のクリエータープラットフォーム。",
};
