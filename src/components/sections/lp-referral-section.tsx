import { LpOrnateBox } from "@/components/ui/lp-ornate-box";
import { getLpContent } from "@/lib/i18n/content/lp-messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";

export async function LpReferralSection() {
  const locale = await getUiLocale();
  const { LP_REFERRAL } = getLpContent(locale);

  return (
    <section className="px-3 py-5 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1240px]">
        <LpOrnateBox className="lp-referral-panel grid items-center gap-5 p-4 sm:grid-cols-[auto_1fr_auto] sm:p-5">
          <div className="mx-auto flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-[#d6a84f]/70 bg-gradient-to-br from-[#d6a84f]/30 to-[#8b6424]/20 text-center shadow-[inset_0_0_22px_rgba(214,168,79,0.2),0_0_22px_rgba(214,168,79,0.12)]">
            <span className="whitespace-pre-line font-display text-[0.65rem] font-bold leading-tight tracking-wider text-[#f8f1df] sm:text-xs">
              {LP_REFERRAL.badge}
            </span>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="font-display text-base font-semibold leading-relaxed tracking-wide text-[#f8f1df] sm:text-lg">
              {LP_REFERRAL.title}
            </h2>
            <p className="mt-2 text-xs leading-6 text-[#9e927d] sm:text-sm">{LP_REFERRAL.body}</p>
            <p className="mt-2 text-xs text-[#7c5cff]/90">{LP_REFERRAL.note}</p>
          </div>

          <div className="hidden items-center justify-center gap-3 sm:flex" aria-hidden>
            <span className="text-3xl text-[#d6a84f]">●●</span>
            <span className="font-display text-[#d6a84f]">→</span>
            <span className="rounded border border-[#d6a84f]/40 bg-[#d6a84f]/10 px-3 py-2 font-display text-sm text-[#f8f1df]">
              10%
            </span>
            <span className="text-2xl text-[#d6a84f]">◎</span>
          </div>
        </LpOrnateBox>
      </div>
    </section>
  );
}
