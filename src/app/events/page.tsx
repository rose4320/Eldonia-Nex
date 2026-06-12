import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { EventCard } from "@/components/events/event-card";
import { EventsHeroStrip } from "@/components/events/events-hero-strip";
import { EventsSidebar } from "@/components/events/events-sidebar";
import { EventsToolbar } from "@/components/events/events-toolbar";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { getEvents } from "@/lib/events/get-events";
import { realmLabel } from "@/lib/events/constants";

type EventsPageProps = {
  searchParams: Promise<{ q?: string; category?: string; when?: string }>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { q, category = "all", when = "upcoming" } = await searchParams;
  const events = await getEvents({ q, category, when });

  const heading = q?.trim()
    ? `「${q.trim()}」の検索結果`
    : category !== "all"
      ? realmLabel(category)
      : when === "past"
        ? "Past Chronicles"
        : "Chronicles of the Nexus";

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <EventsToolbar query={q} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-8">
        <section className="space-y-2">
          <p className="eldonia-eyebrow">EVENTS</p>
          <h1 className="eldonia-heading eldonia-heading-lg">{heading}</h1>
          <p className="eldonia-body text-sm">
            ライブ・ワークショップ・展示 — Eventbrite 型レイアウトで、Eldonia-Nex の世界観のまま。
          </p>
        </section>

        <EldoniaDivider />

        <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
          <EventsSidebar
            activeCategory={category}
            activeWhen={when}
            query={q}
          />

          <div className="flex min-w-0 flex-col gap-8">
            {when !== "past" && <EventsHeroStrip events={events} />}

            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-sm tracking-wider text-[var(--eldonia-gold-muted)] uppercase">
                  {events.length} 件のイベント
                </h2>
                {(q || category !== "all" || when !== "upcoming") && (
                  <Link href="/events" className="eldonia-link text-sm">
                    フィルタをクリア
                  </Link>
                )}
              </div>

              {events.length === 0 ? (
                <div className="eldonia-card-dashed rounded-xl px-8 py-16 text-center">
                  <p className="eldonia-body">該当するイベントがありません。</p>
                  <Link href="/events" className="eldonia-link mt-4 inline-block text-sm">
                    すべてのイベントを見る →
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
