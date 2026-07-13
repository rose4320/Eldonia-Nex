import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getLpContent } from "@/lib/i18n/content/lp-messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { LP_ASSETS } from "@/lib/lp/assets";

const SOCIAL_ICONS: Record<string, ReactNode> = {
  X: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93zm-1.29 19.5h2.04L6.48 3.24H4.29z" />
    </svg>
  ),
  Discord: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.32 4.37A19.8 19.8 0 0 0 15.45 3a13.6 13.6 0 0 0-.62 1.27 18.3 18.3 0 0 0-5.66 0A13 13 0 0 0 8.55 3a19.7 19.7 0 0 0-4.88 1.37C.55 8.98-.3 13.48.13 17.92a19.9 19.9 0 0 0 6.03 3.05c.49-.66.92-1.36 1.29-2.1-.71-.27-1.39-.6-2.03-.99.17-.13.34-.26.5-.4a14.2 14.2 0 0 0 12.16 0c.16.14.33.27.5.4-.64.39-1.32.72-2.03.99.37.74.8 1.44 1.29 2.1a19.9 19.9 0 0 0 6.03-3.05c.5-5.15-.85-9.61-3.55-13.55zM8.02 15.33c-1.18 0-2.15-1.08-2.15-2.42s.95-2.42 2.15-2.42 2.17 1.09 2.15 2.42c0 1.34-.95 2.42-2.15 2.42zm7.96 0c-1.18 0-2.15-1.08-2.15-2.42s.95-2.42 2.15-2.42 2.17 1.09 2.15 2.42c0 1.34-.94 2.42-2.15 2.42z" />
    </svg>
  ),
  YouTube: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.56 9.38.56 9.38.56s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.75 15.52V8.48L15.82 12l-6.07 3.52z" />
    </svg>
  ),
  Email: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.2-8 5.05L4 8.2V6l8 5.05L20 6v2.2z" />
    </svg>
  ),
};

export async function LpFooter() {
  const locale = await getUiLocale();
  const { LP_FOOTER, LP_FOOTER_LINKS } = getLpContent(locale);

  return (
    <footer className="lp-footer bg-[#020817]">
      <div className="lp-footer__divider" aria-hidden>
        <span className="lp-footer__divider-line" />
        <Image
          src={LP_ASSETS.logo}
          alt=""
          width={56}
          height={56}
          className="lp-footer__compass h-auto w-11 opacity-90 sm:w-12"
        />
        <span className="lp-footer__divider-line" />
      </div>
      <div className="mx-auto max-w-[1240px] px-4 py-5 sm:px-6">
        <div className="flex flex-col items-center gap-4">
          <Link href="/lp" className="flex items-center gap-3">
            <span className="font-display text-sm tracking-[0.14em] text-[#f8f1df]">
              Eldonia–Nex
            </span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2" aria-label="Footer">
            {LP_FOOTER_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-display text-[0.65rem] tracking-[0.1em] text-[#9e927d] hover:text-[#f0c978]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-2">
            {LP_FOOTER.social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="flex h-8 w-8 items-center justify-center rounded border border-[#d6a84f]/30 text-[#cbbfa8] transition-colors hover:border-[#d6a84f]/60 hover:text-[#f8f1df]"
                aria-label={item.label}
              >
                {SOCIAL_ICONS[item.label] ?? item.label[0]}
              </a>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-[0.65rem] text-[#9e927d]/70">{LP_FOOTER.copyright}</p>
      </div>
    </footer>
  );
}
