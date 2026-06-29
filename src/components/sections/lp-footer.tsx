import Image from "next/image";
import Link from "next/link";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_FOOTER, LP_FOOTER_LINKS } from "@/lib/lp/content";

export function LpFooter() {
  return (
    <footer className="lp-footer bg-[#020817]">
      <div className="lp-footer__divider" aria-hidden>
        <span className="lp-footer__divider-line" />
        <Image src={LP_ASSETS.logo} alt="" width={28} height={28} className="shrink-0 rounded-full" />
        <span className="lp-footer__divider-line" />
      </div>
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src={LP_ASSETS.logo} alt="" width={36} height={36} className="rounded-full" />
            <span className="font-display text-sm tracking-[0.14em] text-[#f8f1df]">
              Eldonia–Nex
            </span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2" aria-label="Footer">
            {LP_FOOTER_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-display text-[0.65rem] tracking-[0.1em] text-[#9e927d] hover:text-[#f0c978]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-3">
            {LP_FOOTER.social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded border border-[#d6a84f]/30 text-[0.65rem] text-[#9e927d] hover:border-[#d6a84f]/60 hover:text-[#f8f1df]"
                aria-label={item.label}
              >
                {item.label === "X" ? "𝕏" : item.label[0]}
              </a>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-[#9e927d]/70">{LP_FOOTER.copyright}</p>
      </div>
    </footer>
  );
}
