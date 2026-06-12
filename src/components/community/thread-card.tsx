import Link from "next/link";
import { formatRelativeTime, LOCALE_LABELS } from "@/lib/community/constants";
import type { CommunityThreadWithAuthor } from "@/types/database";

type ThreadCardProps = { thread: CommunityThreadWithAuthor };

export function ThreadCard({ thread }: ThreadCardProps) {
  const author =
    thread.profiles?.display_name ?? thread.profiles?.username ?? "匿名";
  const locale = LOCALE_LABELS[thread.locale] ?? thread.locale;

  return (
    <Link href={`/community/t/${thread.id}`} className="eldonia-thread-card group">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {thread.is_pinned && (
            <span className="eldonia-badge-bestseller mb-2 inline-block">Pinned</span>
          )}
          <h2 className="line-clamp-2 font-display text-base text-[var(--eldonia-text)] group-hover:text-[var(--eldonia-gold-light)]">
            {thread.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm text-[var(--eldonia-text-muted)]">
            {thread.body}
          </p>
        </div>
        <span className="shrink-0 text-xs text-[var(--eldonia-text-dim)]">
          {thread.reply_count} 返信
        </span>
      </div>
      <p className="mt-3 text-xs text-[var(--eldonia-text-dim)]">
        {author} · {formatRelativeTime(thread.updated_at)} · {locale}
        {thread.community_boards && ` · ${thread.community_boards.name}`}
      </p>
    </Link>
  );
}
