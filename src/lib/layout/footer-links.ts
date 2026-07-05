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

/** 未ログイン LP（`/`）向け — セクションアンカーは LP 内 */
export const LP_FOOTER_NAV_LINKS: FooterNavLink[] = [
  {
    href: "/#services",
    label: { ja: "サービス一覧", en: "Services", ko: "서비스", "zh-CN": "服务一览" },
  },
  {
    href: "/#world",
    label: { ja: "ワールドガイド", en: "World Guide", ko: "월드 가이드", "zh-CN": "世界指南" },
  },
  {
    href: "/#plans",
    label: { ja: "料金プラン", en: "Plans", ko: "요금 플랜", "zh-CN": "定价方案" },
  },
  {
    href: "/help/guides",
    label: { ja: "スタートガイド", en: "Getting Started", ko: "시작 가이드", "zh-CN": "入门指南" },
  },
  {
    href: "/investors",
    label: { ja: "運営・パートナー", en: "About & Partners", ko: "운영·파트너", "zh-CN": "运营与伙伴" },
  },
  {
    href: "/help/contact",
    label: { ja: "お問い合わせ", en: "Contact", ko: "문의", "zh-CN": "联系我们" },
  },
  {
    href: "/terms",
    label: { ja: "利用規約", en: "Terms of Service", ko: "이용 약관", "zh-CN": "服务条款" },
  },
  {
    href: "/privacy",
    label: { ja: "プライバシーポリシー", en: "Privacy Policy", ko: "개인정보 처리방침", "zh-CN": "隐私政策" },
  },
];

/** ログイン後 SiteFooter 向け — Home / アプリ内ルート */
export const SITE_FOOTER_NAV_LINKS: FooterNavLink[] = [
  {
    href: "/home#modules",
    label: { ja: "サービス一覧", en: "Services", ko: "서비스", "zh-CN": "服务一览" },
  },
  {
    href: "/home#world",
    label: { ja: "ワールドガイド", en: "World Guide", ko: "월드 가이드", "zh-CN": "世界指南" },
  },
  {
    href: "/settings/plan",
    label: { ja: "料金プラン", en: "Plans", ko: "요금 플랜", "zh-CN": "定价方案" },
  },
  {
    href: "/help/guides",
    label: { ja: "スタートガイド", en: "Getting Started", ko: "시작 가이드", "zh-CN": "入门指南" },
  },
  {
    href: "/investors",
    label: { ja: "運営・パートナー", en: "About & Partners", ko: "운영·파트너", "zh-CN": "运营与伙伴" },
  },
  {
    href: "/help/contact",
    label: { ja: "お問い合わせ", en: "Contact", ko: "문의", "zh-CN": "联系我们" },
  },
  {
    href: "/terms",
    label: { ja: "利用規約", en: "Terms of Service", ko: "이용 약관", "zh-CN": "服务条款" },
  },
  {
    href: "/privacy",
    label: { ja: "プライバシーポリシー", en: "Privacy Policy", ko: "개인정보 처리방침", "zh-CN": "隐私政策" },
  },
];
