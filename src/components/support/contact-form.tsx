"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { createClient } from "@/lib/supabase/client";
import { supportTicketCategoryLabel } from "@/lib/i18n/taxonomy";
import { TICKET_CATEGORIES, type SupportTicketCategory } from "@/lib/support/constants";

type ContactFormProps = {
  userId?: string;
  defaultName?: string;
  defaultEmail?: string;
};

export function ContactForm({
  userId,
  defaultName = "",
  defaultEmail = "",
}: ContactFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const { forms } = useContent();
  const contact = forms.contact;
  const categories = TICKET_CATEGORIES.map((item) => ({
    value: item.value,
    label: supportTicketCategoryLabel(item.value, locale),
  }));
  const [contactName, setContactName] = useState(defaultName);
  const [contactEmail, setContactEmail] = useState(defaultEmail);
  const [category, setCategory] = useState<SupportTicketCategory>("other");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const { data: ticket, error: ticketError } = await supabase
      .from("support_tickets")
      .insert({
        user_id: userId ?? null,
        contact_name: contactName.trim(),
        contact_email: contactEmail.trim(),
        category,
        subject: subject.trim(),
      })
      .select("id, ticket_number")
      .single();

    if (ticketError || !ticket) {
      setError(ticketError?.message ?? contact.errSave);
      setLoading(false);
      return;
    }

    const { error: messageError } = await supabase
      .from("support_ticket_messages")
      .insert({
        ticket_id: ticket.id,
        author_user_id: userId ?? null,
        author_name: contactName.trim(),
        body: body.trim(),
      });

    if (messageError) {
      setError(messageError.message);
      setLoading(false);
      return;
    }

    if (userId) {
      router.push(`/help/tickets/${ticket.id}?created=1`);
    } else {
      router.push(
        `/help/contact/success?ticket=${encodeURIComponent(ticket.ticket_number)}`,
      );
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="contact_name" className="eldonia-label">
            {contact.name}
          </label>
          <input
            id="contact_name"
            type="text"
            required
            maxLength={100}
            value={contactName}
            onChange={(event) => setContactName(event.target.value)}
            className="eldonia-input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="contact_email" className="eldonia-label">
            {contact.email}
          </label>
          <input
            id="contact_email"
            type="email"
            required
            maxLength={320}
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            className="eldonia-input"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="category" className="eldonia-label">
          {contact.category}
        </label>
        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value as SupportTicketCategory)}
          className="eldonia-select"
        >
          {categories.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="subject" className="eldonia-label">
          {contact.subject}
        </label>
        <input
          id="subject"
          type="text"
          required
          maxLength={200}
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className="eldonia-select"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="body" className="eldonia-label">
          {contact.body}
        </label>
        <textarea
          id="body"
          required
          rows={6}
          maxLength={5000}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={contact.bodyPlaceholder}
          className="eldonia-select"
        />
      </div>

      {error && <p className="eldonia-alert-error">{error}</p>}

      <button type="submit" disabled={loading} className="eldonia-btn-primary w-fit">
        {loading ? contact.submitting : contact.submit}
      </button>
    </form>
  );
}
