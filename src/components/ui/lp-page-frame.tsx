import type { ReactNode } from "react";
import { LpOrnateFrame } from "@/components/ui/lp-ornate-frame";

type LpPageFrameProps = {
  children: ReactNode;
};

export function LpPageFrame({ children }: LpPageFrameProps) {
  return (
    <div className="lp-page-frame mx-auto w-full max-w-[1440px] px-2 sm:px-4 lg:px-6">
      <LpOrnateFrame variant="page" showCrest className="lp-page-frame__shell">
        {children}
      </LpOrnateFrame>
    </div>
  );
}
