import Link from "next/link";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";

type CommunityToolbarProps = { query?: string };

export async function CommunityToolbar({ query }: CommunityToolbarProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);

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
            placeholder={t.pages.community.toolbarSearch}
            className="eldonia-community-search-input"
            aria-label={t.pages.community.toolbarSearchAria}
          />
          <button type="submit" className="eldonia-community-search-btn">
            {t.common.search}
          </button>
        </form>
        <span className="eldonia-badge-nexus-prime shrink-0 text-[10px]">
          {t.pages.community.toolbarNexus}
        </span>
      </div>
    </div>
  );
}
