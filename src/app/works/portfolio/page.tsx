import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PortfolioForm } from "@/components/works/portfolio-form";
import { QuestHistory } from "@/components/works/quest-history";
import { WorksToolbar } from "@/components/works/works-toolbar";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { getUserQuestHistory } from "@/lib/quests/get-quests";
import { createClient } from "@/lib/supabase/server";
import { getPortfolioForUser } from "@/lib/works/get-works";

export default async function PortfolioPage() {
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect_to=/works/portfolio");
  }

  const [portfolio, questHistory] = await Promise.all([
    getPortfolioForUser(user.id, { useSampleFallback: false }),
    getUserQuestHistory(user.id),
  ]);

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <WorksToolbar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
        <Link href="/works" className="eldonia-link text-sm">
          {pages.works.back}
        </Link>
        <h1 className="eldonia-heading eldonia-heading-lg mt-4">{pages.works.portfolioTitle}</h1>
        <p className="eldonia-body mt-2 text-sm">{pages.works.portfolioLead}</p>

        <PortfolioForm userId={user.id} portfolio={portfolio} />
        <QuestHistory entries={questHistory} />
      </main>

      <SiteFooter />
    </div>
  );
}
