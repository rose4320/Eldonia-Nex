import Image from "next/image";
import { LpButton } from "@/components/ui/lp-button";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_HERO } from "@/lib/lp/content";
import { LpFeatureCards } from "@/components/sections/lp-feature-cards";

export function LpHeroSection() {
  return (
    <section className="lp-hero relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={LP_ASSETS.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_40%] lg:object-[60%_40%]"
        />
        <div className="lp-hero__shade-left" aria-hidden />
        <div className="lp-hero__shade-bottom" aria-hidden />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 sm:pb-12 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold leading-tight tracking-wide text-[#e8d5a3] sm:text-4xl lg:text-[2.75rem]">
            {LP_HERO.title}
          </h1>
          <p className="mt-5 text-sm leading-7 text-[#c9c4b8] sm:text-base">{LP_HERO.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LpButton href="/auth/signup">{LP_HERO.primaryCta}</LpButton>
            <LpButton href="#services" variant="outline">
              {LP_HERO.secondaryCta}
            </LpButton>
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <LpFeatureCards />
        </div>
      </div>
    </section>
  );
}
