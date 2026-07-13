import Link from "next/link";
import { PageIntro } from "@/components/layout/page-intro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { BoardCard } from "@/components/community/board-card";
import { CommunityToolbar } from "@/components/community/community-toolbar";
import { ThreadCard } from "@/components/community/thread-card";
import { ThreadPagination } from "@/components/community/thread-pagination";
import { LpSectionRule } from "@/components/ui/lp-section-rule";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { MODULE_ICONS } from "@/lib/layout/module-icons";
import {
  getCommunityBoards,
  getCommunityThreadsPaginated,
  getLatestRepliesByThreadIds,
} from "@/lib/community/get-community";
import { getThreadCardTranslationsWithWarm } from "@/lib/translation/content-cache";

type CommunityPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const [boards, { threads, totalPages, total }] = await Promise.all([
    getCommunityBoards(),
    getCommunityThreadsPaginated({ q, page }),
  ]);
  const latestReplies = await getLatestRepliesByThreadIds(threads.map((thread) => thread.id));
  const threadTranslations = await getThreadCardTranslationsWithWarm(
    threads,
    latestReplies,
    locale,
  );

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />
      <CommunityToolbar query={q} />

      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="COMMUNITY"
          title={t.community.heading}
          lead={t.community.lead}
          iconSrc={MODULE_ICONS.community}
        />

        <LpSectionRule />

        <section>
          <h2 className="eldonia-label">{t.community.boardsHeading}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="eldonia-label">
              {t.community.recentThreads}
              <span className="eldonia-hint ml-2 font-normal">({total})</span>
            </h2>
            {q && (
              <Link href="/community" className="eldonia-link text-sm">
                {t.common.clearFilter}
              </Link>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {threads.map((thread) => (
              <ThreadCard
                key={thread.id}
                thread={thread}
                latestReply={latestReplies.get(thread.id) ?? null}
                translations={threadTranslations[thread.id]}
              />
            ))}
          </div>
          <ThreadPagination
            page={page}
            totalPages={totalPages}
            basePath="/community"
            query={{ q }}
          />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

