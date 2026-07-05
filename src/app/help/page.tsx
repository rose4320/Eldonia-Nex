import Link from "next/link";
import { HelpNav } from "@/components/support/help-nav";
import { PageIntro } from "@/components/layout/page-intro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SLA_INFO } from "@/lib/support/constants";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { PAGE_ICONS } from "@/lib/layout/module-icons";
import { createClient } from "@/lib/supabase/server";

export default async function HelpPage() {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <PageIntro
            eyebrow={t.help.eyebrow}
            title={t.help.heading}
            lead={t.help.lead}
            iconSrc={PAGE_ICONS.help}
          />
          <HelpNav current="/help" />
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {t.help.links.filter((link) => !link.requiresAuth || user).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="eldonia-card transition-shadow hover:shadow-md"
            >
              <span className="text-2xl">{link.icon}</span>
              <h2 className="mt-3 font-display text-lg font-semibold tracking-wide text-eldonia-gold-light">
                {link.title}
              </h2>
              <p className="eldonia-body mt-2 text-sm">{link.description}</p>
            </Link>
          ))}
          {!user && (
            <Link
              href="/auth/login?redirect_to=/help/tickets"
              className="eldonia-card eldonia-card-dashed rounded-2xl border border-dashed border-eldonia-gold/40 p-6 transition-colors hover:border-eldonia-gold/60"
            >
              <span className="text-2xl">🎫</span>
              <h2 className="mt-3 font-display text-lg font-semibold tracking-wide text-eldonia-gold-light">
                {t.help.ticketsLoginTitle}
              </h2>
              <p className="mt-2 text-sm text-eldonia-gold">{t.help.ticketsLoginLead}</p>
            </Link>
          )}
        </section>

        <section className="eldonia-card">
          <h2 className="font-display text-lg font-semibold tracking-wide text-eldonia-gold-light">
            {t.help.slaHeading}
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="eldonia-label">{t.help.slaFirstResponse}</dt>
              <dd className="mt-1 text-sm text-eldonia-text">{t.help.slaFirstResponseValue}</dd>
            </div>
            <div>
              <dt className="eldonia-label">{t.help.slaHours}</dt>
              <dd className="mt-1 text-sm text-eldonia-text">{t.help.slaHoursValue}</dd>
            </div>
            <div>
              <dt className="eldonia-label">{t.help.slaEmail}</dt>
              <dd className="mt-1 text-sm text-eldonia-text">
                <a
                  href={`mailto:${SLA_INFO.email}`}
                  className="text-eldonia-gold hover:text-eldonia-gold-light"
                >
                  {SLA_INFO.email}
                </a>
              </dd>
            </div>
          </dl>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
