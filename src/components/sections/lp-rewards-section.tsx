import Image from "next/image";
import { LpCard } from "@/components/ui/lp-card";
import { LpSectionTitle } from "@/components/ui/lp-section-title";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_REWARDS } from "@/lib/lp/content";

export function LpRewardsSection() {
  return (
    <section id="rewards" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <LpSectionTitle className="mb-10">{LP_REWARDS.title}</LpSectionTitle>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,260px)_1fr_minmax(0,240px)]">
          <div className="mx-auto lg:mx-0">
            <Image
              src={LP_ASSETS.pinBadge}
              alt="EN記念ピンバッジ"
              width={260}
              height={260}
              className="drop-shadow-[0_8px_32px_rgba(214,168,79,0.28)]"
            />
          </div>

          <div className="space-y-5">
            <p className="text-sm leading-7 text-[#d8c8a8] sm:text-base">{LP_REWARDS.lead}</p>

            <LpCard className="p-5">
              <p className="font-display text-sm tracking-wider text-[#d6a84f]">
                {LP_REWARDS.serialTitle}
              </p>
              <p className="mt-3 text-sm leading-7 text-[#9e927d]">{LP_REWARDS.serialBody}</p>
              <p className="mt-4 font-display text-xs tracking-wider text-[#d8c8a8]">例：</p>
              <p className="mt-1 font-display text-xl text-[#d6a84f]">{LP_REWARDS.serialExample}</p>
              <p className="mt-3 text-xs text-[#9e927d]">{LP_REWARDS.serialLegend}</p>
            </LpCard>
          </div>

          <ul className="space-y-3">
            {LP_REWARDS.perks.map((perk) => (
              <li key={perk.label}>
                <LpCard hover className="flex items-center gap-3 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[#d6a84f]/35 bg-[#d6a84f]/10 text-sm">
                    {perk.icon === "pin" ? "📌" : perk.icon === "community" ? "👥" : "⚡"}
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
