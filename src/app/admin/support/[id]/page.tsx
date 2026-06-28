import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categoryLabel,
  formatDateTime,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
} from "@/lib/support/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminSupportTicketPage({ params }: Props) {
  const { id } = await params;
  const locale = await getUiLocale();
  const admin = createAdminClient();

  if (!admin) {
    return (
      <p className="text-sm text-[var(--eldonia-text-dim)]">
        Service role key is not configured.
      </p>
    );
  }

  const { data: ticket } = await admin
    .from("support_tickets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!ticket) {
    notFound();
  }

  const { data: messages } = await admin
    .from("support_ticket_messages")
    .select("id, body, is_staff, created_at")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-6">
      <Link href="/admin/support" className="eldonia-link text-sm">
        ← Support inbox
      </Link>

      <header className="space-y-2">
        <p className="eldonia-eyebrow">{ticket.ticket_number}</p>
        <h2 className="font-display text-2xl text-[var(--eldonia-gold-light)]">
          {ticket.subject}
        </h2>
        <p className="text-sm text-[var(--eldonia-text-muted)]">
          {categoryLabel(ticket.category, locale)} ·{" "}
          {TICKET_STATUS_LABELS[ticket.status as keyof typeof TICKET_STATUS_LABELS]} ·{" "}
          {TICKET_PRIORITY_LABELS[ticket.priority as keyof typeof TICKET_PRIORITY_LABELS]} ·{" "}
          {ticket.contact_email}
        </p>
      </header>

      <section className="eldonia-card space-y-2 text-sm">
        <p>
          <span className="text-[var(--eldonia-text-dim)]">From:</span> {ticket.contact_name}{" "}
          &lt;{ticket.contact_email}&gt;
        </p>
        <p className="text-xs text-[var(--eldonia-text-dim)]">
          Opened {formatDateTime(ticket.created_at, locale)}
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="font-display text-lg text-[var(--eldonia-gold-light)]">Thread</h3>
        {(messages ?? []).length === 0 ? (
          <p className="text-sm text-[var(--eldonia-text-dim)]">No thread messages yet.</p>
        ) : (
          <ul className="space-y-3">
            {(messages ?? []).map((message) => (
              <li
                key={message.id}
                className={`eldonia-card text-sm ${
                  message.is_staff ? "border-[var(--eldonia-gold)]/30" : ""
                }`}
              >
                <p className="text-xs text-[var(--eldonia-text-dim)]">
                  {message.is_staff ? "Staff" : "User"} ·{" "}
                  {formatDateTime(message.created_at, locale)}
                </p>
                <p className="mt-2 whitespace-pre-wrap leading-7">{message.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
