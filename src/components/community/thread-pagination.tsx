import Link from "next/link";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";

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

export async function ThreadPagination({
  page,
  totalPages,
  basePath,
  query,
}: ThreadPaginationProps) {
  if (totalPages <= 1) return null;

  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const q = query?.q;

  return (
    <nav
      className="mt-6 flex flex-wrap items-center justify-center gap-2"
      aria-label="Thread pagination"
    >
      {page > 1 ? (
        <Link href={buildHref(basePath, page - 1, q)} className="eldonia-btn-ghost text-xs">
          ← {pages.prev}
        </Link>
      ) : (
        <span className="eldonia-btn-ghost text-xs opacity-40">← {pages.prev}</span>
      )}
      <span className="text-xs text-[var(--eldonia-text-dim)]">
        {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={buildHref(basePath, page + 1, q)} className="eldonia-btn-ghost text-xs">
          {pages.next} →
        </Link>
      ) : (
        <span className="eldonia-btn-ghost text-xs opacity-40">{pages.next} →</span>
      )}
    </nav>
  );
}
