import Image from "next/image";
import Link from "next/link";
import { LpButton } from "@/components/ui/lp-button";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_NAV } from "@/lib/lp/content";

export function LpHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#c5a059]/20 bg-[#020408]/94 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src={LP_ASSETS.logo}
            alt="Eldonia–Nex"
            width={40}
            height={40}
            className="rounded-full ring-1 ring-[#c5a059]/50"
            priority
          />
          <span className="font-display text-sm font-semibold tracking-[0.14em] text-[#e8d5a3] sm:text-base">
            Eldonia–Nex
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LP_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded px-3 py-2 font-display text-[0.65rem] font-semibold tracking-[0.14em] text-[#9a8b6a] transition hover:bg-[#c5a059]/8 hover:text-[#e8d5a3] lg:text-xs"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <LpButton href="/auth/signup" variant="outline" className="shrink-0 px-4 py-2 text-[0.65rem]">
          Join Beta
        </LpButton>
      </div>
    </header>
  );
}
