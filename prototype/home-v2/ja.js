/** Eldonia-Nex Home v2 — 日本語コピー（Next.js 移行時は i18n に移植） */
window.ELDONIA_JA = {
  meta: {
    title: "ELDONIA NEX — A Fantasy Nexus for Creators",
    lang: "ja",
  },
  header: {
    nav: [
      { label: "GALLERY", href: "#modules" },
      { label: "LAB", href: "#modules" },
      { label: "EVENTS", href: "#modules" },
      { label: "SHOP", href: "#modules" },
      { label: "COMMUNITY", href: "#modules" },
      { label: "WORKS", href: "#modules" },
    ],
    searchPlaceholder: "Search the Nexus…",
    searchSubmit: "Search",
    languages: [
      { value: "ja", label: "日本語" },
      { value: "en", label: "English" },
      { value: "ko", label: "한국어" },
      { value: "zh-CN", label: "中文" },
    ],
    login: "ログイン",
    signup: "新規登録",
  },
  hero: {
    title: "Quest. Create. Earn.",
    subtitle: "冒険が、創造を動かし、未来をつくる。",
    lead:
      "Eldonia-Nex は、Quest・作品・コマース・コミュニティがひとつの循環になる創作経済圏です。経験値と信用が可視化され、挑戦が収益へつながる Nexus へ。",
    ctaPrimary: "無料で始める",
    ctaSecondary: "Questを探す",
    stats: [
      { value: "12,458", label: "Creators" },
      { value: "3,215", label: "Quests in progress" },
      { value: "¥38,932,100", label: "Creator Returns" },
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
  investor: {
    eyebrow: "Investors & Supporters",
    title: "初期支援者・共創パートナーを募集しています",
    lead:
      "Eldonia-Nex は広告依存ではなく、クリエイターの成功に連動する成長モデルです。初期支援にはシリアル番号入りピンバッジを贈呈します。",
    perks: [
      { key: "participate", title: "初期参加", body: "ローンチ前から Nexus の設計に関与" },
      { key: "challenge", title: "限定コミュニティ", body: "支援者向けディスカッションへ招待" },
      { key: "rewards", title: "特別還元", body: "将来の還元・特典設計を優先案内" },
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
  footer: {
    techTitle: "技術スタック",
    techStack: ["Next.js 16", "Supabase", "PostgreSQL", "Stripe", "Django Admin"],
    helpTitle: "ヘルプ・サイトマップ",
    helpLinks: [
      { label: "ヘルプセンター", href: "#" },
      { label: "よくある質問", href: "#" },
      { label: "利用ガイド", href: "#" },
      { label: "お問い合わせ", href: "#contact" },
      { label: "マイチケット", href: "#" },
    ],
    sitemapTitle: "サイトマップ",
    sitemap: [
      { label: "GALLERY", href: "#modules" },
      { label: "LAB", href: "#modules" },
      { label: "EVENTS", href: "#modules" },
      { label: "SHOP", href: "#modules" },
      { label: "COMMUNITY", href: "#modules" },
      { label: "WORKS", href: "#modules" },
    ],
    partnersTitle: "協力・スポンサー",
    partners: [
      { name: "Nexus Cloud", role: "インフラ協力" },
      { name: "Creator Guild", role: "コミュニティ協力" },
      { name: "Gold Sponsor Slot", role: "スポンサー枠" },
    ],
    copyright: "All rights reserved.",
    note: "Prototype v2 — HTML/CSS/JA のみ（Next.js 移行前確認用）",
  },
};

const ICONS = {
  modules: {
    quest: "assets/icons/modules/icon-quest.png",
    gallery: "assets/icons/modules/icon-gallery.png",
    shop: "assets/icons/modules/icon-shop.png",
    events: "assets/icons/modules/icon-events.png",
    community: "assets/icons/modules/icon-community.png",
    works: "assets/icons/modules/icon-works.png",
  },
  questFlow: {
    participate: "assets/icons/quest-flow/icon-participate.png",
    challenge: "assets/icons/quest-flow/icon-challenge.png",
    evaluated: "assets/icons/quest-flow/icon-evaluated.png",
    rewards: "assets/icons/quest-flow/icon-rewards.png",
  },
  metrics: {
    exp: "assets/icons/metrics/icon-exp.png",
    credit: "assets/icons/metrics/icon-credit.png",
    revenue: "assets/icons/metrics/icon-revenue.png",
  },
};

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

function applyCopy() {
  const c = window.ELDONIA_JA;
  document.documentElement.lang = c.meta.lang;
  document.title = c.meta.title;

  const nav = document.getElementById("site-nav");
  nav.innerHTML = "";
  c.header.nav.forEach((item) => {
    const a = el("a", "site-nav__link", item.label);
    a.href = item.href;
    nav.appendChild(a);
  });
  document.getElementById("btn-login").textContent = c.header.login;
  document.getElementById("btn-signup").textContent = c.header.signup;

  const searchInput = document.getElementById("header-search-input");
  searchInput.placeholder = c.header.searchPlaceholder;
  searchInput.setAttribute("aria-label", c.header.searchPlaceholder);
  document.getElementById("header-search-submit").textContent = c.header.searchSubmit;

  const langSelect = document.getElementById("header-lang");
  langSelect.innerHTML = "";
  c.header.languages.forEach((lang) => {
    const opt = document.createElement("option");
    opt.value = lang.value;
    opt.textContent = lang.label;
    if (lang.value === c.meta.lang) opt.selected = true;
    langSelect.appendChild(opt);
  });

  document.getElementById("hero-title").textContent = c.hero.title;
  document.getElementById("hero-subtitle").textContent = c.hero.subtitle;
  document.getElementById("hero-lead").textContent = c.hero.lead;
  document.getElementById("hero-cta-primary").textContent = c.hero.ctaPrimary;
  document.getElementById("hero-cta-secondary").textContent = c.hero.ctaSecondary;

  const stats = document.getElementById("hero-stats");
  stats.innerHTML = "";
  c.hero.stats.forEach((s) => {
    stats.appendChild(
      el("div", "hero-stat", `<strong>${s.value}</strong><span>${s.label}</span>`),
    );
  });

  document.getElementById("quest-guide-eyebrow").textContent = c.questGuide.eyebrow;
  const steps = document.getElementById("quest-steps");
  steps.innerHTML = "";
  c.questGuide.steps.forEach((step) => {
    steps.appendChild(
      el(
        "li",
        "quest-step",
        `<img src="${ICONS.questFlow[step.key]}" alt="" width="40" height="40" /><div><strong>${step.title}</strong><p>${step.body}</p></div>`,
      ),
    );
  });

  const metrics = document.getElementById("growth-metrics");
  metrics.innerHTML = "";
  c.questGuide.metrics.forEach((m) => {
    metrics.appendChild(
      el(
        "li",
        "growth-metric",
        `<img src="${ICONS.metrics[m.key]}" alt="" width="36" height="36" /><div><strong>${m.label}</strong><p>${m.body}</p></div>`,
      ),
    );
  });

  document.getElementById("modules-eyebrow").textContent = c.modules.eyebrow;
  document.getElementById("modules-title").textContent = c.modules.title;
  const grid = document.getElementById("module-grid");
  grid.innerHTML = "";
  c.modules.items.forEach((mod) => {
    grid.appendChild(
      el(
        "article",
        "module-card",
        `<img class="module-card__icon" src="${ICONS.modules[mod.key]}" alt="" width="48" height="48" /><h3>${mod.name}</h3><p>${mod.body}</p><a href="#">${mod.link}</a>`,
      ),
    );
  });

  document.getElementById("investor-eyebrow").textContent = c.investor.eyebrow;
  document.getElementById("investor-title").textContent = c.investor.title;
  document.getElementById("investor-lead").textContent = c.investor.lead;
  const perks = document.getElementById("investor-perks");
  perks.innerHTML = "";
  c.investor.perks.forEach((p) => {
    perks.appendChild(
      el("li", "investor-perk", `<strong>${p.title}</strong><p>${p.body}</p>`),
    );
  });
  document.getElementById("serial-title").textContent = c.investor.serialTitle;
  document.getElementById("serial-format").textContent = c.investor.serialFormat;
  const serialParts = document.getElementById("serial-parts");
  serialParts.innerHTML = "";
  c.investor.serialParts.forEach((part) => {
    serialParts.appendChild(
      el("li", "serial-part", `<code>${part.part}</code><span>${part.label}</span>`),
    );
  });
  document.getElementById("investor-cta").textContent = c.investor.cta;

  document.getElementById("categories-title").textContent = c.categories.title;
  const cats = document.getElementById("category-row");
  cats.innerHTML = "";
  c.categories.items.forEach((cat) => {
    cats.appendChild(
      el("div", "category-box", `<span>${cat.num}</span><strong>${cat.label}</strong>`),
    );
  });
  document.getElementById("categories-cta-lead").textContent = c.categories.ctaLead;
  document.getElementById("categories-cta").textContent = c.categories.cta;

  document.getElementById("footer-tech-title").textContent = c.footer.techTitle;
  const techList = document.getElementById("footer-tech-list");
  techList.innerHTML = "";
  c.footer.techStack.forEach((item) => {
    techList.appendChild(el("li", "footer-list__item", item));
  });

  document.getElementById("footer-help-title").textContent = c.footer.helpTitle;
  const helpList = document.getElementById("footer-help-list");
  helpList.innerHTML = "";
  c.footer.helpLinks.forEach((link) => {
    const li = document.createElement("li");
    const a = el("a", "footer-link", link.label);
    a.href = link.href;
    li.appendChild(a);
    helpList.appendChild(li);
  });

  document.getElementById("footer-sitemap-title").textContent = c.footer.sitemapTitle;
  const sitemap = document.getElementById("footer-sitemap");
  sitemap.innerHTML = "";
  c.footer.sitemap.forEach((link) => {
    const li = document.createElement("li");
    li.className = "footer-sitemap__item";
    const a = el("a", "footer-link footer-link--sm", link.label);
    a.href = link.href;
    li.appendChild(a);
    sitemap.appendChild(li);
  });

  document.getElementById("footer-partners-title").textContent = c.footer.partnersTitle;
  const partners = document.getElementById("footer-partners-list");
  partners.innerHTML = "";
  c.footer.partners.forEach((p) => {
    partners.appendChild(
      el("li", "footer-partner", `<p class="footer-partner__name">${p.name}</p><p class="footer-partner__role">${p.role}</p>`),
    );
  });

  const year = new Date().getFullYear();
  document.getElementById("footer-copy").textContent =
    `© ${year} Eldonia-Nex. ${c.footer.copyright}`;
  document.getElementById("footer-note").textContent = c.footer.note;
}

document.addEventListener("DOMContentLoaded", () => {
  applyCopy();

  const searchForm = document.getElementById("header-search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  }
});
