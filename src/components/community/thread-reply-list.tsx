"use client";

import { formatRelativeTime, LOCALE_LABELS } from "@/lib/community/constants";
import type { CommunityReplyWithAuthor } from "@/types/database";
import { TranslationPanel } from "./translation-panel";

type ThreadReplyListProps = { replies: CommunityReplyWithAuthor[] };

export function ThreadReplyList({ replies }: ThreadReplyListProps) {
  if (replies.length === 0) {
    return (
      <p className="eldonia-body text-sm text-center py-8">
        まだ返信がありません。翻訳 Nexus で多言語返信を読めます。
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {replies.map((reply) => {
        const author =
          reply.profiles?.display_name ?? reply.profiles?.username ?? "匿名";
        return (
          <li key={reply.id} className="eldonia-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-[var(--eldonia-gold-muted)]">{author}</p>
              <span className="text-xs text-[var(--eldonia-text-dim)]">
                {formatRelativeTime(reply.created_at)} ·{" "}
                {LOCALE_LABELS[reply.locale] ?? reply.locale}
              </span>
            </div>
            <p className="eldonia-body mt-3 whitespace-pre-wrap text-sm">{reply.body}</p>
            <TranslationPanel
              text={reply.body}
              sourceLocale={reply.locale}
              compact
            />
          </li>
        );
      })}
    </ul>
  );
}
