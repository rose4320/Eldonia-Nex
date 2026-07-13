import Link from "next/link";
import { FaqAccordion } from "@/components/support/faq-accordion";
import { HelpNav } from "@/components/support/help-nav";
import { PageIntro } from "@/components/layout/page-intro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { PAGE_ICONS } from "@/lib/layout/module-icons";
import { getReleaseFaqArticles } from "@/lib/support/faq-release-catalog";

type FaqPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function FaqPage({ searchParams }: FaqPageProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const params = await searchParams;
  const articles = getReleaseFaqArticles(locale);

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <PageIntro
            eyebrow={t.help.eyebrow}
            title={t.pages.help.faqTitle}
            lead={
              <>
                {t.pages.help.faqLead}{" "}
                <Link href="/help/contact" className="eldonia-link font-medium">
                  {t.pages.help.faqContactLink}
                </Link>
              </>
            }
            iconSrc={PAGE_ICONS.help}
          />
          <HelpNav current="/help/faq" />
        </section>

        <section className="eldonia-card">
          <FaqAccordion articles={articles} initialQuery={params.q ?? ""} />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
