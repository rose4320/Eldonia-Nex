import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HOME_V2_ASSETS } from "@/lib/design/home-v2-assets";
import { getInvestorContent } from "@/lib/i18n/content/investor-messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getUiLocale();
  const copy = getInvestorContent(locale);

  return {
    title: copy.seo.metaTitle,
    description: copy.seo.metaDescription,
    openGraph: {
      title: copy.seo.metaTitle,
      description: copy.seo.metaDescription,
      type: "website",
    },
  };
}

export default async function InvestorsPage() {
  const locale = await getUiLocale();
  const copy = getInvestorContent(locale);

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main eldonia-main-narrow">
        <section className="eldonia-investor-panel space-y-5">
          <p className="eldonia-eyebrow">{copy.hero.eyebrow}</p>
          <h1 className="eldonia-heading eldonia-heading-lg max-w-3xl">{copy.hero.title}</h1>
          <p className="max-w-3xl text-sm leading-7 text-eldonia-text-muted">{copy.hero.lead}</p>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="eldonia-heading text-2xl">{copy.vision.title}</h2>
          <blockquote className="eldonia-manifesto-line text-lg">{copy.vision.quote}</blockquote>
          <p className="text-sm leading-7 text-eldonia-text-muted">{copy.vision.body}</p>
        </section>

        <section className="eldonia-investor-panel mt-14 space-y-6">
          <div>
            <h2 className="eldonia-heading text-2xl">{copy.horizon.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-eldonia-text-muted">
              {copy.horizon.lead}
            </p>
          </div>
          <ol className="eldonia-horizon-timeline">
            {copy.horizon.steps.map((step, index) => (
              <li key={step.num} className="eldonia-horizon-step">
                <div className="eldonia-horizon-step__marker" aria-hidden="true">
                  <span>{step.num}</span>
                  {index < copy.horizon.steps.length - 1 && (
                    <span className="eldonia-horizon-step__line" />
                  )}
                </div>
                <article className="eldonia-horizon-step__body">
                  <div className="eldonia-horizon-step__meta">
                    <span className="eldonia-horizon-step__year">
                      {copy.horizon.targetLabel}: {step.targetYear}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-eldonia-gold-light">
                    {step.title}
                  </h3>
                  <p className="eldonia-body mt-2 text-sm">{step.body}</p>
                  <div className="eldonia-horizon-kpis">
                    <p className="eldonia-horizon-kpis__label">{copy.horizon.kpiLabel}</p>
                    <ul className="eldonia-horizon-kpis__list">
                      {step.kpis.map((kpi) => (
                        <li key={kpi}>{kpi}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ol>
          <p className="text-xs leading-6 text-eldonia-text-dim">{copy.horizon.disclaimer}</p>
          <p className="eldonia-manifesto-line text-sm">{copy.horizon.closing}</p>
        </section>

        <section className="mt-14 space-y-6">
          <div>
            <h2 className="eldonia-heading text-2xl">{copy.governance.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-eldonia-text-muted">
              {copy.governance.lead}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {copy.governance.items.map((item) => (
              <article key={item.title} className="eldonia-card">
                <h3 className="font-display text-base font-semibold text-eldonia-gold-light">
                  {item.title}
                </h3>
                <p className="eldonia-body mt-2 text-sm">{item.body}</p>
              </article>
            ))}
          </div>
          <p className="text-xs leading-6 text-eldonia-text-dim">{copy.governance.disclaimer}</p>
        </section>

        <section className="mt-14 space-y-6">
          <div>
            <h2 className="eldonia-heading text-2xl">{copy.business.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-eldonia-text-muted">
              {copy.business.lead}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.business.pillars.map((pillar) => (
              <article key={pillar.title} className="eldonia-investor-card">
                <span>{copy.business.moduleBadge}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 space-y-6">
          <div>
            <h2 className="eldonia-heading text-2xl">{copy.revenue.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-eldonia-text-muted">
              {copy.revenue.lead}
            </p>
          </div>
          <div className="eldonia-revenue-loop">
            {copy.revenue.steps.map((step) => (
              <article key={step.num} className="eldonia-revenue-step">
                <span>{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
            <article className="eldonia-referral-card">
              <h3>{copy.revenue.referralTitle}</h3>
              <p>{copy.revenue.referralNote}</p>
            </article>
          </div>
        </section>

        <section className="mt-14 space-y-6">
          <div>
            <h2 className="eldonia-heading text-2xl">{copy.market.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-eldonia-text-muted">
              {copy.market.lead}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {copy.market.points.map((point) => (
              <article key={point.title} className="eldonia-card">
                <h3 className="font-display text-lg font-semibold text-eldonia-gold-light">
                  {point.title}
                </h3>
                <p className="eldonia-body mt-3 text-sm">{point.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 space-y-6">
          <h2 className="eldonia-heading text-2xl">{copy.moat.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {copy.moat.items.map((item) => (
              <article key={item.title} className="eldonia-investor-card">
                <span>{copy.moat.badge}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 space-y-6">
          <h2 className="eldonia-heading text-2xl">{copy.roadmap.title}</h2>
          <ol className="grid gap-4 md:grid-cols-2">
            {copy.roadmap.phases.map((phase) => (
              <li key={phase.phase} className="eldonia-card">
                <p className="eldonia-eyebrow">{phase.phase}</p>
                <h3 className="mt-2 font-display text-lg font-semibold text-eldonia-gold-light">
                  {phase.title}
                </h3>
                <p className="eldonia-body mt-3 text-sm">{phase.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14 space-y-6">
          <div>
            <h2 className="eldonia-heading text-2xl">{copy.exit.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-eldonia-text-muted">
              {copy.exit.lead}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {copy.exit.paths.map((path) => (
              <article key={path.title} className="eldonia-investor-card">
                <span>{copy.exit.badge}</span>
                <h3>{path.title}</h3>
                <p>{path.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="space-y-6">
            <h2 className="eldonia-heading text-2xl">{copy.benefits.title}</h2>
            <ul className="space-y-4">
              {copy.benefits.items.map((item) => (
                <li key={item.title} className="eldonia-card">
                  <h3 className="font-display text-base font-semibold text-eldonia-gold-light">
                    {item.title}
                  </h3>
                  <p className="eldonia-body mt-2 text-sm">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <aside className="flex flex-col items-center gap-4 lg:sticky lg:top-24">
            <Image
              src={HOME_V2_ASSETS.investorPinBadge}
              alt="ELDONIA NEX supporter pin badge"
              width={220}
              height={220}
              className="drop-shadow-[0_0_24px_rgba(201,168,76,0.25)]"
            />
            <p className="text-center text-xs text-eldonia-text-dim">24-01-0001</p>
          </aside>
        </section>

        <section className="mt-14 space-y-6">
          <div>
            <h2 className="eldonia-heading text-2xl">{copy.categories.title}</h2>
            <p className="mt-3 text-sm leading-7 text-eldonia-text-muted">{copy.categories.lead}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {copy.categories.items.map((cat) => (
              <article key={cat.num} className="eldonia-investor-card">
                <span>{cat.num}</span>
                <h3>{cat.label}</h3>
                <p>{cat.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 space-y-4">
          <h2 className="eldonia-heading text-2xl">{copy.risks.title}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {copy.risks.items.map((item) => (
              <article key={item.title} className="eldonia-card">
                <h3 className="font-display text-base font-semibold text-eldonia-gold-light">
                  {item.title}
                </h3>
                <p className="eldonia-body mt-2 text-sm">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 space-y-4">
          <h2 className="eldonia-heading text-2xl">{copy.faq.title}</h2>
          <dl className="space-y-4">
            {copy.faq.items.map((item) => (
              <div key={item.q} className="eldonia-card">
                <dt className="font-display text-sm font-semibold text-eldonia-gold-light">
                  {item.q}
                </dt>
                <dd className="eldonia-body mt-2 text-sm">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="eldonia-investor-panel mt-14 space-y-5 text-center">
          <h2 className="eldonia-heading text-2xl">{copy.cta.title}</h2>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-eldonia-text-muted">
            {copy.cta.lead}
          </p>
          <p className="text-xs text-eldonia-text-dim">{copy.cta.contactNote}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/help/contact" className="eldonia-btn-primary">
              {copy.cta.primary}
            </Link>
            <Link href="/" className="home-v2-btn home-v2-btn--outline">
              {copy.cta.secondary}
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
