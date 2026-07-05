import Link from "next/link";
import { HelpNav } from "@/components/support/help-nav";
import { PageIntro } from "@/components/layout/page-intro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { PAGE_ICONS } from "@/lib/layout/module-icons";

export default async function GuidesPage() {
  const locale = await getUiLocale();
  const { guides, help } = getContent(locale);

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <PageIntro
            eyebrow={help.eyebrow}
            title={guides.title}
            lead={guides.lead}
            iconSrc={PAGE_ICONS.help}
          />
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
                {guide.link.label}
              </Link>
            </article>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
