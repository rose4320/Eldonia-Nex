import type { UiLocale } from "@/lib/i18n/locale";

type LocalizedLabel = {
  ja: string;
  en: string;
  ko: string;
  "zh-CN": string;
};

export type FooterTechItem = {
  name: string;
  href: string;
};

export type FooterTechCategory = {
  id: string;
  label: LocalizedLabel;
  items: FooterTechItem[];
};

/**
 * Eldonia–Nex production tech stack — official docs links.
 * Keep in sync with package.json / backend requirements / department docs.
 */
export const FOOTER_TECH_CATEGORIES: FooterTechCategory[] = [
  {
    id: "frontend",
    label: {
      ja: "フロントエンド",
      en: "Frontend",
      ko: "프론트엔드",
      "zh-CN": "前端",
    },
    items: [
      { name: "Next.js", href: "https://nextjs.org/" },
      { name: "React", href: "https://react.dev/" },
      { name: "TypeScript", href: "https://www.typescriptlang.org/" },
      { name: "Tailwind CSS", href: "https://tailwindcss.com/" },
    ],
  },
  {
    id: "backend",
    label: {
      ja: "バックエンド・管理",
      en: "Backend & Admin",
      ko: "백엔드·관리",
      "zh-CN": "后端与管理",
    },
    items: [
      { name: "Django", href: "https://www.djangoproject.com/" },
      { name: "Python", href: "https://www.python.org/" },
    ],
  },
  {
    id: "data",
    label: {
      ja: "データ・認証",
      en: "Data & Auth",
      ko: "데이터·인증",
      "zh-CN": "数据与认证",
    },
    items: [
      { name: "Supabase", href: "https://supabase.com/" },
      { name: "PostgreSQL", href: "https://www.postgresql.org/" },
    ],
  },
  {
    id: "payments",
    label: {
      ja: "決済",
      en: "Payments",
      ko: "결제",
      "zh-CN": "支付",
    },
    items: [{ name: "Stripe", href: "https://stripe.com/" }],
  },
  {
    id: "infra",
    label: {
      ja: "ホスティング・インフラ",
      en: "Hosting & Infra",
      ko: "호스팅·인프라",
      "zh-CN": "托管与基础设施",
    },
    items: [
      { name: "Vercel", href: "https://vercel.com/" },
      { name: "Railway", href: "https://railway.app/" },
      { name: "Google Cloud", href: "https://cloud.google.com/" },
      { name: "Docker", href: "https://www.docker.com/" },
    ],
  },
  {
    id: "translation",
    label: {
      ja: "翻訳・多言語",
      en: "Translation",
      ko: "번역·다국어",
      "zh-CN": "翻译与多语言",
    },
    items: [
      {
        name: "Google Cloud Translation",
        href: "https://cloud.google.com/translate",
      },
    ],
  },
  {
    id: "media",
    label: {
      ja: "メディア・ドキュメント",
      en: "Media & Documents",
      ko: "미디어·문서",
      "zh-CN": "媒体与文档",
    },
    items: [
      { name: "pdf-lib", href: "https://pdf-lib.js.org/" },
      { name: "model-viewer", href: "https://modelviewer.dev/" },
      { name: "QRCode", href: "https://github.com/soldair/node-qrcode" },
      { name: "Noto Sans JP", href: "https://fonts.google.com/noto/specimen/Noto+Sans+JP" },
    ],
  },
  {
    id: "observability",
    label: {
      ja: "計測・品質",
      en: "Analytics & Quality",
      ko: "분석·품질",
      "zh-CN": "分析与质量",
    },
    items: [
      { name: "Vercel Analytics", href: "https://vercel.com/analytics" },
      { name: "Vercel Speed Insights", href: "https://vercel.com/docs/speed-insights" },
      { name: "ESLint", href: "https://eslint.org/" },
    ],
  },
];

export function localizedTechCategoryLabel(
  record: LocalizedLabel,
  locale: UiLocale,
): string {
  return record[locale] ?? record.ja;
}
