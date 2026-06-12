import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { HelpNav } from "@/components/support/help-nav";
import { TicketReplyForm } from "@/components/support/ticket-reply-form";
import { TicketStatusBadge } from "@/components/support/ticket-status-badge";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  categoryLabel,
  formatDateTime,
  type SupportTicketStatus,
} from "@/lib/support/constants";
import { createClient } from "@/lib/supabase/server";

type TicketDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
};

export default async function TicketDetailPage({
  params,
  searchParams,
}: TicketDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect_to=/help/tickets/${id}`);
  }

  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!ticket) {
    notFound();
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, username")
    .eq("id", user.id)
    .single();

  const authorName =
    profile?.display_name ?? profile?.username ?? user.email ?? "ユーザー";

  const { data: messages } = await supabase
    .from("support_ticket_messages")
    .select("*")
    .eq("ticket_id", ticket.id)
    .order("created_at", { ascending: true });

  const canReply = !["resolved", "closed"].includes(ticket.status);

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main eldonia-main-narrow">
        <div>
          <Link
            href="/help/tickets"
            className="eldonia-link text-sm"
          >
            ← マイチケット一覧
          </Link>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-eldonia-text-muted">{ticket.ticket_number}</p>
              <h1 className="mt-1 eldonia-heading eldonia-heading-sm">{ticket.subject}</h1>
              <p className="mt-2 text-sm text-eldonia-text-muted">
                {categoryLabel(ticket.category)} · 作成 {formatDateTime(ticket.created_at)}
              </p>
            </div>
            <TicketStatusBadge status={ticket.status as SupportTicketStatus} />
          </div>
          <HelpNav current="/help/tickets" />
        </div>

        {query.created === "1" && (
          <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            お問い合わせを受け付けました。サポートチームからの返信をお待ちください。
          </p>
        )}

        <section className="space-y-4">
          {(messages ?? []).map((message) => (
            <article
              key={message.id}
              className={`rounded-2xl border p-5 shadow-sm ${
                message.is_staff
                  ? "border-eldonia-gold/30 bg-eldonia-gold/5"
                  : "border-eldonia-gold/20 bg-eldonia-surface-elevated"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-eldonia-gold-light">
                  {message.author_name}
                  {message.is_staff && (
                    <span className="ml-2 text-xs font-semibold text-eldonia-gold">
                      サポート
                    </span>
                  )}
                </p>
                <time className="text-xs text-eldonia-text-muted">
                  {formatDateTime(message.created_at)}
                </time>
              </div>
              <p className="mt-3 whitespace-pre-wrap eldonia-body text-sm">
                {message.body}
              </p>
            </article>
          ))}
        </section>

        {canReply ? (
          <section className="eldonia-card">
            <TicketReplyForm
              ticketId={ticket.id}
              userId={user.id}
              authorName={authorName}
            />
          </section>
        ) : (
          <p className="rounded-lg bg-eldonia-surface px-4 py-3 eldonia-body text-sm">
            このチケットは {ticket.status === "resolved" ? "解決済み" : "クローズ"}
            です。追加のご質問は新規お問い合わせをご利用ください。
          </p>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
