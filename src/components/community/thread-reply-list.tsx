"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatRelativeTime, LOCALE_LABELS } from "@/lib/community/constants";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { createClient } from "@/lib/supabase/client";
import type { CommunityReplyWithAuthor } from "@/types/database";
import { TranslationPanel } from "./translation-panel";

type ThreadReplyListProps = {
  replies: CommunityReplyWithAuthor[];
  translationCache?: Record<string, string>;
  currentUserId?: string | null;
};

export function ThreadReplyList({
  replies,
  translationCache = {},
  currentUserId = null,
}: ThreadReplyListProps) {
  const router = useRouter();
  const locale = useLocale();
  const { pages } = useContent();
  const community = pages.community;
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(replyId: string) {
    if (!currentUserId) return;
    if (!window.confirm(community.replyDeleteConfirm)) return;

    setError(null);
    setDeletingId(replyId);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("community_replies")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: currentUserId,
      })
      .eq("id", replyId)
      .eq("author_id", currentUserId)
      .is("deleted_at", null);

    setDeletingId(null);
    if (updateError) {
      setError(updateError.message || community.replyDeleteFailed);
      return;
    }
    router.refresh();
  }

  if (replies.length === 0) {
    return (
      <p className="eldonia-body py-8 text-center text-sm">{community.repliesEmpty}</p>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="eldonia-alert-error text-sm">{error}</p>}
      <ul className="space-y-4">
        {replies.map((reply) => {
          const author =
            reply.profiles?.display_name ??
            reply.profiles?.username ??
            pages.anonymous;
          const canDelete =
            Boolean(currentUserId) && reply.author_id === currentUserId;
          return (
            <li key={reply.id} className="eldonia-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-[var(--eldonia-gold-muted)]">{author}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-[var(--eldonia-text-dim)]">
                    {formatRelativeTime(reply.created_at, locale)} ·{" "}
                    {LOCALE_LABELS[reply.locale] ?? reply.locale}
                  </span>
                  {canDelete && (
                    <button
                      type="button"
                      className="eldonia-link text-xs text-[var(--eldonia-danger,#d88)]"
                      disabled={deletingId === reply.id}
                      onClick={() => void handleDelete(reply.id)}
                    >
                      {deletingId === reply.id
                        ? community.replyDeleting
                        : community.replyDelete}
                    </button>
                  )}
                </div>
              </div>
              <TranslationPanel
                key={`reply-${reply.id}-${locale}`}
                text={reply.body}
                sourceLocale={reply.locale}
                compact
                initialTranslated={translationCache[reply.id] ?? null}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
