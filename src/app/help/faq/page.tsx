import Link from "next/link";
import { FaqAccordion } from "@/components/support/faq-accordion";
import { HelpNav } from "@/components/support/help-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

type FaqPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function FaqPage({ searchParams }: FaqPageProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const params = await searchParams;
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("support_faq_articles")
    .select("id, category, question, answer")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main">
        <section className="space-y-4">
          <h1 className="eldonia-heading eldonia-heading-lg">{t.pages.help.faqTitle}</h1>
          <p className="eldonia-body text-sm">
            {t.pages.help.faqLead}{" "}
            <Link href="/help/contact" className="eldonia-link font-medium">
              {t.pages.help.faqContactLink}
            </Link>
          </p>
          <HelpNav current="/help/faq" />
        </section>

        <section className="eldonia-card">
          <FaqAccordion
            articles={articles ?? []}
            initialQuery={params.q ?? ""}
          />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
