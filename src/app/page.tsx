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

export default function HomePage() {
  return (
    <div className="lp-page min-h-screen text-[#e8d5a3]">
      <LpPageFrame>
        <LpHeader />
        <main>
          <LpHeroSection />
          <LpSectionRule className="mx-auto my-2 max-w-4xl" />
          <LpWorldSection />
          <LpSectionRule className="mx-auto my-2 max-w-4xl" />
          <LpServicesSection />
          <LpSectionRule className="mx-auto my-2 max-w-4xl" />
          <LpTranslationSection />
          <LpSectionRule className="mx-auto my-2 max-w-4xl" />
          <LpPlansSection />
          <LpSectionRule className="mx-auto my-2 max-w-4xl" />
          <LpReferralSection />
          <LpSectionRule className="mx-auto my-2 max-w-4xl" />
          <LpRewardsSection />
          <LpSectionRule className="mx-auto my-2 max-w-4xl" />
          <LpCtaSection />
        </main>
        <LpFooter />
      </LpPageFrame>
    </div>
  );
}
