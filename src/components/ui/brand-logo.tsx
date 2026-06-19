import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  showSubtitle?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizes = {
  sm: { image: 32, title: "text-sm", subtitle: "text-[0.55rem]" },
  md: { image: 40, title: "text-base", subtitle: "text-[0.6rem]" },
  lg: { image: 56, title: "text-xl", subtitle: "text-[0.65rem]" },
  xl: { image: 66, title: "text-2xl", subtitle: "text-[0.72rem]" },
};

export function BrandLogo({ showSubtitle = false, size = "md" }: BrandLogoProps) {
  const config = sizes[size];

  return (
    <Link href="/" className="group flex items-center gap-3">
      <Image
        src="/logo.png"
        alt="ELDONIA NEX"
        width={config.image}
        height={config.image}
        className="rounded-full ring-1 ring-eldonia-gold/40 transition group-hover:ring-eldonia-gold/70"
        priority
      />
      <div className="leading-tight">
        <span
          className={`font-display block font-bold tracking-[0.18em] text-eldonia-gold-light ${config.title}`}
        >
          ELDONIA NEX
        </span>
        {showSubtitle && (
          <span
            className={`font-display block tracking-[0.22em] text-eldonia-text-dim uppercase ${config.subtitle}`}
          >
            A Fantasy Nexus for Creators
          </span>
        )}
      </div>
    </Link>
  );
}
