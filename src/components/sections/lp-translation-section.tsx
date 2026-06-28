import Image from "next/image";
import { LpCard } from "@/components/ui/lp-card";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_TRANSLATION } from "@/lib/lp/content";

export function LpTranslationSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#c5a059]/20 to-violet-600/20 blur-2xl" />
          <div className="relative h-full w-full overflow-hidden rounded-full border border-[#c5a059]/40 shadow-[0_0_40px_rgba(139,92,246,0.25)]">
            <Image
              src={LP_ASSETS.globe}
              alt=""
              fill
              sizes="(max-width: 640px) 80vw, 384px"
              className="object-cover"
            />
          </div>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-wide text-[#e8d5a3] sm:text-3xl">
            {LP_TRANSLATION.title}
          </h2>
          <ul className="mt-6 space-y-4">
            {LP_TRANSLATION.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-7 text-[#c9c4b8]">
                <span className="mt-0.5 text-[#c5a059]" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-end lg:justify-start">
            <LpCard className="inline-flex items-center gap-3 px-5 py-3 shadow-[0_0_24px_rgba(139,92,246,0.25)]">
              <span className="font-display text-2xl font-bold text-violet-300">A</span>
              <span className="text-violet-400/80" aria-hidden>
                ⇄
              </span>
              <span className="font-display text-2xl font-bold text-[#e8d5a3]">あ</span>
            </LpCard>
          </div>
        </div>
      </div>
    </section>
  );
}
