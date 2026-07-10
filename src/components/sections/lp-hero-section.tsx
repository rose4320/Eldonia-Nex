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
          sizes="(max-width: 1240px) 100vw, 100vw"
          className="object-cover object-[center_40%] lg:object-[62%_38%]"
        />
        <div className="lp-hero__shade-left" aria-hidden />
        <div className="lp-hero__shade-bottom" aria-hidden />
      </div>

      <div className="lp-hero__content relative mx-auto max-w-[1240px] px-4 pb-6 pt-[5.5rem] sm:px-6 sm:pb-8 sm:pt-24 lg:pt-24">
        <div className="max-w-[34rem]">
          <h1 className="whitespace-pre-line font-display text-[2.05rem] font-bold leading-tight tracking-wide text-[#f8f1df] drop-shadow-[0_2px_18px_rgba(0,0,0,0.75)] sm:text-4xl lg:text-[2.8rem]">
            {LP_HERO.title}
          </h1>
          <p className="mt-4 max-w-[28rem] whitespace-pre-line text-xs leading-6 text-[#e5d4ad] sm:text-sm">
            {LP_HERO.lead}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
            <LpButton href="/auth/signup">{LP_HERO.primaryCta}</LpButton>
            <LpButton href="#services" variant="outline">
              {LP_HERO.secondaryCta}
            </LpButton>
          </div>
        </div>

        <div className="mt-7 max-w-[34rem] lg:mt-8">
          <LpFeatureCards />
        </div>
      </div>
    </section>
  );
}
