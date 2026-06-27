import Link from "next/link";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { isQuestAdmin } from "@/lib/quests/is-quest-admin";
import { createClient } from "@/lib/supabase/server";

type WorksToolbarProps = { query?: string; type?: string };

export async function WorksToolbar({ query, type = "all" }: WorksToolbarProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const showManage = user ? await isQuestAdmin(user.id) : false;

  return (
    <div className="eldonia-works-toolbar">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-3">
        <Link href="/works" className="eldonia-eyebrow shrink-0 hover:text-[var(--eldonia-gold-light)]">
          QUEST
        </Link>
        <form action="/works" method="get" className="eldonia-works-search min-w-[12rem] flex-1">
          <input type="hidden" name="kind" value={type} />
          <input
            type="search"
            name="q"
            defaultValue={query ?? ""}
            placeholder={t.pages.works.toolbarSearch}
            className="eldonia-works-search-input"
            aria-label={t.pages.works.toolbarSearchAria}
          />
          <button type="submit" className="eldonia-works-search-btn">
            {t.common.search}
          </button>
        </form>
        <Link href="/works/portfolio" className="eldonia-btn-ghost shrink-0 text-xs">
          {t.pages.works.toolbarPortfolio}
        </Link>
        {showManage && (
          <Link href="/works/manage" className="eldonia-btn-ghost shrink-0 text-xs">
            {t.pages.works.toolbarManage}
          </Link>
        )}
      </div>
    </div>
  );
}
