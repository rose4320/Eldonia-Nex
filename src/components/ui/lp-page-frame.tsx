import type { ReactNode } from "react";

type LpPageFrameProps = {
  children: ReactNode;
};

export function LpPageFrame({ children }: LpPageFrameProps) {
  return (
    <div className="lp-page-frame mx-auto w-full">
      <div className="lp-page-frame__shell">{children}</div>
    </div>
  );
}
