import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";

export default async function NotFound() {
  const locale = await getUiLocale();
  const t = getContent(locale);

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main eldonia-main-narrow text-center">
        <p className="eldonia-eyebrow">404</p>
        <h1 className="mt-2 eldonia-heading eldonia-heading-lg">{t.notFound.heading}</h1>
        <p className="mt-4 eldonia-body text-sm">{t.notFound.body}</p>
        <EldoniaDivider />
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="eldonia-btn-primary">
            {t.notFound.home}
          </Link>
          <Link href="/help" className="eldonia-btn-secondary">
            {t.notFound.help}
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
