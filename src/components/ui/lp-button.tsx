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
    "border border-[#d6a84f]/80 bg-gradient-to-b from-[#f0c978] to-[#d6a84f] text-[#1a1208] hover:from-[#f8dfaa] hover:to-[#e0b868]",
  outline:
    "border border-[#d6a84f]/60 bg-transparent text-[#f8f1df] hover:border-[#d6a84f] hover:bg-[#d6a84f]/10",
  purple:
    "border border-[#7c5cff]/60 bg-gradient-to-b from-[#7c5cff]/90 to-[#5a3fd4]/90 text-white hover:from-[#8f72ff] hover:to-[#6b52e8]",
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
