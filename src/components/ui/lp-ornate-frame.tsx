import Image from "next/image";
import type { ReactNode } from "react";
import { LP_ASSETS } from "@/lib/lp/assets";

type LpOrnateFrameVariant = "page" | "box" | "official";

type LpOrnateFrameProps = {
  children: ReactNode;
  variant?: LpOrnateFrameVariant;
  showCrest?: boolean;
  className?: string;
};

/** Ornate gold frame via border-image (corners stay crisp at any size). */
export function LpOrnateFrame({
  children,
  variant = "box",
  showCrest = false,
  className = "",
}: LpOrnateFrameProps) {
  return (
    <div className={`lp-ornate-frame lp-ornate-frame--${variant} relative ${className}`}>
      {showCrest && (
        <div className="lp-ornate-frame__crest pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
          <Image
            src={LP_ASSETS.logo}
            alt=""
            width={variant === "page" ? 52 : 48}
            height={variant === "page" ? 52 : 48}
            className="rounded-full"
          />
        </div>
      )}

      <div className="lp-ornate-frame__body">{children}</div>
    </div>
  );
}
