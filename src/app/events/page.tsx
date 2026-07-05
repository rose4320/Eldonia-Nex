import Link from "next/link";
import { PageIntro } from "@/components/layout/page-intro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { EventCard } from "@/components/events/event-card";
import { EventsHeroStrip } from "@/components/events/events-hero-strip";
import { EventsSidebar } from "@/components/events/events-sidebar";
import { EventsToolbar } from "@/components/events/events-toolbar";
import { LpSectionRule } from "@/components/ui/lp-section-rule";
import { getEvents } from "@/lib/events/get-events";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { MODULE_ICONS } from "@/lib/layout/module-icons";
import { realmLabel } from "@/lib/events/constants";

type EventsPageProps = {
  searchParams: Promise<{ q?: string; category?: string; when?: string }>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const { q, category = "all", when = "upcoming" } = await searchParams;
  const events = await getEvents({ q, category, when });

  const heading = q?.trim()
    ? t.common.searchResults(q.trim())
    : category !== "all"
      ? realmLabel(category, locale)
      : when === "past"
        ? t.events.headingPast
        : t.events.heading;

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />
      <EventsToolbar query={q} />

      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="EVENTS"
          title={heading}
          lead={t.events.lead}
          iconSrc={MODULE_ICONS.events}
        />

        <LpSectionRule />

        <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
          <EventsSidebar
            activeCategory={category}
            activeWhen={when}
            query={q}
          />

          <div className="flex min-w-0 flex-col gap-8">
            {when !== "past" && <EventsHeroStrip events={events} />}

            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-sm tracking-wider text-[var(--eldonia-gold-muted)] uppercase">
                  {t.common.countItems(events.length, t.events.eventUnit)}
                </h2>
                {(q || category !== "all" || when !== "upcoming") && (
                  <Link href="/events" className="eldonia-link text-sm">
                    {t.common.clearFilter}
                  </Link>
                )}
              </div>

              {events.length === 0 ? (
                <div className="eldonia-card-dashed rounded-xl px-8 py-16 text-center">
                  <p className="eldonia-body">{t.events.empty}</p>
                  <Link href="/events" className="eldonia-link mt-4 inline-block text-sm">
                    {t.events.viewAll}
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
