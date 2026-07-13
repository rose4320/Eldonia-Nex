import Link from "next/link";
import { TranslatedContentLine } from "@/components/i18n/content-line";
import { formatRelativeTime, LOCALE_LABELS } from "@/lib/community/constants";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import type { ThreadCardTranslations } from "@/lib/translation/content-cache";
import type {
  CommunityReplyWithAuthor,
  CommunityThreadWithAuthor,
} from "@/types/database";

type ThreadCardProps = {
  thread: CommunityThreadWithAuthor;
  latestReply?: CommunityReplyWithAuthor | null;
  translations?: ThreadCardTranslations;
};

export async function ThreadCard({
  thread,
  latestReply = null,
  translations,
}: ThreadCardProps) {
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const previewText = latestReply?.body ?? thread.body;
  const previewLocale = latestReply?.locale ?? thread.locale;
  const previewAuthor =
    latestReply?.profiles?.display_name ??
    latestReply?.profiles?.username ??
    thread.profiles?.display_name ??
    thread.profiles?.username ??
    pages.anonymous;
  const previewTime = latestReply?.created_at ?? thread.updated_at;
  const previewLocaleLabel = LOCALE_LABELS[previewLocale] ?? previewLocale;

  return (
    <Link href={`/community/t/${thread.id}`} className="eldonia-thread-card group">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {thread.is_pinned && (
            <span className="eldonia-badge-bestseller mb-2 inline-block">{pages.pinned}</span>
          )}
          <TranslatedContentLine
            text={thread.title}
            translatedText={translations?.title}
            sourceLocale={thread.locale}
            locale={locale}
            as="h2"
            className="line-clamp-2 font-display text-base text-[var(--eldonia-text)] group-hover:text-[var(--eldonia-gold-light)]"
            hintClassName="eldonia-localized-hint text-xs line-clamp-2"
          />
          <TranslatedContentLine
            text={previewText}
            translatedText={translations?.preview}
            sourceLocale={previewLocale}
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
        {previewAuthor} · {formatRelativeTime(previewTime, locale)} · {previewLocaleLabel}
        {thread.community_boards && ` · ${thread.community_boards.name}`}
      </p>
    </Link>
  );
}
