import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  showSubtitle?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
};

const sizes = {
  sm: { image: 32, title: "text-sm", subtitle: "text-[0.55rem]" },
  md: { image: 40, title: "text-base", subtitle: "text-[0.6rem]" },
  lg: { image: 56, title: "text-xl", subtitle: "text-[0.65rem]" },
  xl: { image: 104, title: "text-2xl", subtitle: "text-[0.72rem]" },
};

export function BrandLogo({
  showSubtitle = false,
  size = "md",
  href = "/home",
}: BrandLogoProps) {
  const config = sizes[size];

  return (
    <Link href={href} className="group flex items-center gap-3">
      <Image
        src="/logo.png"
        alt="ELDONIA NEX"
        width={config.image}
        height={config.image}
        className="rounded-md object-contain transition group-hover:brightness-110"
        priority
      />
      <div className="leading-tight text-center">
        <span
          className={`font-display block font-bold tracking-[0.18em] text-[#d8ab45] ${config.title}`}
        >
          ELDONIA NEX
        </span>
        {showSubtitle && (
          <span
            className={`font-display block tracking-[0.22em] text-[#cca03f] uppercase ${config.subtitle}`}
          >
            A Fantasy Nexus for Creators
          </span>
        )}
      </div>
    </Link>
  );
}
