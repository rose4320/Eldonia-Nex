import Image from "next/image";
import { LpCard } from "@/components/ui/lp-card";
import { LpSectionTitle } from "@/components/ui/lp-section-title";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_REWARDS } from "@/lib/lp/content";

export function LpRewardsSection() {
  return (
    <section id="rewards" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <LpSectionTitle className="mb-10">{LP_REWARDS.title}</LpSectionTitle>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,280px)_1fr_minmax(0,260px)]">
          <div className="mx-auto lg:mx-0">
            <Image
              src={LP_ASSETS.pinBadge}
              alt="EN記念ピンバッジ"
              width={280}
              height={280}
              className="drop-shadow-[0_8px_32px_rgba(197,160,89,0.25)]"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-lg text-[#c5a059]">{LP_REWARDS.pinTitle}</h3>
            <p className="text-sm leading-7 text-[#c9c4b8]">{LP_REWARDS.lead}</p>
            <p className="text-sm leading-7 text-[#9a8b6a]">{LP_REWARDS.pinBody}</p>
          </div>

          <div className="space-y-4">
            <LpCard className="p-5 text-center">
              <p className="text-xs text-[#9a8b6a]">シリアル番号付き記念ピンバッジ</p>
              <p className="mt-2 font-display text-sm tracking-wider text-[#e8d5a3]">例：</p>
              <p className="mt-1 font-display text-xl text-[#c5a059]">{LP_REWARDS.serialExample}</p>
              <p className="mt-3 text-xs text-[#9a8b6a]">{LP_REWARDS.serialLegend}</p>
            </LpCard>

            <ul className="space-y-3">
              {LP_REWARDS.perks.map((perk) => (
                <li key={perk.label}>
                  <LpCard className="flex items-center gap-3 p-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-[#c5a059]/35 bg-[#c5a059]/10 text-sm">
                      {perk.icon === "pin" ? "📌" : perk.icon === "community" ? "👥" : "⚡"}
                    </span>
                    <div>
                      <p className="font-display text-xs font-semibold tracking-wider text-[#e8d5a3]">
                        {perk.label}
                      </p>
                      <p className="text-[0.65rem] text-[#9a8b6a]">{perk.desc}</p>
                    </div>
                  </LpCard>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
