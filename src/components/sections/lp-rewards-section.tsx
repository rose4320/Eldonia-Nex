import Image from "next/image";
import { LpCard } from "@/components/ui/lp-card";
import { LpSectionTitle } from "@/components/ui/lp-section-title";
import { getLpContent } from "@/lib/i18n/content/lp-messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { LP_ASSETS } from "@/lib/lp/assets";

export async function LpRewardsSection() {
  const locale = await getUiLocale();
  const { LP_REWARDS } = getLpContent(locale);

  return (
    <section id="rewards" className="scroll-mt-24 px-3 py-6 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1240px]">
        <LpSectionTitle className="mb-5">{LP_REWARDS.title}</LpSectionTitle>

        <div className="lp-rewards-panel grid items-start gap-5 lg:grid-cols-[minmax(0,220px)_1fr_minmax(0,220px)]">
          <span className="lp-panel-corner lp-panel-corner--top-left" aria-hidden />
          <span className="lp-panel-corner lp-panel-corner--top-right" aria-hidden />
          <span className="lp-panel-corner lp-panel-corner--bottom-left" aria-hidden />
          <span className="lp-panel-corner lp-panel-corner--bottom-right" aria-hidden />
          <div className="mx-auto lg:mx-0">
            <Image
              src={LP_ASSETS.pinBadge}
              alt={LP_REWARDS.pinBadgeAlt}
              width={220}
              height={220}
            />
          </div>

          <div className="space-y-4">
            <p className="text-xs leading-6 text-[#d8c8a8] sm:text-sm">{LP_REWARDS.lead}</p>

            <LpCard className="p-4">
              <p className="font-display text-sm tracking-wider text-[#d6a84f]">
                {LP_REWARDS.serialTitle}
              </p>
              <p className="mt-2 text-xs leading-6 text-[#9e927d] sm:text-sm">{LP_REWARDS.serialBody}</p>
              <p className="mt-4 font-display text-xs tracking-wider text-[#d8c8a8]">{LP_REWARDS.serialExampleLabel}</p>
              <p className="mt-1 font-display text-xl text-[#d6a84f]">{LP_REWARDS.serialExample}</p>
              <p className="mt-3 text-xs text-[#9e927d]">{LP_REWARDS.serialLegend}</p>
            </LpCard>
          </div>

          <ul className="space-y-3 lg:mt-10">
            {LP_REWARDS.perks.map((perk) => (
              <li key={perk.label}>
                <LpCard hover className="flex items-center gap-3 p-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[#d6a84f]/35 bg-[#d6a84f]/10 text-sm">
                    {perk.icon === "pin" ? "EN" : perk.icon === "community" ? "◎" : "✦"}
                  </span>
                  <div>
                    <p className="font-display text-xs font-semibold tracking-wider text-[#f8f1df]">
                      {perk.label}
                    </p>
                    {perk.desc && (
                      <p className="text-[0.65rem] text-[#9e927d]">{perk.desc}</p>
                    )}
                  </div>
                </LpCard>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
