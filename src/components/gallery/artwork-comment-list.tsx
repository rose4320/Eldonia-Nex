"use client";

import { useContent } from "@/components/providers/locale-provider";
import { formatRelativeTime } from "@/lib/community/constants";
import type { ArtworkCommentWithAuthor } from "@/types/database";

type ArtworkCommentListProps = {
  comments: ArtworkCommentWithAuthor[];
};

export function ArtworkCommentList({ comments }: ArtworkCommentListProps) {
  const pages = useContent().pages;

  if (comments.length === 0) {
    return (
      <p className="eldonia-body py-6 text-center text-sm text-eldonia-text-muted">
        {pages.gallery.commentsEmpty}
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => {
        const author =
          comment.profiles?.display_name ??
          comment.profiles?.username ??
          pages.anonymous;
        return (
          <li key={comment.id} className="eldonia-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-eldonia-gold">{author}</p>
              <span className="text-xs text-eldonia-text-dim">
                {formatRelativeTime(comment.created_at)}
              </span>
            </div>
            <p className="eldonia-body mt-3 whitespace-pre-wrap text-sm">
              {comment.body}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
