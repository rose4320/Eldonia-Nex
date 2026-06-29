import Image from "next/image";
import { LpGoldFrame } from "@/components/ui/lp-gold-frame";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_WORLD } from "@/lib/lp/content";

export function LpWorldSection() {
  return (
    <section id="world" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <LpGoldFrame>
          <div className="grid min-h-[300px] lg:grid-cols-2 lg:min-h-[360px]">
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <h2 className="font-display text-2xl font-semibold tracking-wide text-[#f8f1df] sm:text-3xl">
                {LP_WORLD.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#d8c8a8] sm:text-base">{LP_WORLD.body}</p>
            </div>
            <div className="relative min-h-[220px] lg:min-h-full">
              <Image
                src={LP_ASSETS.world}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover object-center"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#020817]/55 via-transparent to-transparent lg:from-transparent lg:via-transparent"
                aria-hidden
              />
            </div>
          </div>
        </LpGoldFrame>
      </div>
    </section>
  );
}
