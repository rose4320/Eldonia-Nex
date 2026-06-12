"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ThreadCreateFormProps = {
  boardId: string;
  boardSlug: string;
  userId: string;
};

export function ThreadCreateForm({ boardId, boardSlug, userId }: ThreadCreateFormProps) {
  const router = useRouter();
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
        locale: "ja",
      })
      .select("id")
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push(`/community/t/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="eldonia-card space-y-4">
      <p className="eldonia-eyebrow">新規スレッド · {boardSlug}</p>
      <div className="flex flex-col gap-1">
        <label htmlFor="thread-title" className="eldonia-label">
          タイトル
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
          本文
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
          {loading ? "投稿中..." : "スレッドを作成"}
        </button>
        <button
          type="button"
          className="eldonia-btn-ghost"
          onClick={() => router.back()}
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
