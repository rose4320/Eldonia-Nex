import Image from "next/image";
import { LpGoldFrame } from "@/components/ui/lp-gold-frame";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_WORLD } from "@/lib/lp/content";

export function LpWorldSection() {
  return (
    <section id="world" className="lp-world-section scroll-mt-24 px-3 py-5 sm:px-5 lg:px-6">
      <div className="lp-world-panel mx-auto max-w-[1240px]">
        <span className="lp-world-corner lp-world-corner--top-left" aria-hidden />
        <span className="lp-world-corner lp-world-corner--top-right" aria-hidden />
        <span className="lp-world-corner lp-world-corner--bottom-left" aria-hidden />
        <span className="lp-world-corner lp-world-corner--bottom-right" aria-hidden />
        <LpGoldFrame className="lp-world-frame">
          <div className="grid min-h-[210px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:min-h-[250px]">
            <div className="flex flex-col justify-center p-5 sm:p-6 lg:p-7">
              <h2 className="whitespace-pre-line font-display text-xl font-semibold tracking-wide text-[#f8f1df] sm:text-2xl">
                {LP_WORLD.title}
              </h2>
              <p className="mt-3 text-xs leading-6 text-[#d8c8a8] sm:text-sm">{LP_WORLD.body}</p>
            </div>
            <div className="relative min-h-[220px] lg:min-h-full">
              <Image
                src={LP_ASSETS.world}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#020817]/75 via-[#020817]/15 to-transparent" aria-hidden />
              <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#020817]/80 to-transparent" aria-hidden />
            </div>
          </div>
        </LpGoldFrame>
      </div>
    </section>
  );
}


