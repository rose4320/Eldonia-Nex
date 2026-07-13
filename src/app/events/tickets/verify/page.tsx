import { notFound } from "next/navigation";
import { formatTicketCodeDisplay } from "@/lib/events/event-ticket-qr";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createAdminClient } from "@/lib/supabase/admin";

type VerifyPageProps = {
  searchParams: Promise<{ code?: string; t?: string }>;
};

export default async function EventTicketVerifyPage({ searchParams }: VerifyPageProps) {
  const { code, t: qrToken } = await searchParams;
  const locale = await getUiLocale();
  const pages = getContent(locale).pages.events;

  if (!code || !qrToken) {
    notFound();
  }

  const admin = createAdminClient();
  let valid = false;
  let ticketCode = code;

  if (admin) {
    const { data: ticket } = await admin
      .from("event_tickets")
      .select("ticket_code, qr_token, status")
      .eq("ticket_code", code)
      .eq("qr_token", qrToken)
      .maybeSingle();

    valid = Boolean(ticket && ticket.status === "valid");
    if (ticket) ticketCode = ticket.ticket_code;
  }

  return (
    <div className="eldonia-page flex min-h-screen items-center justify-center px-4 py-12">
      <div className="eldonia-card max-w-md space-y-4 p-8 text-center">
        <p className="eldonia-label text-xs uppercase tracking-wider">
          {pages.ticketVerifyHeading}
        </p>
        <p
          className={
            valid
              ? "font-display text-2xl text-[var(--eldonia-gold-light)]"
              : "eldonia-alert-error text-lg"
          }
        >
          {valid ? pages.ticketVerifyValid : pages.ticketVerifyInvalid}
        </p>
        {valid && (
          <p className="eldonia-hint text-sm">
            {pages.ticketCodeLabel}: {formatTicketCodeDisplay(ticketCode)}
          </p>
        )}
      </div>
    </div>
  );
}
