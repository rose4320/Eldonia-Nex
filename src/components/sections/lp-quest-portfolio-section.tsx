import Image from "next/image";
import Link from "next/link";
import { LpCard } from "@/components/ui/lp-card";
import { LpSectionTitle } from "@/components/ui/lp-section-title";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_QUEST_PORTFOLIO } from "@/lib/lp/content";

function GrowthCard({
  item,
}: {
  item: typeof LP_QUEST_PORTFOLIO.quest | typeof LP_QUEST_PORTFOLIO.portfolio;
}) {
  const icon = LP_ASSETS.modules[item.key as keyof typeof LP_ASSETS.modules];
  const scene =
    item.key === "quest"
      ? LP_ASSETS.serviceBg.quest
      : LP_ASSETS.serviceBg.portfolio;

  return (
    <LpCard hover className="lp-service-card flex flex-col overflow-hidden">
      <div className="relative h-36 w-full sm:h-40">
        <Image
          src={scene}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#050e1e]/10 via-transparent to-[#050e1e]"
          aria-hidden
        />
      </div>

      <div className="relative -mt-9 flex flex-1 flex-col px-5 pb-5">
        <div className="relative mx-auto h-16 w-16 shrink-0">
          <Image
            src={icon}
            alt=""
            fill
            sizes="64px"
            className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          />
        </div>

        <h3 className="mt-2 text-center font-display text-xl font-semibold tracking-wider text-[#f8f1df]">
          {item.title}
        </h3>
        <p className="mt-1 text-center text-xs font-medium text-[#e5cf9a] sm:text-sm">
          {item.tagline}
        </p>
        <span className="mx-auto my-3 h-px w-10 bg-[rgba(214,168,79,0.45)]" aria-hidden />
        <p className="text-center text-[0.72rem] leading-5 text-[#a99d86] sm:text-xs">
          {item.body}
        </p>

        <ul className="mt-4 space-y-2">
          {item.items.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-[0.72rem] leading-5 text-[#d8c8a8] sm:text-xs"
            >
              <span className="mt-0.5 shrink-0 text-[#d6a84f]" aria-hidden>
                ✦
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <Link
          href={item.href}
          className="mt-5 inline-flex items-center justify-center gap-1 text-[0.72rem] font-medium tracking-wide text-[#d6a84f] transition-colors hover:text-[#f0c978] sm:text-xs"
        >
          {item.cta} <span aria-hidden>→</span>
        </Link>
      </div>
    </LpCard>
  );
}

export function LpQuestPortfolioSection() {
  return (
    <section id="quest" className="scroll-mt-24 px-3 py-6 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1240px]">
        <LpSectionTitle className="mb-2">{LP_QUEST_PORTFOLIO.eyebrow}</LpSectionTitle>
        <p className="mx-auto mb-2 max-w-[40rem] whitespace-pre-line text-center font-display text-lg font-bold leading-tight tracking-wide text-[#f8f1df] sm:text-xl">
          {LP_QUEST_PORTFOLIO.title}
        </p>
        <p className="mx-auto mb-3 max-w-[42rem] text-center text-xs leading-6 text-[#d8c8a8] sm:text-sm">
          {LP_QUEST_PORTFOLIO.lead}
        </p>
        <p className="mb-6 text-center font-display text-[0.68rem] tracking-[0.2em] text-[#d6a84f] uppercase">
          {LP_QUEST_PORTFOLIO.flow}
        </p>

        <div className="grid gap-4 lg:grid-cols-2">
          <GrowthCard item={LP_QUEST_PORTFOLIO.quest} />
          <GrowthCard item={LP_QUEST_PORTFOLIO.portfolio} />
        </div>
      </div>
    </section>
  );
}
