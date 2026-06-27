import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QuestCard } from "@/components/works/quest-card";
import { WorksToolbar } from "@/components/works/works-toolbar";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { questKindOptions } from "@/lib/quests/constants";
import { getQuestListings } from "@/lib/quests/get-quests";

type WorksPageProps = {
  searchParams: Promise<{ q?: string; kind?: string }>;
};

export default async function WorksPage({ searchParams }: WorksPageProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const { q, kind = "all" } = await searchParams;
  const quests = await getQuestListings({ q, kind }, locale);
  const kinds = questKindOptions(locale);

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <WorksToolbar query={q} type={kind} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-8">
        <section className="space-y-2">
          <p className="eldonia-eyebrow">QUEST</p>
          <h1 className="eldonia-heading eldonia-heading-lg">{t.works.heading}</h1>
          <p className="eldonia-body text-sm">{t.works.lead}</p>
        </section>

        <EldoniaDivider />

        <nav className="flex flex-wrap gap-2">
          {[{ value: "all", label: t.common.all }, ...kinds].map((item) => {
            const params = new URLSearchParams();
            if (item.value !== "all") params.set("kind", item.value);
            if (q?.trim()) params.set("q", q.trim());
            const href = params.toString() ? `/works?${params}` : "/works";
            const active = kind === item.value;
            return (
              <Link
                key={item.value}
                href={href}
                className={
                  active
                    ? "eldonia-badge-nexus-prime"
                    : "rounded border border-[var(--eldonia-border)] px-3 py-1 text-xs text-[var(--eldonia-text-muted)]"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <section className="grid gap-4 lg:grid-cols-2">
          {quests.length === 0 ? (
            <p className="eldonia-body col-span-full py-16 text-center">{t.works.empty}</p>
          ) : (
            quests.map((quest) => <QuestCard key={quest.id} quest={quest} />)
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
