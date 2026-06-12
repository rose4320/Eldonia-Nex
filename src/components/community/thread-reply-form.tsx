"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ThreadReplyFormProps = {
  threadId: string;
  userId: string;
};

export function ThreadReplyForm({ threadId, userId }: ThreadReplyFormProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("community_replies").insert({
      thread_id: threadId,
      author_id: userId,
      body: body.trim(),
      locale: "ja",
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
    <form onSubmit={handleSubmit} className="eldonia-card mt-6 space-y-3">
      <h3 className="eldonia-label">返信する</h3>
      <textarea
        required
        rows={4}
        maxLength={4000}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="メッセージを入力..."
        className="eldonia-textarea"
      />
      {error && <p className="eldonia-alert-error">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="eldonia-btn-primary w-fit disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "送信中..." : "返信を投稿"}
      </button>
    </form>
  );
}
