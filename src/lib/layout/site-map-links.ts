import type { UiLocale } from "@/lib/i18n/locale";
import { MODULE_NAV_LINKS } from "@/lib/layout/nav-links";

type LocalizedLabel = {
  ja: string;
  en: string;
  ko: string;
  "zh-CN": string;
};

export type SiteMapLink = {
  href: string;
  label: LocalizedLabel;
};

export type SiteMapSection = {
  id: string;
  title: LocalizedLabel;
  links: SiteMapLink[];
};

export function localizedSiteMapLabel(
  record: LocalizedLabel,
  locale: UiLocale,
): string {
  return record[locale] ?? record.ja;
}

/** HTML サイトマップ用 — フッターには出さず `/sitemap` に集約 */
export const SITE_MAP_SECTIONS: SiteMapSection[] = [
  {
    id: "modules",
    title: {
      ja: "メインモジュール",
      en: "Main modules",
      ko: "메인 모듈",
      "zh-CN": "主要模块",
    },
    links: MODULE_NAV_LINKS.map((link) => ({
      href: link.href,
      label: {
        ja: link.label,
        en: link.label,
        ko: link.label,
        "zh-CN": link.label,
      },
    })),
  },
  {
    id: "discover",
    title: {
      ja: "案内・特典",
      en: "Discover",
      ko: "안내·특전",
      "zh-CN": "导览与特典",
    },
    links: [
      {
        href: "/lp",
        label: { ja: "ランディング", en: "Landing", ko: "랜딩", "zh-CN": "落地页" },
      },
      {
        href: "/contributors",
        label: {
          ja: "貢献者特典",
          en: "Contributor rewards",
          ko: "기여자 특전",
          "zh-CN": "贡献者特典",
        },
      },
      {
        href: "/settings/plan",
        label: { ja: "料金プラン", en: "Plans", ko: "요금 플랜", "zh-CN": "定价方案" },
      },
    ],
  },
  {
    id: "help",
    title: {
      ja: "ヘルプ",
      en: "Help",
      ko: "도움말",
      "zh-CN": "帮助",
    },
    links: [
      {
        href: "/help",
        label: { ja: "ヘルプセンター", en: "Help Center", ko: "도움말", "zh-CN": "帮助中心" },
      },
      {
        href: "/help/faq",
        label: { ja: "よくある質問", en: "FAQ", ko: "FAQ", "zh-CN": "常见问题" },
      },
      {
        href: "/help/guides",
        label: { ja: "利用ガイド", en: "Guides", ko: "가이드", "zh-CN": "使用指南" },
      },
      {
        href: "/help/contact",
        label: { ja: "お問い合わせ", en: "Contact", ko: "문의", "zh-CN": "联系我们" },
      },
      {
        href: "/help/tickets",
        label: { ja: "マイチケット", en: "My Tickets", ko: "내 티켓", "zh-CN": "我的工单" },
      },
      {
        href: "/terms",
        label: {
          ja: "利用規約",
          en: "Terms of Service",
          ko: "이용 약관",
          "zh-CN": "服务条款",
        },
      },
      {
        href: "/privacy",
        label: {
          ja: "プライバシーポリシー",
          en: "Privacy Policy",
          ko: "개인정보 처리방침",
          "zh-CN": "隐私政策",
        },
      },
    ],
  },
  {
    id: "legal",
    title: {
      ja: "規約・プライバシー",
      en: "Legal",
      ko: "약관·개인정보",
      "zh-CN": "条款与隐私",
    },
    links: [
      {
        href: "/terms",
        label: {
          ja: "利用規約",
          en: "Terms of Service",
          ko: "이용 약관",
          "zh-CN": "服务条款",
        },
      },
      {
        href: "/privacy",
        label: {
          ja: "プライバシーポリシー",
          en: "Privacy Policy",
          ko: "개인정보 처리방침",
          "zh-CN": "隐私政策",
        },
      },
    ],
  },
];
