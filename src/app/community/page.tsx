import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { BoardCard } from "@/components/community/board-card";
import { CommunityToolbar } from "@/components/community/community-toolbar";
import { ThreadCard } from "@/components/community/thread-card";
import { ThreadPagination } from "@/components/community/thread-pagination";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { getCommunityBoards, getCommunityThreadsPaginated } from "@/lib/community/get-community";

type CommunityPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const boards = await getCommunityBoards();
  const { threads, totalPages, total } = await getCommunityThreadsPaginated({ q, page });

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <CommunityToolbar query={q} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-8">
        <section className="space-y-2">
          <p className="eldonia-eyebrow">COMMUNITY</p>
          <h1 className="eldonia-heading eldonia-heading-lg">Hall of the Nexus</h1>
          <p className="eldonia-body text-sm">
            翻訳付きチャット・掲示板。Discord / Reddit 型のレイアウトを Eldonia 世界観で。
          </p>
        </section>

        <EldoniaDivider />

        <section>
          <h2 className="eldonia-label">Realms — 掲示板</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="eldonia-label">
              最近のスレッド
              <span className="eldonia-hint ml-2 font-normal">({total} 件)</span>
            </h2>
            {q && (
              <Link href="/community" className="eldonia-link text-sm">
                フィルタをクリア
              </Link>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {threads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
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
