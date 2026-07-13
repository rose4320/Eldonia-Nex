import type { Metadata } from "next";
import { LpConceptSection } from "@/components/sections/lp-concept-section";
import { LpCtaSection } from "@/components/sections/lp-cta-section";
import { LpFanNotificationSection } from "@/components/sections/lp-fan-notification-section";
import { LpFooter } from "@/components/sections/lp-footer";
import { LpHeader } from "@/components/sections/lp-header";
import { LpHeroSection } from "@/components/sections/lp-hero-section";
import { LpPlansSection, type LpPlanCard } from "@/components/sections/lp-plans-section";
import { LpQuestPortfolioSection } from "@/components/sections/lp-quest-portfolio-section";
import { LpReferralSection } from "@/components/sections/lp-referral-section";
import { LpRewardsSection } from "@/components/sections/lp-rewards-section";
import { LpServicesSection } from "@/components/sections/lp-services-section";
import { LpTranslationSection } from "@/components/sections/lp-translation-section";
import { LpWorldSection } from "@/components/sections/lp-world-section";
import { LpContentProvider } from "@/components/providers/lp-content-provider";
import { LpPageFrame } from "@/components/ui/lp-page-frame";
import { LpSectionRule } from "@/components/ui/lp-section-rule";
import { getLpContent } from "@/lib/i18n/content/lp-messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { getLivePlanCatalog, toLpPlans } from "@/lib/plans/live-catalog";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getUiLocale();
  const { LP_SEO } = getLpContent(locale);

  return {
    title: LP_SEO.title,
    description: LP_SEO.description,
    openGraph: {
      title: LP_SEO.title,
      description: LP_SEO.description,
      type: "website",
    },
  };
}

function mergeLocalizedPlans(livePlans: LpPlanCard[], localizedPlans: LpPlanCard[]): LpPlanCard[] {
  return livePlans.map((plan) => {
    const template = localizedPlans.find((item) => item.id === plan.id);
    if (!template) return plan;
    return {
      ...plan,
      period: template.period,
      featured: template.featured,
      badge: template.badge,
      features: [...template.features],
      cta: template.cta,
      href: template.href,
    };
  });
}

/** マーケ LP — 認証不要（middleware で未ログイン / から誘導） */
export default async function MarketingLandingPage() {
  const locale = await getUiLocale();
  const content = getLpContent(locale);
  const liveCatalog = await getLivePlanCatalog();
  const plans = mergeLocalizedPlans(toLpPlans(liveCatalog), [...content.LP_PLANS]);

  return (
    <LpContentProvider content={content}>
      <div className="lp-page min-h-screen text-[#f8f1df]">
        <LpPageFrame>
          <div className="relative">
            <LpHeader />
            <main>
              <LpHeroSection />
              <LpSectionRule className="mx-auto my-1 max-w-5xl" variant="simple" />
              <LpWorldSection />
              <LpSectionRule className="mx-auto my-1 max-w-5xl" variant="compact" />
              <LpConceptSection />
              <LpSectionRule className="mx-auto my-1 max-w-5xl" variant="compact" />
              <LpFanNotificationSection />
              <LpSectionRule className="mx-auto my-1 max-w-5xl" variant="simple" />
              <LpQuestPortfolioSection />
              <LpSectionRule className="mx-auto my-1 max-w-5xl" variant="simple" />
              <LpServicesSection />
              <LpSectionRule className="mx-auto my-1 max-w-5xl" variant="ornate" />
              <LpTranslationSection />
              <LpSectionRule className="mx-auto my-1 max-w-5xl" variant="simple" />
              <LpPlansSection plans={plans} />
              <LpSectionRule className="mx-auto my-1 max-w-5xl" variant="ornate" />
              <LpReferralSection />
              <LpSectionRule className="mx-auto my-1 max-w-5xl" variant="compact" />
              <LpRewardsSection />
              <LpSectionRule className="mx-auto my-1 max-w-5xl" variant="flourish" />
              <LpCtaSection />
            </main>
          </div>
          <LpFooter />
        </LpPageFrame>
      </div>
    </LpContentProvider>
  );
}
