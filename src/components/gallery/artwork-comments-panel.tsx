"use client";

import Link from "next/link";
import { useContent } from "@/components/providers/locale-provider";
import { ArtworkCommentForm } from "@/components/gallery/artwork-comment-form";
import { ArtworkCommentList } from "@/components/gallery/artwork-comment-list";
import type { ArtworkCommentWithAuthor } from "@/types/database";

type ArtworkCommentsPanelProps = {
  comments: ArtworkCommentWithAuthor[];
  artworkId: string;
  userId: string | null;
  loginRedirect: string;
  readOnly?: boolean;
  className?: string;
};

export function ArtworkCommentsPanel({
  comments,
  artworkId,
  userId,
  loginRedirect,
  readOnly = false,
  className = "",
}: ArtworkCommentsPanelProps) {
  const pages = useContent().pages;

  return (
    <aside
      className={`flex min-h-0 flex-col overflow-hidden ${className}`}
    >
      <div className="eldonia-card flex min-h-0 flex-1 flex-col overflow-hidden p-0">
        <header className="shrink-0 border-b border-eldonia-border px-4 py-3">
          <h2 className="eldonia-heading eldonia-heading-sm text-base">
            {pages.gallery.comments}
          </h2>
          <p className="mt-1 text-xs text-eldonia-text-muted">
            {pages.gallery.commentCount(comments.length)}
          </p>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
          <ArtworkCommentList comments={comments} />
        </div>

        {!readOnly && (
          <footer className="shrink-0 border-t border-eldonia-border bg-eldonia-surface-elevated p-4">
            {userId ? (
              <ArtworkCommentForm
                artworkId={artworkId}
                userId={userId}
                variant="fixed"
              />
            ) : (
              <p className="eldonia-body text-center text-sm">
                <Link
                  href={`/auth/login?redirect_to=${encodeURIComponent(loginRedirect)}`}
                  className="eldonia-link"
                >
                  {pages.gallery.loginToCommentFull}
                </Link>
              </p>
            )}
          </footer>
        )}
      </div>
    </aside>
  );
}
