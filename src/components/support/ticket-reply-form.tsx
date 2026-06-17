"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContent } from "@/components/providers/locale-provider";
import { createClient } from "@/lib/supabase/client";

type TicketReplyFormProps = {
  ticketId: string;
  userId: string;
  authorName: string;
};

export function TicketReplyForm({
  ticketId,
  userId,
  authorName,
}: TicketReplyFormProps) {
  const router = useRouter();
  const { forms } = useContent();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("support_ticket_messages")
      .insert({
        ticket_id: ticketId,
        author_user_id: userId,
        author_name: authorName,
        body: body.trim(),
      });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setBody("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="reply" className="eldonia-label">
        {forms.ticketReplyTitle}
      </label>
      <textarea
        id="reply"
        required
        rows={4}
        maxLength={5000}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        className="eldonia-input"
      />
      {error && <p className="eldonia-alert-error">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-fit eldonia-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? forms.ticketReplySubmitting : forms.ticketReplySubmit}
      </button>
    </form>
  );
}
