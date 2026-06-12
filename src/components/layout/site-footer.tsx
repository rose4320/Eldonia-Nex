import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";

const supportLinks = [
  { href: "/help", label: "ヘルプセンター" },
  { href: "/help/faq", label: "よくある質問" },
  { href: "/help/guides", label: "利用ガイド" },
  { href: "/help/contact", label: "お問い合わせ" },
  { href: "/help/tickets", label: "マイチケット" },
];

const moduleLinks = [
  { href: "/gallery", label: "GALLEY" },
  { href: "/shop", label: "SHOP" },
  { href: "/events", label: "EVENTS" },
  { href: "/community", label: "COMMUNITY" },
  { href: "/works", label: "WORKS" },
];

export function SiteFooter() {
  return (
    <footer className="eldonia-footer">
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <EldoniaDivider />
      </div>
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
          <BrandLogo size="sm" showSubtitle />
          <p className="eldonia-body text-sm">
            クリエイターがファンを集め、作品を共有し、収益化できるファンタジー・ネクサス。
          </p>
        </div>

        <div>
          <h2 className="eldonia-eyebrow">サポート</h2>
          <ul className="mt-4 space-y-2">
            {supportLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="eldonia-link text-sm">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eldonia-eyebrow">モジュール</h2>
          <ul className="mt-4 space-y-2">
            {moduleLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="eldonia-link text-sm">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eldonia-eyebrow">お問い合わせ</h2>
          <ul className="mt-4 space-y-2 text-sm text-eldonia-text-muted">
            <li>
              <a href="mailto:support@eldonia-nex.com" className="eldonia-link">
                support@eldonia-nex.com
              </a>
            </li>
            <li>平日 10:00〜18:00（JST）</li>
            <li>初回返信目安: 1〜2 営業日</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-eldonia-gold/10 px-6 py-4 text-center">
        <p className="font-display text-[0.65rem] tracking-[0.2em] text-eldonia-text-dim uppercase">
          © {new Date().getFullYear()} Eldonia-Nex. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
