import Link from "next/link";
import { ContentLine } from "@/components/i18n/content-line";
import { formatRelativeTime, LOCALE_LABELS } from "@/lib/community/constants";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import type { CommunityThreadWithAuthor } from "@/types/database";

type ThreadCardProps = { thread: CommunityThreadWithAuthor };

export async function ThreadCard({ thread }: ThreadCardProps) {
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const author =
    thread.profiles?.display_name ?? thread.profiles?.username ?? pages.anonymous;
  const sourceLocale = LOCALE_LABELS[thread.locale] ?? thread.locale;

  return (
    <Link href={`/community/t/${thread.id}`} className="eldonia-thread-card group">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {thread.is_pinned && (
            <span className="eldonia-badge-bestseller mb-2 inline-block">{pages.pinned}</span>
          )}
          <ContentLine
            text={thread.title}
            locale={locale}
            as="h2"
            className="line-clamp-2 font-display text-base text-[var(--eldonia-text)] group-hover:text-[var(--eldonia-gold-light)]"
            hintClassName="eldonia-localized-hint text-xs line-clamp-2"
          />
          <ContentLine
            text={thread.body}
            locale={locale}
            as="p"
            className="mt-2 line-clamp-2 text-sm text-[var(--eldonia-text-muted)]"
            hintClassName="eldonia-localized-hint text-xs line-clamp-2"
          />
        </div>
        <span className="shrink-0 text-xs text-[var(--eldonia-text-dim)]">
          {pages.community.replies(thread.reply_count)}
        </span>
      </div>
      <p className="mt-3 text-xs text-[var(--eldonia-text-dim)]">
        {author} · {formatRelativeTime(thread.updated_at)} · {sourceLocale}
        {thread.community_boards && ` · ${thread.community_boards.name}`}
      </p>
    </Link>
  );
}
