import { LpCard } from "@/components/ui/lp-card";
import { LP_FEATURE_CARDS } from "@/lib/lp/content";

const icons: Record<string, string> = {
  gallery: "🖼",
  global: "🌐",
  market: "⚖",
};

export function LpFeatureCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {LP_FEATURE_CARDS.map((card) => (
        <LpCard key={card.key} className="p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-[#c5a059]/40 bg-[#c5a059]/10 text-lg">
              {icons[card.key]}
            </span>
            <div>
              <p className="font-display text-sm font-semibold tracking-wider text-[#e8d5a3]">
                {card.title}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#9a8b6a]">{card.body}</p>
            </div>
          </div>
        </LpCard>
      ))}
    </div>
  );
}
