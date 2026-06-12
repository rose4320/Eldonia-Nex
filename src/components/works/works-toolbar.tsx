import Link from "next/link";

type WorksToolbarProps = { query?: string; type?: string };

export function WorksToolbar({ query, type = "all" }: WorksToolbarProps) {
  return (
    <div className="eldonia-works-toolbar">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-3">
        <Link href="/works" className="eldonia-eyebrow shrink-0 hover:text-[var(--eldonia-gold-light)]">
          WORKS
        </Link>
        <form action="/works" method="get" className="eldonia-works-search min-w-[12rem] flex-1">
          <input type="hidden" name="type" value={type} />
          <input
            type="search"
            name="q"
            defaultValue={query ?? ""}
            placeholder="求人・スキルを検索..."
            className="eldonia-works-search-input"
            aria-label="求人検索"
          />
          <button type="submit" className="eldonia-works-search-btn">
            検索
          </button>
        </form>
        <Link href="/works/portfolio" className="eldonia-btn-ghost shrink-0 text-xs">
          ポートフォリオ
        </Link>
        <Link href="/works/manage" className="eldonia-btn-ghost shrink-0 text-xs">
          Guild 管理
        </Link>
      </div>
    </div>
  );
}
