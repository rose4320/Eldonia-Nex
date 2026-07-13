import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TranslatedContentLine } from "@/components/i18n/content-line";
import { EventCoverFrame } from "@/components/events/event-cover-frame";
import { EventFormatBadge } from "@/components/events/event-format-badge";
import { EventWatchPanel } from "@/components/events/event-watch-panel";
import { EventTicketQr } from "@/components/events/event-ticket-qr";
import { EventTicketPdfActions } from "@/components/events/event-ticket-pdf-actions";
import { EventsToolbar } from "@/components/events/events-toolbar";
import {
  CATEGORY_ICONS,
  formatEventDate,
} from "@/lib/events/constants";
import { getValidTicketForEvent } from "@/lib/events/event-ticket-access";
import { getEvent } from "@/lib/events/get-events";
import { eventHasStream, getStreamAccessState } from "@/lib/events/stream-access";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { inferSourceLocale } from "@/lib/translation/infer-source-locale";
import { createClient } from "@/lib/supabase/server";

type WatchPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventWatchPage({ params }: WatchPageProps) {
  const { id } = await params;
  const locale = await getUiLocale();
  const pages = getContent(locale).pages.events;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  if (!eventHasStream(event)) {
    redirect(`/events/${id}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect_to=/events/${id}/watch`);
  }

  const ticket = await getValidTicketForEvent(user.id, id);
  if (!ticket) {
    redirect(`/events/${id}`);
  }

  const access = getStreamAccessState(event);
  const date = formatEventDate(event.starts_at, locale);
  const icon = CATEGORY_ICONS[event.category] ?? "◆";
  const titleLocale = inferSourceLocale(event.title);
  const opensAtLabel =
    access.opensAt?.toLocaleString(
      locale === "ja" ? "ja-JP" : locale === "ko" ? "ko-KR" : locale === "zh-CN" ? "zh-CN" : "en-US",
      { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" },
    ) ?? null;

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <EventsToolbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <Link href="/events/my-tickets" className="eldonia-link text-sm">
          {pages.watchBack}
        </Link>

        <div className="eldonia-card mt-6 overflow-hidden p-0">
          <div className="flex aspect-[21/9] max-h-64 items-center justify-center bg-[var(--eldonia-surface)]">
            <EventCoverFrame
              src={event.cover_image_url}
              alt={event.title}
              placeholder={<span className="text-6xl opacity-80">{icon}</span>}
              variant="hero"
            />
          </div>
          <div className="space-y-4 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <EventFormatBadge format={event.format} locale={locale} />
              <span className="eldonia-hint text-xs">{date.full}</span>
            </div>

            <TranslatedContentLine
              text={event.title}
              sourceLocale={titleLocale}
              locale={locale}
              as="h1"
              className="eldonia-heading eldonia-heading-sm"
              hintClassName="eldonia-localized-hint text-sm"
            />

            <p className="eldonia-label text-xs">{pages.watchHeading}</p>
            <EventWatchPanel
              eventId={event.id}
              phase={access.phase}
              opensAtLabel={opensAtLabel}
            />

            <EventTicketQr
              ticketCode={ticket.ticket_code}
              qrToken={ticket.qr_token}
              codeLabel={pages.ticketCodeLabel}
              scanHint={pages.ticketQrScanHint}
            />

            <EventTicketPdfActions
              ticketId={ticket.id}
              className="eldonia-btn-secondary text-xs"
              align="center"
            />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
