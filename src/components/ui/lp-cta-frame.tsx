import type { ReactNode } from "react";

type LpCtaFrameProps = {
  children: ReactNode;
};

export function LpCtaFrame({ children }: LpCtaFrameProps) {
  return (
    <div className="lp-cta-frame relative">
      <div className="lp-cta-frame__inner relative overflow-hidden">
        <div className="lp-cta-frame__bg" aria-hidden />
        <div className="relative z-10 p-6 sm:p-10 lg:p-12">{children}</div>
      </div>
    </div>
  );
}
