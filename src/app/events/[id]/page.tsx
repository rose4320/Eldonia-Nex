import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ContentLine, TagWithHint } from "@/components/i18n/content-line";
import { EventTicketBox } from "@/components/events/event-ticket-box";
import { EventsToolbar } from "@/components/events/events-toolbar";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import {
  CATEGORY_ICONS,
  formatEventDate,
  formatLabel,
  realmLabel,
} from "@/lib/events/constants";
import { getEvent } from "@/lib/events/get-events";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

type EventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const organizerName =
    event.profiles?.display_name ??
    event.profiles?.username ??
    "Eldonia Host";
  const icon = CATEGORY_ICONS[event.category] ?? "◆";
  const date = formatEventDate(event.starts_at, locale);

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <EventsToolbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <Link href="/events" className="eldonia-link text-sm">
          {pages.events.back}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-6">
            <div className="eldonia-card overflow-hidden p-0">
              <div className="flex aspect-[21/9] max-h-80 items-center justify-center bg-[var(--eldonia-surface)]">
                {event.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={event.cover_image_url}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-8xl opacity-80" aria-hidden>
                    {icon}
                  </span>
                )}
              </div>
            </div>

            <section className="eldonia-card">
              <p className="eldonia-eyebrow">{date.full}</p>
              <ContentLine
                text={event.title}
                locale={locale}
                as="h1"
                className="eldonia-heading eldonia-heading-sm mt-2"
                hintClassName="eldonia-localized-hint text-sm"
              />
              <p className="mt-2 text-sm text-[var(--eldonia-text-muted)]">
                {pages.events.organizer}: {organizerName}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {event.is_featured && (
                  <span className="eldonia-badge-bestseller">{pages.events.badgeFeatured}</span>
                )}
                {event.is_nexus_verified && (
                  <span className="eldonia-badge-nexus-prime">{pages.events.badgeVerified}</span>
                )}
              </div>

              <div className="my-6">
                <EldoniaDivider />
              </div>

              <h2 className="eldonia-label">About this chronicle</h2>
              <ContentLine
                text={event.description ?? pages.descriptionPending}
                locale={locale}
                as="p"
                className="eldonia-body mt-3 whitespace-pre-wrap text-sm"
                hintClassName="eldonia-localized-hint text-xs"
              />

              {event.tags.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-[var(--eldonia-border)] px-3 py-1 text-xs text-[var(--eldonia-text-muted)]"
                    >
                      #<TagWithHint text={tag} locale={locale} />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="eldonia-card">
              <h2 className="eldonia-label">{pages.events.venueSection}</h2>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-[var(--eldonia-border)] pb-2">
                  <dt className="text-[var(--eldonia-text-dim)]">{pages.events.labelFormat}</dt>
                  <dd>{formatLabel(event.format, locale)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[var(--eldonia-border)] pb-2">
                  <dt className="text-[var(--eldonia-text-dim)]">{pages.events.labelRealm}</dt>
                  <dd>{realmLabel(event.category, locale)}</dd>
                </div>
                {event.venue_name && (
                  <div className="flex justify-between gap-4 border-b border-[var(--eldonia-border)] pb-2">
                    <dt className="text-[var(--eldonia-text-dim)]">{pages.events.labelVenue}</dt>
                    <dd className="text-right">{event.venue_name}</dd>
                  </div>
                )}
                {event.venue_address && (
                  <div className="flex justify-between gap-4 border-b border-[var(--eldonia-border)] pb-2">
                    <dt className="text-[var(--eldonia-text-dim)]">{pages.events.labelAddress}</dt>
                    <dd className="text-right">{event.venue_address}</dd>
                  </div>
                )}
                {event.online_url && (
                  <div className="flex justify-between gap-4 border-b border-[var(--eldonia-border)] pb-2">
                    <dt className="text-[var(--eldonia-text-dim)]">{pages.events.labelOnline}</dt>
                    <dd className="text-right text-[var(--eldonia-gold-muted)]">
                      {pages.events.urlAfterPurchase}
                    </dd>
                  </div>
                )}
              </dl>
            </section>
          </div>

          <EventTicketBox event={event} isLoggedIn={!!user} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
