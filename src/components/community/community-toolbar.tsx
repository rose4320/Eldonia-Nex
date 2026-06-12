import Link from "next/link";

type CommunityToolbarProps = { query?: string };

export function CommunityToolbar({ query }: CommunityToolbarProps) {
  return (
    <div className="eldonia-community-toolbar">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-3">
        <Link href="/community" className="eldonia-eyebrow shrink-0 hover:text-[var(--eldonia-gold-light)]">
          COMMUNITY
        </Link>
        <form action="/community" method="get" className="eldonia-community-search min-w-[12rem] flex-1">
          <input
            type="search"
            name="q"
            defaultValue={query ?? ""}
            placeholder="掲示板を検索..."
            className="eldonia-community-search-input"
            aria-label="スレッド検索"
          />
          <button type="submit" className="eldonia-community-search-btn">
            検索
          </button>
        </form>
        <span className="eldonia-badge-nexus-prime shrink-0 text-[10px]">
          翻訳 Nexus 対応
        </span>
      </div>
    </div>
  );
}
