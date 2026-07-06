"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LpButton } from "@/components/ui/lp-button";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_NAV } from "@/lib/lp/content";

export function LpHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`lp-header absolute inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "lp-header--scrolled border-b border-[#d6a84f]/25 bg-[#020817]/92 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-[76px]">
        <Link href="/lp" className="flex shrink-0 items-center gap-3">
          <Image
            src={LP_ASSETS.logo}
            alt="Eldonia–Nex"
            width={48}
            height={48}
            className="bg-[#020817]/70"
            priority
          />
          <span className="flex flex-col items-center text-center leading-none">
            <span className="font-display text-base font-semibold tracking-[0.12em] text-[#f8f1df] sm:text-lg">
              Eldonia–Nex
            </span>
            <span className="mt-1 font-display text-[0.52rem] tracking-[0.18em] text-[#d8c8a8]/75 uppercase sm:text-[0.58rem]">
              A Fantasy Nexus for Creators
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {LP_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded px-2.5 py-2 font-display text-[0.62rem] font-semibold tracking-[0.13em] text-[#d8c8a8] transition hover:text-[#f0c978] lg:text-[0.68rem]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/auth/login?redirect_to=%2F"
            className="hidden rounded px-3 py-2 font-display text-[0.62rem] font-semibold tracking-[0.14em] text-[#d8c8a8] uppercase transition hover:text-[#f0c978] sm:inline-flex"
          >
            Login
          </Link>

          <LpButton href="/auth/signup?redirect_to=%2F" variant="outline" className="hidden px-4 py-2 text-[0.62rem] sm:inline-flex">
            Join Beta
          </LpButton>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-[#d6a84f]/45 text-[#f8f1df] lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="lp-mobile-nav"
            aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="lp-mobile-nav"
          className="border-t border-[#d6a84f]/20 bg-[#020817]/96 px-4 py-4 backdrop-blur-md lg:hidden"
          aria-label="Mobile"
        >
          <ul className="space-y-1">
            {LP_NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded px-3 py-2.5 font-display text-xs tracking-[0.12em] text-[#d8c8a8] hover:bg-[#d6a84f]/8 hover:text-[#f0c978]"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/auth/login?redirect_to=%2F"
                className="block rounded border border-[#d6a84f]/40 px-3 py-2.5 text-center font-display text-[0.65rem] font-semibold tracking-[0.14em] text-[#f8f1df] uppercase transition hover:border-[#d6a84f] hover:text-[#f0c978]"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </li>
            <li>
              <LpButton href="/auth/signup?redirect_to=%2F" variant="outline" className="w-full text-[0.65rem]">
                Join Beta
              </LpButton>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

