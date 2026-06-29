import { LpOrnateBox } from "@/components/ui/lp-ornate-box";
import { LP_REFERRAL } from "@/lib/lp/content";

export function LpReferralSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <LpOrnateBox className="grid items-center gap-8 p-6 sm:grid-cols-[auto_1fr_auto] sm:p-8">
          <div className="mx-auto flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-2 border-[#d6a84f]/60 bg-gradient-to-br from-[#d6a84f]/25 to-[#8b6424]/20 text-center shadow-[inset_0_0_20px_rgba(214,168,79,0.15)]">
            <span className="whitespace-pre-line font-display text-[0.65rem] font-bold leading-tight tracking-wider text-[#f8f1df] sm:text-xs">
              {LP_REFERRAL.badge}
            </span>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="font-display text-lg font-semibold leading-relaxed tracking-wide text-[#f8f1df] sm:text-xl">
              {LP_REFERRAL.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#9e927d]">{LP_REFERRAL.body}</p>
            <p className="mt-2 text-xs text-[#7c5cff]/90">{LP_REFERRAL.note}</p>
          </div>

          <div className="hidden items-center justify-center gap-3 sm:flex" aria-hidden>
            <span className="text-3xl">👤</span>
            <span className="font-display text-[#d6a84f]">→</span>
            <span className="rounded border border-[#d6a84f]/40 bg-[#d6a84f]/10 px-3 py-2 font-display text-sm text-[#f8f1df]">
              10%
            </span>
            <span className="text-2xl">🪙</span>
          </div>
        </LpOrnateBox>
      </div>
    </section>
  );
}
