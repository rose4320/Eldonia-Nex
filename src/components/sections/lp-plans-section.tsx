import { LpButton } from "@/components/ui/lp-button";
import { LpCard } from "@/components/ui/lp-card";
import { LpSectionTitle } from "@/components/ui/lp-section-title";
import { LP_PLANS } from "@/lib/lp/content";

export function LpPlansSection() {
  return (
    <section id="plans" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <LpSectionTitle className="mb-10">Plans</LpSectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {LP_PLANS.map((plan) => (
            <LpCard
              key={plan.id}
              glow={plan.featured ? "purple" : "none"}
              hover={!plan.featured}
              className={`relative flex flex-col p-5 ${plan.featured ? "lg:-mt-2 lg:pb-7" : ""}`}
            >
              {"badge" in plan && plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-[#7c5cff]/60 bg-[#1a1035]/95 px-3 py-0.5 text-[0.65rem] font-semibold tracking-wider text-[#c4b5fd]">
                  {plan.badge}
                </span>
              )}
              <p className="font-display text-lg font-semibold tracking-wider text-[#f8f1df]">
                {plan.name}
              </p>
              <p className="mt-2 font-display text-2xl text-[#d6a84f]">
                {plan.price}
                {plan.period && (
                  <span className="mt-1 block text-sm font-normal text-[#9e927d]">{plan.period}</span>
                )}
              </p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-xs leading-5 text-[#d8c8a8] sm:text-sm"
                  >
                    <span className="text-[#d6a84f]" aria-hidden>
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <LpButton
                  href={plan.href}
                  variant={plan.featured ? "purple" : plan.id === "free" ? "primary" : "outline"}
                  className="w-full text-[0.65rem]"
                >
                  {plan.cta}
                </LpButton>
              </div>
            </LpCard>
          ))}
        </div>
      </div>
    </section>
  );
}
