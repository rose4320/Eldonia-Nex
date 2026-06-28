import Link from "next/link";
import { categoryLabel, TICKET_STATUS_LABELS } from "@/lib/support/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";

export default async function AdminDashboardPage() {
  const locale = await getUiLocale();
  const admin = createAdminClient();
  const openStatuses = ["open", "in_progress", "waiting_user"] as const;

  let openTicketCount = 0;
  let recentTickets: {
    id: string;
    ticket_number: string;
    subject: string;
    status: string;
    category: string;
    created_at: string;
  }[] = [];

  if (admin) {
    const { count } = await admin
      .from("support_tickets")
      .select("*", { count: "exact", head: true })
      .in("status", [...openStatuses]);

    openTicketCount = count ?? 0;

    const { data } = await admin
      .from("support_tickets")
      .select("id, ticket_number, subject, status, category, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    recentTickets = data ?? [];
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-2xl text-[var(--eldonia-gold-light)]">Dashboard</h2>
        <p className="mt-2 text-sm text-[var(--eldonia-text-muted)]">
          Eldonia-Nex operations console at{" "}
          <code className="text-[var(--eldonia-gold)]">/admin</code>
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/support" className="eldonia-card transition-shadow hover:shadow-md">
          <p className="eldonia-label">Open tickets</p>
          <p className="mt-2 font-display text-3xl text-[var(--eldonia-gold-light)]">
            {openTicketCount}
          </p>
        </Link>
        <Link href="/works/manage" className="eldonia-card transition-shadow hover:shadow-md">
          <p className="eldonia-label">Quests</p>
          <p className="mt-2 text-sm text-[var(--eldonia-text-muted)]">Publish & manage Quests</p>
        </Link>
        <div className="eldonia-card opacity-80">
          <p className="eldonia-label">Settings</p>
          <p className="mt-2 text-sm text-[var(--eldonia-text-dim)]">Coming soon</p>
        </div>
      </section>

      <section className="eldonia-card space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-display text-lg text-[var(--eldonia-gold-light)]">Recent tickets</h3>
          <Link href="/admin/support" className="eldonia-link text-sm">
            View all
          </Link>
        </div>
        {recentTickets.length === 0 ? (
          <p className="text-sm text-[var(--eldonia-text-dim)]">No tickets yet.</p>
        ) : (
          <ul className="divide-y divide-[var(--eldonia-border)]">
            {recentTickets.map((ticket) => (
              <li key={ticket.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                <div>
                  <Link href={`/admin/support/${ticket.id}`} className="eldonia-link font-medium">
                    {ticket.ticket_number}
                  </Link>
                  <span className="ml-2 text-sm text-[var(--eldonia-text-muted)]">
                    {ticket.subject}
                  </span>
                </div>
                <span className="text-xs text-[var(--eldonia-text-dim)]">
                  {categoryLabel(ticket.category, locale)} ·{" "}
                  {TICKET_STATUS_LABELS[ticket.status as keyof typeof TICKET_STATUS_LABELS] ??
                    ticket.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
