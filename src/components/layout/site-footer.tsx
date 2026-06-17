import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import type { UiLocale } from "@/lib/i18n/locale";
import { uiMessage } from "@/lib/i18n/ui-messages";
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
    <footer className="eldonia-footer">
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <EldoniaDivider />

        <div className="eldonia-footer-brand mt-10">
          <BrandLogo size="md" showSubtitle />
        </div>

        <div className="eldonia-footer-grid mt-10">
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
      </div>

      <div className="eldonia-footer-copy mt-10 border-t border-eldonia-gold/10 px-4 py-5 sm:px-6">
        <p className="font-display text-[0.65rem] tracking-[0.2em] text-eldonia-text-dim uppercase">
          © {new Date().getFullYear()} Eldonia-Nex. {uiMessage(locale, "footerCopyright")}
        </p>
      </div>
    </footer>
  );
}
