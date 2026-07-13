import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { EventTicketCard } from "@/components/events/event-ticket-card";
import { EventsToolbar } from "@/components/events/events-toolbar";
import { PageIntro } from "@/components/layout/page-intro";
import { LpSectionRule } from "@/components/ui/lp-section-rule";
import { getUserEventTickets } from "@/lib/events/event-ticket-access";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { MODULE_ICONS } from "@/lib/layout/module-icons";
import { createClient } from "@/lib/supabase/server";

export default async function MyEventTicketsPage() {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const pages = t.pages.events;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect_to=/events/my-tickets");
  }

  const tickets = await getUserEventTickets(user.id);

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />
      <EventsToolbar />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
        <PageIntro
          eyebrow="EVENTS"
          title={pages.myTicketsTitle}
          lead={pages.myTicketsLead}
          iconSrc={MODULE_ICONS.events}
        />
        <LpSectionRule />

        {tickets.length === 0 ? (
          <div className="eldonia-card-dashed rounded-xl px-8 py-16 text-center">
            <p className="eldonia-body">{pages.myTicketsEmpty}</p>
            <Link href="/events" className="eldonia-link mt-4 inline-block text-sm">
              {pages.myTicketsBrowse}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tickets.map((ticket) => (
              <EventTicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
