import Image from "next/image";
import type { CSSProperties } from "react";
import { LP_ASSETS, LP_IMAGE_SIZE } from "@/lib/lp/assets";

/** CTA decoration — gold owl asset with CSS glow and spark particles */
export function LpCtaOwl() {
  return (
    <div className="lp-cta-owl" aria-hidden>
      <div className="lp-cta-owl__aura" />
      <div className="lp-cta-owl__ground" />

      <div className="lp-cta-owl__figure">
        <Image
          src={LP_ASSETS.owl}
          alt=""
          width={LP_IMAGE_SIZE.owl.width}
          height={LP_IMAGE_SIZE.owl.height}
          className="lp-cta-owl__image"
          sizes="(max-width: 1024px) 260px, 280px"
          priority={false}
        />
      </div>

      <div className="lp-cta-owl__sparks">
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            key={index}
            className="lp-cta-owl__spark"
            style={
              {
                left: `${12 + (index % 4) * 16}%`,
                animationDelay: `${index * 0.15}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
