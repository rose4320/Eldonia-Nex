import type { Metadata } from "next";
import { LpCtaSection } from "@/components/sections/lp-cta-section";
import { LpFooter } from "@/components/sections/lp-footer";
import { LpHeader } from "@/components/sections/lp-header";
import { LpHeroSection } from "@/components/sections/lp-hero-section";
import { LpPlansSection } from "@/components/sections/lp-plans-section";
import { LpReferralSection } from "@/components/sections/lp-referral-section";
import { LpRewardsSection } from "@/components/sections/lp-rewards-section";
import { LpServicesSection } from "@/components/sections/lp-services-section";
import { LpTranslationSection } from "@/components/sections/lp-translation-section";
import { LpWorldSection } from "@/components/sections/lp-world-section";
import { LpPageFrame } from "@/components/ui/lp-page-frame";
import { LpSectionRule } from "@/components/ui/lp-section-rule";
import { LP_SEO } from "@/lib/lp/content";

export const metadata: Metadata = {
  title: LP_SEO.title,
  description: LP_SEO.description,
  openGraph: {
    title: LP_SEO.title,
    description: LP_SEO.description,
    type: "website",
  },
};

/** マーケ LP — 認証不要（middleware で未ログイン / から誘導） */
export default function MarketingLandingPage() {
  return (
    <div className="lp-page min-h-screen text-[#f8f1df]">
      <LpPageFrame>
        <div className="relative">
          <LpHeader />
          <main>
            <LpHeroSection />
            <LpSectionRule className="mx-auto my-1 max-w-5xl" variant="simple" />
            <LpWorldSection />
            <LpSectionRule className="mx-auto my-1 max-w-5xl" variant="compact" />
            <LpServicesSection />
            <LpSectionRule className="mx-auto my-1 max-w-5xl" variant="ornate" />
            <LpTranslationSection />
            <LpSectionRule className="mx-auto my-1 max-w-5xl" variant="simple" />
            <LpPlansSection />
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
  );
}
