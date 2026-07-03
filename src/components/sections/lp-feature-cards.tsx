import Image from "next/image";
import { LpCard } from "@/components/ui/lp-card";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_FEATURE_CARDS } from "@/lib/lp/content";

export function LpFeatureCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {LP_FEATURE_CARDS.map((card) => (
        <LpCard key={card.key} hover className="lp-feature-card p-4">
          <div className="flex items-start gap-3">
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded border border-[#d6a84f]/60 bg-[rgba(5,14,30,0.92)]">
              <Image
                src={LP_ASSETS.features[card.key as keyof typeof LP_ASSETS.features]}
                alt=""
                width={32}
                height={32}
                className="object-contain opacity-100"
              />
            </span>
            <div>
              <p className="font-display text-sm font-semibold tracking-wider text-[#fff4d5]">
                {card.title}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#d8c8a8]">{card.body}</p>
            </div>
          </div>
        </LpCard>
      ))}
    </div>
  );
}
