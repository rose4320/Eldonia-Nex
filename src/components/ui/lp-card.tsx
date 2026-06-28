import type { ReactNode } from "react";

type LpCardProps = {
  children: ReactNode;
  className?: string;
  glow?: "none" | "purple";
};

export function LpCard({ children, className = "", glow = "none" }: LpCardProps) {
  const glowClass =
    glow === "purple"
      ? "shadow-[0_0_28px_rgba(139,92,246,0.35)] border-violet-400/50"
      : "border-[#c5a059]/35 shadow-[inset_0_1px_0_rgba(232,213,163,0.06)]";

  return (
    <div
      className={`rounded-lg border bg-[#060b14]/92 backdrop-blur-sm ${glowClass} ${className}`}
    >
      {children}
    </div>
  );
}
