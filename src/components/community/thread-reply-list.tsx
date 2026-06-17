"use client";

import { formatRelativeTime, LOCALE_LABELS } from "@/lib/community/constants";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import type { CommunityReplyWithAuthor } from "@/types/database";
import { TranslationPanel } from "./translation-panel";

type ThreadReplyListProps = { replies: CommunityReplyWithAuthor[] };

export function ThreadReplyList({ replies }: ThreadReplyListProps) {
  const locale = useLocale();
  const { pages } = useContent();
  const community = pages.community;

  if (replies.length === 0) {
    return (
      <p className="eldonia-body py-8 text-center text-sm">{community.repliesEmpty}</p>
    );
  }

  return (
    <ul className="space-y-4">
      {replies.map((reply) => {
        const author =
          reply.profiles?.display_name ??
          reply.profiles?.username ??
          pages.anonymous;
        return (
          <li key={reply.id} className="eldonia-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-[var(--eldonia-gold-muted)]">{author}</p>
              <span className="text-xs text-[var(--eldonia-text-dim)]">
                {formatRelativeTime(reply.created_at, locale)} ·{" "}
                {LOCALE_LABELS[reply.locale] ?? reply.locale}
              </span>
            </div>
            <p className="eldonia-body mt-3 whitespace-pre-wrap text-sm">{reply.body}</p>
            <TranslationPanel text={reply.body} sourceLocale={reply.locale} compact />
          </li>
        );
      })}
    </ul>
  );
}
