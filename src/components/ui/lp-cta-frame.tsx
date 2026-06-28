import Image from "next/image";
import type { ReactNode } from "react";
import { LP_ASSETS } from "@/lib/lp/assets";

type LpCtaFrameProps = {
  children: ReactNode;
};

export function LpCtaFrame({ children }: LpCtaFrameProps) {
  return (
    <div className="lp-cta-frame relative">
      <div className="lp-cta-frame__crest pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
        <Image src={LP_ASSETS.logo} alt="" width={44} height={44} className="rounded-full" />
      </div>

      <div className="lp-cta-frame__inner relative overflow-hidden">
        <div className="lp-cta-frame__bg" aria-hidden />
        <div className="relative z-10 p-6 sm:p-10 lg:p-12">{children}</div>
      </div>
    </div>
  );
}
