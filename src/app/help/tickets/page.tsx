import Link from "next/link";
import { redirect } from "next/navigation";
import { HelpNav } from "@/components/support/help-nav";
import { TicketStatusBadge } from "@/components/support/ticket-status-badge";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  categoryLabel,
  formatDateTime,
  type SupportTicketStatus,
} from "@/lib/support/constants";
import { createClient } from "@/lib/supabase/server";

export default async function TicketsPage() {
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
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main">
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-4">
            <h1 className="eldonia-heading eldonia-heading-lg">マイチケット</h1>
            <p className="eldonia-body text-sm">問い合わせ履歴とステータスを確認できます。</p>
            <HelpNav current="/help/tickets" />
          </div>
          <Link
            href="/help/contact"
            className="eldonia-btn-primary"
          >
            新規問い合わせ
          </Link>
        </section>

        {!tickets || tickets.length === 0 ? (
          <section className="eldonia-card eldonia-card-dashed px-8 py-16 text-center">
            <p className="text-eldonia-text-muted">まだ問い合わせがありません。</p>
            <Link
              href="/help/contact"
              className="mt-4 inline-block text-sm eldonia-link font-medium"
            >
              お問い合わせを作成 →
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
                        {categoryLabel(ticket.category)} · 更新{" "}
                        {formatDateTime(ticket.updated_at)}
                      </p>
                    </div>
                    <TicketStatusBadge status={ticket.status as SupportTicketStatus} />
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
