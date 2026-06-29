import Image from "next/image";
import { LpCard } from "@/components/ui/lp-card";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_FEATURE_CARDS } from "@/lib/lp/content";

export function LpFeatureCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {LP_FEATURE_CARDS.map((card) => (
        <LpCard key={card.key} hover className="p-4">
          <div className="flex items-start gap-3">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded border border-[#d6a84f]/40 bg-[rgba(5,14,30,0.72)]">
              <Image
                src={LP_ASSETS.features[card.key as keyof typeof LP_ASSETS.features]}
                alt=""
                width={28}
                height={28}
                className="object-contain opacity-90"
              />
            </span>
            <div>
              <p className="font-display text-sm font-semibold tracking-wider text-[#f8f1df]">
                {card.title}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#9e927d]">{card.body}</p>
            </div>
          </div>
        </LpCard>
      ))}
    </div>
  );
}
