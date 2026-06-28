import Link from "next/link";
import {
  categoryLabel,
  formatDateTime,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
} from "@/lib/support/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";

export default async function AdminSupportPage() {
  const locale = await getUiLocale();
  const admin = createAdminClient();

  const tickets =
    admin === null
      ? []
      : (
          await admin
            .from("support_tickets")
            .select(
              "id, ticket_number, subject, status, priority, category, contact_email, created_at",
            )
            .order("created_at", { ascending: false })
            .limit(100)
        ).data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-[var(--eldonia-gold-light)]">Support</h2>
        <p className="mt-2 text-sm text-[var(--eldonia-text-muted)]">
          Inbound email integration (Sakura IMAP) will feed this inbox.
        </p>
      </div>

      {!admin && (
        <p className="eldonia-card text-sm text-[var(--eldonia-text-dim)]">
          Service role key is not configured. Set SUPABASE_SECRET_KEY to load tickets.
        </p>
      )}

      <div className="eldonia-card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--eldonia-border)] text-[var(--eldonia-text-dim)]">
              <th className="pb-3 pr-4 font-normal">Ticket</th>
              <th className="pb-3 pr-4 font-normal">Subject</th>
              <th className="pb-3 pr-4 font-normal">Category</th>
              <th className="pb-3 pr-4 font-normal">Status</th>
              <th className="pb-3 pr-4 font-normal">Priority</th>
              <th className="pb-3 font-normal">Created</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[var(--eldonia-text-dim)]">
                  No tickets.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-[var(--eldonia-border)]/60 last:border-0"
                >
                  <td className="py-3 pr-4">
                    <Link href={`/admin/support/${ticket.id}`} className="eldonia-link">
                      {ticket.ticket_number}
                    </Link>
                  </td>
                  <td className="max-w-xs truncate py-3 pr-4">{ticket.subject}</td>
                  <td className="py-3 pr-4">{categoryLabel(ticket.category, locale)}</td>
                  <td className="py-3 pr-4">
                    {TICKET_STATUS_LABELS[ticket.status as keyof typeof TICKET_STATUS_LABELS]}
                  </td>
                  <td className="py-3 pr-4">
                    {TICKET_PRIORITY_LABELS[ticket.priority as keyof typeof TICKET_PRIORITY_LABELS]}
                  </td>
                  <td className="py-3 whitespace-nowrap text-[var(--eldonia-text-dim)]">
                    {formatDateTime(ticket.created_at, locale)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
