import Link from "next/link";

type EventsToolbarProps = {
  query?: string;
};

export function EventsToolbar({ query }: EventsToolbarProps) {
  return (
    <div className="eldonia-events-toolbar">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-3">
        <Link
          href="/events"
          className="eldonia-eyebrow shrink-0 hover:text-[var(--eldonia-gold-light)]"
        >
          EVENTS
        </Link>

        <form action="/events" method="get" className="eldonia-events-search min-w-[12rem] flex-1">
          <input
            type="search"
            name="q"
            defaultValue={query ?? ""}
            placeholder="Chronicle を検索..."
            className="eldonia-events-search-input"
            aria-label="イベント検索"
          />
          <button type="submit" className="eldonia-events-search-btn">
            検索
          </button>
        </form>

        <Link
          href="/auth/login?redirect_to=/events"
          className="eldonia-btn-ghost shrink-0 text-xs"
        >
          マイチケット
        </Link>
      </div>
    </div>
  );
}
