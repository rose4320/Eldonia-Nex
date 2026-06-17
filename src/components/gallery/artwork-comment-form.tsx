"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContent } from "@/components/providers/locale-provider";
import { awardUserExp } from "@/lib/exp/award-exp";
import { createClient } from "@/lib/supabase/client";

type ArtworkCommentFormProps = {
  artworkId: string;
  userId: string;
  variant?: "default" | "fixed";
};

export function ArtworkCommentForm({
  artworkId,
  userId,
  variant = "default",
}: ArtworkCommentFormProps) {
  const router = useRouter();
  const pages = useContent().pages;
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("artwork_comments")
      .insert({
        artwork_id: artworkId,
        author_id: userId,
        body: body.trim(),
      })
      .select("id")
      .single();

    if (insertError || !data) {
      setError(insertError?.message ?? "Comment failed.");
      setLoading(false);
      return;
    }

    await awardUserExp(supabase, "comment.create", data.id);
    setBody("");
    setLoading(false);
    router.refresh();
  }

  const isFixed = variant === "fixed";

  return (
    <form
      onSubmit={handleSubmit}
      className={isFixed ? "space-y-2" : "eldonia-card space-y-3"}
    >
      {!isFixed && <h3 className="eldonia-label">{pages.gallery.comments}</h3>}
      <textarea
        required
        rows={isFixed ? 2 : 3}
        maxLength={2000}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder={pages.gallery.commentPlaceholder}
        className="eldonia-textarea"
      />
      {error && <p className="eldonia-alert-error text-xs">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className={`eldonia-btn-primary disabled:cursor-not-allowed disabled:opacity-60 ${
          isFixed ? "w-full" : "w-fit"
        }`}
      >
        {loading ? pages.gallery.commentSending : pages.gallery.commentSubmit}
      </button>
    </form>
  );
}
