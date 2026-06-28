export const LP_NAV = [
  { href: "#services", label: "Services" },
  { href: "#world", label: "World" },
  { href: "#plans", label: "Plans" },
  { href: "#rewards", label: "Rewards" },
  { href: "#start", label: "Start" },
] as const;

export const LP_HERO = {
  title: "創造者たちが集い、次の世界をひらく。",
  lead: "作品公開、コミュニティ、販売、イベント、仕事マッチングをひとつにつなぐ、多言語対応のクリエータープラットフォーム。",
  primaryCta: "無料で始める",
  secondaryCta: "機能を見る",
};

export const LP_FEATURE_CARDS = [
  {
    key: "gallery",
    title: "Gallery",
    body: "作品を世界へ公開し、ポートフォリオを育てる",
  },
  {
    key: "global",
    title: "Global",
    body: "多言語対応で国境を越えた創作交流",
  },
  {
    key: "market",
    title: "Market",
    body: "販売・イベント・仕事をひとつの循環へ",
  },
] as const;

export const LP_WORLD = {
  title: "エルドニアの世界へようこそ",
  body: "月夜に輝く魔法都市エルドニア。クリエイターが作品を公開し、ファンとつながり、挑戦と収益を積み重ねていく創作経済圏。Gallery から Community、Shop、Event、Work、Lab まで——あなたの創作活動がひとつの Nexus につながります。",
};

export const LP_SERVICES = [
  {
    key: "gallery",
    title: "Gallery",
    body: "イラスト・動画・音楽・3D など、作品をギャラリー形式で公開。",
  },
  {
    key: "community",
    title: "Community",
    body: "掲示板・スレッドでファンや仲間と交流し、創作を深める。",
  },
  {
    key: "shop",
    title: "Shop",
    body: "デジタル商品やグッズを販売し、収益化の基盤を築く。",
  },
  {
    key: "event",
    title: "Event",
    body: "ライブ配信・ワークショップ・展示など、オンライン/オフラインイベント。",
  },
  {
    key: "work",
    title: "Work",
    body: "Quest・求人・協業で挑戦し、実績と EXP をポートフォリオに記録。",
  },
  {
    key: "lab",
    title: "Lab",
    body: "共同制作・実験的な創作プロジェクトを試す協働スペース。",
  },
] as const;

export const LP_TRANSLATION = {
  title: "多言語対応・リアルタイム翻訳",
  items: [
    "投稿・コメント・プロフィールを複数言語で表示",
    "リアルタイム翻訳で海外ファンともスムーズに交流",
    "国・地域に応じた UI と通知メールの言語対応",
  ],
};

export const LP_PLANS = [
  {
    id: "free",
    name: "Free",
    price: "¥0",
    period: "",
    featured: false,
    features: ["作品投稿 3件/月", "基本プロフィール", "コミュニティ参加"],
    cta: "無料で始める",
  },
  {
    id: "standard",
    name: "Standard",
    price: "¥800",
    period: "/ 月",
    featured: false,
    features: ["作品投稿 20件/月", "50MB までのファイル", "Live 配信の基本機能"],
    cta: "Standard を選ぶ",
  },
  {
    id: "premium",
    name: "Premium",
    price: "¥2,980",
    period: "/ 月",
    featured: true,
    badge: "おすすめ",
    features: ["作品投稿 無制限", "500MB までのファイル", "優先サポート", "分析ダッシュボード"],
    cta: "Premium を選ぶ",
  },
  {
    id: "business",
    name: "Business",
    price: "¥10,000",
    period: "/ 月",
    featured: false,
    features: ["チーム管理", "API 連携", "専任サポート", "カスタムブランディング"],
    cta: "Business を選ぶ",
  },
] as const;

export const LP_REFERRAL = {
  badge: "紹介報酬\n10%\n永久還元",
  title: "有料プランのユーザー紹介で、紹介した相手の利用が続く限り永久に10%還元",
  body: "あなたが紹介したクリエイターの有料プラン利用が続く限り、利用料の 10% が還元されます。",
  note: "日本以外のユーザー紹介は15%還元予定",
};

export const LP_REWARDS = {
  title: "貢献者・投資家への特別特典",
  lead: "エルドニア・ネクスの成長に貢献いただいた方、および投資家の皆様への感謝を込めた特別プログラムです。",
  pinTitle: "EN記念ピンバッジ",
  pinBody: "シリアル番号付き記念ピンバッジを贈呈。物理バッジとして、エルドニアの一員である証をお持ちいただけます。",
  serialExample: "2026-INV-001",
  serialLegend: "INV = 投資家 / CON = 貢献者",
  perks: [
    { icon: "pin", label: "EN Pin Badge", desc: "シリアル番号付き記念ピンバッジ" },
    { icon: "community", label: "Private Community", desc: "限定コミュニティへのアクセス" },
    { icon: "early", label: "Early Access", desc: "新機能の先行体験" },
  ],
};

export const LP_CTA = {
  title: "今すぐ Eldonia-Nex をはじめよう",
  lead: "事前登録で、ベータ版の先行案内と限定特典をお届けします。",
  placeholder: "メールアドレス",
  submit: "事前登録する",
};

export const LP_FOOTER = {
  copyright: "© 2025 Eldonia–Nex. All rights reserved.",
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
