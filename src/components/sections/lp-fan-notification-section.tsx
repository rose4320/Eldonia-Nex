import Image from "next/image";
import { LpSectionTitle } from "@/components/ui/lp-section-title";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_FAN_NOTIFICATION } from "@/lib/lp/content";

export function LpFanNotificationSection() {
  return (
    <section id="fan" className="scroll-mt-24 px-3 py-5 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1240px]">
        <LpSectionTitle className="mb-2">{LP_FAN_NOTIFICATION.eyebrow}</LpSectionTitle>
        <h2 className="mx-auto max-w-[36rem] whitespace-pre-line text-center font-display text-lg font-bold leading-tight tracking-wide text-[#f8f1df] sm:text-xl">
          {LP_FAN_NOTIFICATION.title}
        </h2>
        <p className="mx-auto mt-2 mb-4 max-w-[40rem] text-center text-xs leading-6 text-[#d8c8a8] sm:text-sm">
          {LP_FAN_NOTIFICATION.lead}
        </p>

        <div className="lp-fan-panel overflow-hidden">
          <span className="lp-panel-corner lp-panel-corner--top-left" aria-hidden />
          <span className="lp-panel-corner lp-panel-corner--top-right" aria-hidden />
          <span className="lp-panel-corner lp-panel-corner--bottom-left" aria-hidden />
          <span className="lp-panel-corner lp-panel-corner--bottom-right" aria-hidden />

          <div className="lp-fan-scene relative min-h-[11.5rem] sm:min-h-[12.5rem] lg:min-h-[13.5rem]">
            <Image
              src={LP_ASSETS.fanMail}
              alt=""
              fill
              sizes="(max-width: 1240px) 100vw, 1240px"
              className="object-cover object-[22%_42%] sm:object-[26%_40%]"
              priority={false}
            />
            <div className="lp-fan-scene__veil" aria-hidden />

            <div className="relative z-1 flex h-full min-h-[11.5rem] items-center justify-end px-4 py-4 sm:min-h-[12.5rem] sm:px-7 sm:py-5 lg:min-h-[13.5rem] lg:px-9">
              <div className="lp-fan-copy w-full max-w-[32rem] text-left">
                <ul className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                  {LP_FAN_NOTIFICATION.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-left text-sm leading-6 text-[#f0e6d0] sm:text-base sm:leading-7"
                    >
                      <span className="mt-0.5 shrink-0 text-[#d6a84f]" aria-hidden>
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs leading-6 text-[#cbbfa8] sm:text-sm sm:leading-7">
                  {LP_FAN_NOTIFICATION.note}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
