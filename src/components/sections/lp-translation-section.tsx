import Image from "next/image";
import { LpOrnateBox } from "@/components/ui/lp-ornate-box";
import { getLpContent } from "@/lib/i18n/content/lp-messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { LP_ASSETS } from "@/lib/lp/assets";

export async function LpTranslationSection() {
  const locale = await getUiLocale();
  const { LP_TRANSLATION } = getLpContent(locale);

  return (
    <section className="px-3 py-5 sm:px-5 lg:px-6">
      <div className="lp-translation-panel mx-auto max-w-[1240px]">
        <span className="lp-panel-corner lp-panel-corner--top-left" aria-hidden />
        <span className="lp-panel-corner lp-panel-corner--top-right" aria-hidden />
        <span className="lp-panel-corner lp-panel-corner--bottom-left" aria-hidden />
        <span className="lp-panel-corner lp-panel-corner--bottom-right" aria-hidden />
        <LpOrnateBox className="p-3 sm:p-4 lg:p-5">
          <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,220px)_1fr_minmax(0,150px)] lg:gap-7">
            <div className="relative mx-auto aspect-square w-full max-w-[190px] lg:max-w-none">
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
              <h2 className="whitespace-pre-line font-display text-xl font-semibold tracking-wide text-[#f8f1df] sm:text-2xl">
                {LP_TRANSLATION.title}
              </h2>
              <p className="mt-3 text-xs leading-6 text-[#d8c8a8] sm:text-sm">
                {LP_TRANSLATION.lead}
              </p>
              <ul className="mt-4 grid gap-2">
                {LP_TRANSLATION.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-xs leading-5 text-[#d8c8a8] sm:text-sm">
                    <span className="mt-0.5 shrink-0 text-[#d6a84f]" aria-hidden>
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Image
                src={LP_ASSETS.translation}
                alt={LP_TRANSLATION.imageAlt}
                width={160}
                height={160}
                className="lp-translation-image h-28 w-28 rounded-lg object-cover sm:h-32 sm:w-32 lg:h-36 lg:w-36"
              />
            </div>
          </div>
        </LpOrnateBox>
      </div>
    </section>
  );
}
