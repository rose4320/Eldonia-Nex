"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { awardUserExp } from "@/lib/exp/award-exp";
import { createClient } from "@/lib/supabase/client";

type ThreadCreateFormProps = {
  boardId: string;
  boardSlug: string;
  userId: string;
};

export function ThreadCreateForm({ boardId, boardSlug, userId }: ThreadCreateFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const { pages } = useContent();
  const community = pages.community;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("community_threads")
      .insert({
        board_id: boardId,
        author_id: userId,
        title: title.trim(),
        body: body.trim(),
        locale,
      })
      .select("id")
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    await awardUserExp(supabase, "community.thread", data.id);
    router.push(`/community/t/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="eldonia-card space-y-4">
      <p className="eldonia-eyebrow">{community.threadCreateEyebrow(boardSlug)}</p>
      <div className="flex flex-col gap-1">
        <label htmlFor="thread-title" className="eldonia-label">
          {community.threadTitle}
        </label>
        <input
          id="thread-title"
          type="text"
          required
          maxLength={200}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="eldonia-input"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="thread-body" className="eldonia-label">
          {community.threadBody}
        </label>
        <textarea
          id="thread-body"
          required
          rows={8}
          maxLength={8000}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="eldonia-textarea"
        />
      </div>
      {error && <p className="eldonia-alert-error">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="eldonia-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? community.threadSubmitting : community.threadSubmit}
        </button>
        <button type="button" className="eldonia-btn-ghost" onClick={() => router.back()}>
          {community.cancel}
        </button>
      </div>
    </form>
  );
}
