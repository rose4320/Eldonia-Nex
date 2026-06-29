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
          className="object-cover object-[center_40%] lg:object-[62%_38%]"
        />
        <div className="lp-hero__shade-left" aria-hidden />
        <div className="lp-hero__shade-bottom" aria-hidden />
      </div>

      <div className="lp-hero__content relative mx-auto max-w-[1200px] px-4 pb-10 pt-[7.5rem] sm:px-6 sm:pb-14 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="max-w-2xl">
          <h1 className="whitespace-pre-line font-display text-3xl font-bold leading-tight tracking-wide text-[#f8f1df] sm:text-4xl lg:text-[2.75rem]">
            {LP_HERO.title}
          </h1>
          <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#d8c8a8] sm:text-base">
            {LP_HERO.lead}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
            <LpButton href="/auth/signup">{LP_HERO.primaryCta}</LpButton>
            <LpButton href="#services" variant="outline">
              {LP_HERO.secondaryCta}
            </LpButton>
          </div>
        </div>

        <div className="mt-10 lg:mt-14">
          <LpFeatureCards />
        </div>
      </div>
    </section>
  );
}
