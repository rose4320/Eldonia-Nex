import Image from "next/image";
import { LpGoldFrame } from "@/components/ui/lp-gold-frame";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_WORLD } from "@/lib/lp/content";

export function LpWorldSection() {
  return (
    <section id="world" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <LpGoldFrame className="pt-8">
          <div className="relative min-h-[280px] overflow-hidden sm:min-h-[360px]">
            <Image
              src={LP_ASSETS.world}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1152px"
              className="object-cover object-center opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030508]/94 via-[#030508]/72 to-[#030508]/45" />
            <div className="relative flex h-full min-h-[280px] flex-col justify-center p-6 sm:min-h-[360px] sm:p-10 lg:max-w-xl">
              <h2 className="font-display text-2xl font-semibold tracking-wide text-[#e8d5a3] sm:text-3xl">
                {LP_WORLD.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#c9c4b8] sm:text-base">{LP_WORLD.body}</p>
            </div>
          </div>
        </LpGoldFrame>
      </div>
    </section>
  );
}
