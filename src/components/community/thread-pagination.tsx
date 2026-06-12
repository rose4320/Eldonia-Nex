import Link from "next/link";

type ThreadPaginationProps = {
  page: number;
  totalPages: number;
  basePath: string;
  query?: { q?: string; page?: number };
};

function buildHref(basePath: string, page: number, q?: string) {
  const params = new URLSearchParams();
  if (q?.trim()) params.set("q", q.trim());
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function ThreadPagination({ page, totalPages, basePath, query }: ThreadPaginationProps) {
  if (totalPages <= 1) return null;

  const q = query?.q;

  return (
    <nav
      className="mt-6 flex flex-wrap items-center justify-center gap-2"
      aria-label="スレッドページネーション"
    >
      {page > 1 ? (
        <Link href={buildHref(basePath, page - 1, q)} className="eldonia-btn-ghost text-xs">
          ← 前へ
        </Link>
      ) : (
        <span className="eldonia-btn-ghost text-xs opacity-40">← 前へ</span>
      )}
      <span className="text-xs text-[var(--eldonia-text-dim)]">
        {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={buildHref(basePath, page + 1, q)} className="eldonia-btn-ghost text-xs">
          次へ →
        </Link>
      ) : (
        <span className="eldonia-btn-ghost text-xs opacity-40">次へ →</span>
      )}
    </nav>
  );
}
