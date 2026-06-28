import Link from "next/link";
import type { ReactNode } from "react";

type LpButtonProps = {
  href?: string;
  variant?: "primary" | "outline" | "purple";
  className?: string;
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
};

const variants = {
  primary:
    "border border-[#c5a059]/80 bg-gradient-to-b from-[#e8d5a3] to-[#c5a059] text-[#1a1208] hover:from-[#f0e0b8] hover:to-[#d4b06a]",
  outline:
    "border border-[#c5a059]/60 bg-transparent text-[#e8d5a3] hover:border-[#c5a059] hover:bg-[#c5a059]/10",
  purple:
    "border border-violet-400/60 bg-gradient-to-b from-violet-600/90 to-violet-800/90 text-white hover:from-violet-500 hover:to-violet-700",
};

export function LpButton({
  href,
  variant = "primary",
  className = "",
  children,
  type = "button",
  onClick,
}: LpButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-5 py-2.5 font-display text-xs font-semibold tracking-[0.14em] transition-colors sm:text-sm";

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
