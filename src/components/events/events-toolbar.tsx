import Link from "next/link";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

type EventsToolbarProps = {
  query?: string;
};

export async function EventsToolbar({ query }: EventsToolbarProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ordersHref = user
    ? "/dashboard/orders"
    : "/auth/login?redirect_to=/dashboard/orders";

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
            placeholder={t.pages.events.toolbarSearch}
            className="eldonia-events-search-input"
            aria-label={t.pages.events.toolbarSearchAria}
          />
          <button type="submit" className="eldonia-events-search-btn">
            {t.common.search}
          </button>
        </form>

        <Link href={ordersHref} className="eldonia-btn-ghost shrink-0 text-xs">
          {t.pages.events.toolbarOrders}
        </Link>
      </div>
    </div>
  );
}
