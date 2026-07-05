import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import type { UiLocale } from "@/lib/i18n/locale";
import { uiMessage } from "@/lib/i18n/ui-messages";
import {
  localizedFooterLabel,
  SITE_FOOTER_NAV_LINKS,
} from "@/lib/layout/footer-links";
import { MODULE_NAV_LINKS } from "@/lib/layout/nav-links";

const TECH_STACK = [
  "Next.js 16",
  "Supabase",
  "PostgreSQL",
  "Stripe",
  "Django Admin",
];

const HELP_LINKS = [
  { href: "/help", label: { ja: "ヘルプセンター", en: "Help Center", ko: "도움말", "zh-CN": "帮助中心" } },
  { href: "/help/faq", label: { ja: "よくある質問", en: "FAQ", ko: "FAQ", "zh-CN": "常见问题" } },
  { href: "/help/guides", label: { ja: "利用ガイド", en: "Guides", ko: "가이드", "zh-CN": "使用指南" } },
  { href: "/help/contact", label: { ja: "お問い合わせ", en: "Contact", ko: "문의", "zh-CN": "联系我们" } },
  { href: "/help/tickets", label: { ja: "マイチケット", en: "My Tickets", ko: "내 티켓", "zh-CN": "我的工单" } },
  { href: "/investors", label: { ja: "投資家・共創パートナー", en: "Investors", ko: "Investors", "zh-CN": "投资者" } },
  { href: "/terms", label: { ja: "利用規約", en: "Terms of Service", ko: "이용 약관", "zh-CN": "服务条款" } },
  { href: "/privacy", label: { ja: "プライバシーポリシー", en: "Privacy Policy", ko: "개인정보 처리방침", "zh-CN": "隐私政策" } },
];

const PARTNERS = [
  { name: "Nexus Cloud", role: { ja: "インフラ協力", en: "Infrastructure", ko: "인프라", "zh-CN": "基础设施" } },
  { name: "Creator Guild", role: { ja: "コミュニティ協力", en: "Community Partner", ko: "커뮤니티", "zh-CN": "社区合作" } },
  { name: "Gold Sponsor Slot", role: { ja: "スポンサー枠", en: "Sponsor Slot", ko: "스폰서", "zh-CN": "赞助位" } },
];

function localizedLabel(
  record: { ja: string; en: string; ko: string; "zh-CN": string },
  locale: UiLocale,
): string {
  return record[locale] ?? record.ja;
}

export async function SiteFooter() {
  const locale = await getUiLocale();

  return (
    <footer className="eldonia-footer bg-[#020817]">
      <div className="lp-footer__divider" aria-hidden>
        <span className="lp-footer__divider-line" />
        <span className="lp-footer__divider-line" />
      </div>

      <div className="mx-auto max-w-[1240px] px-4 pt-8 sm:px-6">
        <div className="eldonia-footer-brand">
          <BrandLogo size="md" showSubtitle />
        </div>

        <div className="eldonia-footer-grid mt-8">
          <div>
            <h2 className="eldonia-eyebrow">{uiMessage(locale, "footerTech")}</h2>
            <ul className="mt-4 space-y-2">
              {TECH_STACK.map((item) => (
                <li key={item} className="eldonia-body text-sm text-eldonia-text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eldonia-eyebrow">{uiMessage(locale, "footerHelp")}</h2>
            <ul className="mt-4 space-y-2">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="eldonia-link text-sm">
                    {localizedLabel(link.label, locale)}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="eldonia-eyebrow mt-6">{uiMessage(locale, "footerSitemap")}</p>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
              {MODULE_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="eldonia-link text-xs tracking-wider">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eldonia-eyebrow">{uiMessage(locale, "footerPartners")}</h2>
            <ul className="mt-4 space-y-3">
              {PARTNERS.map((partner) => (
                <li key={partner.name} className="text-sm">
                  <p className="font-display text-eldonia-gold-light">{partner.name}</p>
                  <p className="eldonia-body text-xs text-eldonia-text-muted">
                    {localizedLabel(partner.role, locale)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <nav
          className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-[#d6a84f]/15 pt-6"
          aria-label="Footer"
        >
          {SITE_FOOTER_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-[0.65rem] tracking-[0.1em] text-[#9e927d] hover:text-[#f0c978]"
            >
              {localizedFooterLabel(link.label, locale)}
            </Link>
          ))}
        </nav>
      </div>

      <div className="eldonia-footer-copy mt-6 border-t border-[#d6a84f]/10 px-4 py-5 sm:px-6">
        <p className="font-display text-[0.65rem] tracking-[0.2em] text-eldonia-text-dim uppercase">
          © {new Date().getFullYear()} Eldonia-Nex. {uiMessage(locale, "footerCopyright")}
        </p>
      </div>
    </footer>
  );
}
