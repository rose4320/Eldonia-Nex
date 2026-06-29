import type { ReactNode } from "react";

type LpCardProps = {
  children: ReactNode;
  className?: string;
  glow?: "none" | "purple";
  hover?: boolean;
};

export function LpCard({ children, className = "", glow = "none", hover = false }: LpCardProps) {
  const glowClass =
    glow === "purple"
      ? "shadow-[0_0_32px_rgba(124,92,255,0.38)] border-[#7c5cff]/55"
      : "border-[rgba(214,168,79,0.4)] shadow-[inset_0_1px_0_rgba(240,201,120,0.06)]";

  const hoverClass = hover ? "lp-card--hover" : "";

  return (
    <div
      className={`rounded-xl border bg-[rgba(5,14,30,0.86)] backdrop-blur-md ${glowClass} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
}
