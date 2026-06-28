import type { ReactNode } from "react";
import { LpOrnateFrame } from "@/components/ui/lp-ornate-frame";

type LpOrnateBoxProps = {
  children: ReactNode;
  className?: string;
};

export function LpOrnateBox({ children, className = "" }: LpOrnateBoxProps) {
  return (
    <LpOrnateFrame variant="official">
      <div className={`lp-ornate-box__content ${className}`}>{children}</div>
    </LpOrnateFrame>
  );
}
