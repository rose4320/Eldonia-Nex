import Link from "next/link";
import { HelpNav } from "@/components/support/help-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";

export default async function GuidesPage() {
  const locale = await getUiLocale();
  const { guides } = getContent(locale);

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main">
        <section className="space-y-4">
          <h1 className="eldonia-heading eldonia-heading-lg">{guides.title}</h1>
          <p className="eldonia-body text-sm">{guides.lead}</p>
          <HelpNav current="/help/guides" />
        </section>

        <section className="grid gap-6">
          {guides.sections.map((guide) => (
            <article key={guide.title} className="eldonia-card">
              <h2 className="font-display text-lg font-semibold tracking-wide text-eldonia-gold-light">
                {guide.title}
              </h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-eldonia-text-muted">
                {guide.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <Link
                href={guide.link.href}
                className="eldonia-link mt-4 inline-block text-sm font-medium"
              >
                {guide.link.label} →
              </Link>
            </article>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
