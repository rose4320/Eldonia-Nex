import Link from "next/link";
import { redirect } from "next/navigation";
import { HelpNav } from "@/components/support/help-nav";
import { TicketStatusBadge } from "@/components/support/ticket-status-badge";
import { PageIntro } from "@/components/layout/page-intro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  categoryLabel,
  formatDateTime,
  type SupportTicketStatus,
} from "@/lib/support/constants";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { PAGE_ICONS } from "@/lib/layout/module-icons";
import { createClient } from "@/lib/supabase/server";

export default async function TicketsPage() {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect_to=/help/tickets");
  }

  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("id, ticket_number, subject, category, status, created_at, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <PageIntro
            eyebrow={t.help.eyebrow}
            title={t.pages.help.ticketsTitle}
            iconSrc={PAGE_ICONS.help}
            action={
              <Link href="/help/contact" className="eldonia-btn-primary">
                {t.pages.help.ticketsNew}
              </Link>
            }
          />
          <HelpNav current="/help/tickets" />
        </section>

        {!tickets || tickets.length === 0 ? (
          <section className="eldonia-card eldonia-card-dashed px-8 py-16 text-center">
            <p className="text-eldonia-text-muted">{t.pages.help.ticketsEmpty}</p>
            <Link
              href="/help/contact"
              className="mt-4 inline-block text-sm eldonia-link font-medium"
            >
              {t.pages.help.ticketsNew} →
            </Link>
          </section>
        ) : (
          <section className="eldonia-card overflow-hidden p-0">
            <ul className="divide-y divide-eldonia-gold/10">
              {tickets.map((ticket) => (
                <li key={ticket.id}>
                  <Link
                    href={`/help/tickets/${ticket.id}`}
                    className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-eldonia-surface-hover"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs text-eldonia-text-dim">{ticket.ticket_number}</p>
                      <p className="mt-1 truncate font-medium text-eldonia-gold-light">{ticket.subject}</p>
                      <p className="mt-1 text-xs text-eldonia-text-muted">
                        {categoryLabel(ticket.category, locale)} · {t.pages.help.ticketsUpdated}{" "}
                        {formatDateTime(ticket.updated_at, locale)}
                      </p>
                    </div>
                    <TicketStatusBadge status={ticket.status as SupportTicketStatus} locale={locale} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
