import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LpRewardsSection } from "@/components/sections/lp-rewards-section";
import { getLpContent } from "@/lib/i18n/content/lp-messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getUiLocale();
  const { LP_REWARDS } = getLpContent(locale);

  return {
    title: `${LP_REWARDS.title} | Eldonia–Nex`,
    description: LP_REWARDS.lead,
    openGraph: {
      title: `${LP_REWARDS.title} | Eldonia–Nex`,
      description: LP_REWARDS.lead,
      type: "website",
    },
  };
}

/** Contributor thank-you / pin badge rewards (not investor outreach). */
export default async function ContributorsPage() {
  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />
      <main className="flex-1 pb-16 pt-6">
        <LpRewardsSection />
      </main>
      <SiteFooter />
    </div>
  );
}
