import Image from "next/image";
import { LpOrnateBox } from "@/components/ui/lp-ornate-box";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_TRANSLATION } from "@/lib/lp/content";

export function LpTranslationSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <LpOrnateBox className="p-4 sm:p-6 lg:p-8">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,240px)_1fr_minmax(0,180px)] lg:gap-10">
            <div className="relative mx-auto aspect-square w-full max-w-[220px] lg:max-w-none">
              <div className="lp-globe-figure relative h-full w-full">
                <Image
                  src={LP_ASSETS.globe}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 220px, 240px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="text-center lg:text-left">
              <h2 className="font-display text-2xl font-semibold tracking-wide text-[#f8f1df] sm:text-3xl">
                {LP_TRANSLATION.title}
              </h2>
              <ul className="mt-6 space-y-4">
                {LP_TRANSLATION.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-7 text-[#d8c8a8]">
                    <span className="mt-0.5 shrink-0 text-[#d6a84f]" aria-hidden>
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="lp-translation-icon flex h-28 w-28 flex-col items-center justify-center rounded-lg border border-[#7c5cff]/45 bg-[rgba(5,14,30,0.86)] shadow-[0_0_24px_rgba(124,92,255,0.22)]">
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl font-bold text-[#7c5cff]">A</span>
                  <span className="text-[#7c5cff]/80" aria-hidden>
                    ⇄
                  </span>
                  <span className="font-display text-2xl font-bold text-[#f8f1df]">あ</span>
                </div>
              </div>
            </div>
          </div>
        </LpOrnateBox>
      </div>
    </section>
  );
}
