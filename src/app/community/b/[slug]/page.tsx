import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CommunityToolbar } from "@/components/community/community-toolbar";
import { ThreadCard } from "@/components/community/thread-card";
import { ThreadPagination } from "@/components/community/thread-pagination";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import {
  getCommunityBoards,
  getCommunityThreadsPaginated,
  getLatestRepliesByThreadIds,
} from "@/lib/community/get-community";
import { getThreadCardTranslationsWithWarm } from "@/lib/translation/content-cache";
import { getBoardDescription, getBoardName } from "@/lib/community/board-labels";
import { createClient } from "@/lib/supabase/server";

type BoardPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function CommunityBoardPage({ params, searchParams }: BoardPageProps) {
  const { slug } = await params;
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const boards = await getCommunityBoards();
  const board = boards.find((b) => b.slug === slug);

  if (!board) notFound();

  const { threads, totalPages, total } = await getCommunityThreadsPaginated({
    boardSlug: slug,
    q,
    page,
  });
  const [latestReplies, threadTranslations] = await Promise.all([
    getLatestRepliesByThreadIds(threads.map((thread) => thread.id)),
    getLatestRepliesByThreadIds(threads.map((thread) => thread.id)).then((replies) =>
      getThreadCardTranslationsWithWarm(threads, replies, locale),
    ),
  ]);

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <CommunityToolbar query={q} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <Link href="/community" className="eldonia-link text-sm">
          {pages.community.backToCommunity}
        </Link>
        <h1 className="eldonia-heading eldonia-heading-lg mt-4">
          {getBoardName(board.slug, locale, board.name)}
        </h1>
        <p className="eldonia-body mt-2 text-sm">
          {getBoardDescription(board.slug, locale, board.description)}
        </p>
        {user ? (
          <Link
            href={`/community/b/${slug}/new`}
            className="eldonia-btn-primary mt-4 inline-block text-sm"
          >
            {pages.community.newThread}
          </Link>
        ) : (
          <Link
            href={`/auth/login?redirect_to=/community/b/${slug}/new`}
            className="eldonia-btn-secondary mt-4 inline-block text-sm"
          >
            {pages.community.loginToPost}
          </Link>
        )}

        <p className="eldonia-hint mt-6">{pages.community.threadCount(total)}</p>

        <div className="mt-4 flex flex-col gap-3">
          {threads.length === 0 ? (
            <p className="eldonia-body text-center py-12">{pages.community.threadsEmpty}</p>
          ) : (
            threads.map((thread) => (
              <ThreadCard
                key={thread.id}
                thread={thread}
                latestReply={latestReplies.get(thread.id) ?? null}
                translations={threadTranslations[thread.id]}
              />
            ))
          )}
        </div>

        <ThreadPagination
          page={page}
          totalPages={totalPages}
          basePath={`/community/b/${slug}`}
          query={{ q }}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
