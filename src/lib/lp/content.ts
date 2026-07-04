export const LP_NAV = [
  { href: "#services", label: "Services" },
  { href: "#world", label: "World" },
  { href: "#plans", label: "Plans" },
  { href: "#rewards", label: "Rewards" },
  { href: "#start", label: "Start" },
] as const;

export const LP_FOOTER_LINKS = [
  { href: "#services", label: "サービス一覧" },
  { href: "#world", label: "ワールドガイド" },
  { href: "#plans", label: "料金プラン" },
  { href: "#start", label: "スタートガイド" },
  { href: "/help", label: "運営会社" },
  { href: "/help/contact", label: "お問い合わせ" },
  { href: "/terms", label: "利用規約" },
  { href: "/privacy", label: "プライバシーポリシー" },
] as const;

export const LP_HERO = {
  title: "創造者たちが集い、\n次の世界をひらく。",
  lead: "作品公開、コミュニティ、販売、イベント、\n仕事マッチングをひとつにつなぐ、\n多言語対応のクリエータープラットフォーム。",
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
  title: "エルドニアの世界へようこそ",
  body: "Eldonia–Nexは、創造と交流が交差する架空世界「エルドニア」を舞台にしたクリエータープラットフォームです。ここでは、あなたの創作が物語となり、仲間と出会い、世界とつながり、そして未来を形づくります。",
};

export const LP_SERVICES = {
  subtitle: "すべての創造活動を、ひとつの場所で。",
  items: [
    {
      key: "gallery",
      title: "Gallery",
      body: "作品を美しく公開・展示。世界中のファンに届けよう。",
    },
    {
      key: "community",
      title: "Community",
      body: "興味やジャンルでつながる。交流し、共に成長しよう。",
    },
    {
      key: "shop",
      title: "Shop",
      body: "デジタル・フィジカル作品を販売。安全で簡単な決済に対応。",
    },
    {
      key: "event",
      title: "Event",
      body: "イベントや展示会を開催・参加。創作の輪を広げよう。",
    },
    {
      key: "work",
      title: "Work",
      body: "仕事の依頼・募集ができる。あなたの才能を仕事に。",
    },
    {
      key: "lab",
      title: "Lab",
      body: "新しい技術や表現を研究・実験。未来の創作体験をつくる。",
    },
  ],
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
  title: "貢献者・投資家への特別特典",
  lead: "Eldonia–Nexの未来を共に創る貢献者・投資家の皆さまに、感謝の証として特製EN記念ピンバッジを贈呈予定。限定コミュニティへの招待や、特別な優待・先行アクセスなど、ここでしか得られない特典をご用意しています。",
  serialTitle: "シリアル番号付き記念ピンバッジ",
  serialBody:
    "記念ピンバッジには、1点ごとに固有のシリアル番号を付与予定。番号構成は「年号・カテゴリー・通し番号」です。",
  serialExample: "2026-INV-001",
  serialLegend: "CAT例：INV（投資家） / CON（貢献者）",
  perks: [
    { icon: "pin", label: "EN記念ピンバッジ", desc: "（予定）" },
    { icon: "community", label: "限定コミュニティ招待", desc: "" },
    { icon: "early", label: "特別な優待・先行アクセス", desc: "" },
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
