import type { ReactNode } from "react";
import { LpOrnateFrame } from "@/components/ui/lp-ornate-frame";

type LpGoldFrameProps = {
  children: ReactNode;
  className?: string;
};

export function LpGoldFrame({ children, className = "" }: LpGoldFrameProps) {
  return (
    <LpOrnateFrame variant="box" showCrest className={className}>
      <div className="lp-gold-frame__inner overflow-hidden">{children}</div>
    </LpOrnateFrame>
  );
}
