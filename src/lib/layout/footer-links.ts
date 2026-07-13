import type { UiLocale } from "@/lib/i18n/locale";

type LocalizedLabel = {
  ja: string;
  en: string;
  ko: string;
  "zh-CN": string;
};

export type FooterNavLink = {
  href: string;
  label: LocalizedLabel;
};

export function localizedFooterLabel(
  record: LocalizedLabel,
  locale: UiLocale,
): string {
  return record[locale] ?? record.ja;
}

/** Legal / utility strip under the 3-column SiteFooter. Full directory: `/sitemap`. */
export const LP_FOOTER_NAV_LINKS: FooterNavLink[] = [
  {
    href: "/sitemap",
    label: { ja: "サイトマップ", en: "Sitemap", ko: "사이트맵", "zh-CN": "站点地图" },
  },
  {
    href: "/help",
    label: { ja: "ヘルプ", en: "Help", ko: "도움말", "zh-CN": "帮助" },
  },
  {
    href: "/help/contact",
    label: { ja: "お問い合わせ", en: "Contact", ko: "문의", "zh-CN": "联系我们" },
  },
  {
    href: "/terms",
    label: { ja: "利用規約", en: "Terms", ko: "이용 약관", "zh-CN": "服务条款" },
  },
  {
    href: "/privacy",
    label: { ja: "プライバシー", en: "Privacy", ko: "개인정보", "zh-CN": "隐私" },
  },
];

/** SiteFooter utility strip (same as LP legal links). */
export const SITE_FOOTER_NAV_LINKS: FooterNavLink[] = [
  {
    href: "/sitemap",
    label: { ja: "サイトマップ", en: "Sitemap", ko: "사이트맵", "zh-CN": "站点地图" },
  },
  {
    href: "/help",
    label: { ja: "ヘルプ", en: "Help", ko: "도움말", "zh-CN": "帮助" },
  },
  {
    href: "/help/contact",
    label: { ja: "お問い合わせ", en: "Contact", ko: "문의", "zh-CN": "联系我们" },
  },
  {
    href: "/terms",
    label: { ja: "利用規約", en: "Terms", ko: "이용 약관", "zh-CN": "服务条款" },
  },
  {
    href: "/privacy",
    label: { ja: "プライバシー", en: "Privacy", ko: "개인정보", "zh-CN": "隐私" },
  },
];
