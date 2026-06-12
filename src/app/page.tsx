import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { createClient } from "@/lib/supabase/server";

const modules = [
  {
    name: "GALLEY",
    href: "/gallery",
    description: "作品共有（画像・動画・音声・テキスト）",
    ready: true,
  },
  {
    name: "SHOP",
    href: "/shop",
    description: "グッズ・デジタル商品の販売",
    ready: true,
  },
  {
    name: "EVENTS",
    href: "/events",
    description: "イベント開催・チケット販売",
    ready: true,
  },
  {
    name: "COMMUNITY",
    href: "/community",
    description: "翻訳付きチャット・掲示板",
    ready: true,
  },
  {
    name: "WORKS",
    href: "/works",
    description: "求人・業務マッチング",
    ready: true,
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main eldonia-main-narrow">
        <section className="space-y-6 text-center">
          <p className="eldonia-eyebrow">A Fantasy Nexus for Creators</p>
          <h1 className="eldonia-heading eldonia-heading-xl mx-auto max-w-3xl">
            ファンを集め、作品を共有し、収益化する
          </h1>
          <EldoniaDivider />
          <p className="eldonia-body mx-auto max-w-2xl text-lg">
            GALLEY · SHOP · EVENTS · COMMUNITY · WORKS
            <br />
            をひとつのネクサスで。
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {user ? (
              <>
                <Link href="/dashboard" className="eldonia-btn-primary">
                  ダッシュボードへ
                </Link>
                <Link href="/gallery/upload" className="eldonia-btn-secondary">
                  作品を投稿
                </Link>
              </>
            ) : (
              <Link href="/auth/signup" className="eldonia-btn-primary">
                無料で始める
              </Link>
            )}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module.name}
              href={module.href}
              className="eldonia-card eldonia-card-interactive"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-sm font-semibold tracking-wider text-eldonia-gold">
                  {module.name}
                </h2>
                <span
                  className={`eldonia-badge ${
                    module.ready ? "eldonia-badge-ready" : "eldonia-badge-pending"
                  }`}
                >
                  {module.ready ? "利用可" : "準備中"}
                </span>
              </div>
              <p className="eldonia-body mt-3 text-sm">{module.description}</p>
            </Link>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
