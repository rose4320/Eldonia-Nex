import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CommunityToolbar } from "@/components/community/community-toolbar";
import { ThreadReplyForm } from "@/components/community/thread-reply-form";
import { ThreadReplyList } from "@/components/community/thread-reply-list";
import { TranslationPanel } from "@/components/community/translation-panel";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { formatRelativeTime, LOCALE_LABELS } from "@/lib/community/constants";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import {
  getCommunityReplies,
  getCommunityThread,
} from "@/lib/community/get-community";
import { createClient } from "@/lib/supabase/server";

type ThreadPageProps = { params: Promise<{ id: string }> };

export default async function CommunityThreadPage({ params }: ThreadPageProps) {
  const { id } = await params;
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const thread = await getCommunityThread(id);

  if (!thread) notFound();

  const replies = await getCommunityReplies(id);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const author =
    thread.profiles?.display_name ?? thread.profiles?.username ?? pages.anonymous;

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <CommunityToolbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <Link
          href={`/community/b/${thread.community_boards?.slug ?? "general"}`}
          className="eldonia-link text-sm"
        >
          ← {thread.community_boards?.name ?? "Board"}
        </Link>

        <article className="eldonia-card mt-6">
          {thread.is_pinned && (
            <span className="eldonia-badge-bestseller mb-3 inline-block">{pages.pinned}</span>
          )}
          <h1 className="eldonia-heading eldonia-heading-sm">{thread.title}</h1>
          <p className="mt-2 text-xs text-[var(--eldonia-text-dim)]">
            {author} · {formatRelativeTime(thread.created_at)} ·{" "}
            {LOCALE_LABELS[thread.locale] ?? thread.locale}
          </p>
          <div className="my-6">
            <EldoniaDivider />
          </div>
          <p className="eldonia-body whitespace-pre-wrap text-sm">{thread.body}</p>
          <TranslationPanel text={thread.body} sourceLocale={thread.locale} />
        </article>

        <section className="mt-8">
          <h2 className="eldonia-label mb-4">{pages.community.replies(replies.length)}</h2>
          <ThreadReplyList replies={replies} />
          {user ? (
            <ThreadReplyForm threadId={id} userId={user.id} />
          ) : (
            <p className="eldonia-body mt-6 text-center text-sm">
              <Link href={`/auth/login?redirect_to=/community/t/${id}`} className="eldonia-link">
                {pages.loginToAction(pages.community.loginToReply)}
              </Link>
            </p>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
