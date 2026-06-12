import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect_to=/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { count: artworkCount } = await supabase
    .from("artworks")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", user.id);

  const { count: openTicketCount } = await supabase
    .from("support_tickets")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .in("status", ["open", "in_progress", "waiting_user"]);

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main">
        <section className="space-y-3">
          <p className="eldonia-eyebrow">Dashboard</p>
          <h1 className="eldonia-heading eldonia-heading-sm">ダッシュボード</h1>
          <p className="eldonia-body text-sm">
            {profile?.display_name ?? user.email} さん、ようこそ。
          </p>
          <EldoniaDivider />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "投稿作品",
              value: String(artworkCount ?? 0),
              sub: null,
              links: [{ href: "/gallery/upload", text: "作品を投稿 →" }],
            },
            {
              label: "プロフィール",
              value: profile?.username ? `@${profile.username}` : "未設定",
              sub: null,
              links: [{ href: "/dashboard/profile", text: "プロフィール編集 →" }],
              smallValue: true,
            },
            {
              label: "サポート",
              value: String(openTicketCount ?? 0),
              sub: "対応中のチケット",
              links: [
                { href: "/help/tickets", text: "マイチケット →" },
                { href: "/help/contact", text: "お問い合わせ →" },
              ],
            },
            {
              label: "注文",
              value: "Orders",
              sub: "SHOP / EVENTS 決済履歴",
              links: [{ href: "/dashboard/orders", text: "注文履歴 →" }],
              smallValue: true,
            },
            {
              label: "WORKS",
              value: "Portfolio",
              sub: "求人応募用プロフィール",
              links: [{ href: "/works/portfolio", text: "ポートフォリオ編集 →" }],
              smallValue: true,
            },
          ].map((card) => (
            <article key={card.label} className="eldonia-card">
              <p className="eldonia-eyebrow">{card.label}</p>
              <p
                className={`mt-2 font-display font-bold text-eldonia-gold-light ${
                  card.smallValue ? "text-sm" : "text-3xl"
                }`}
              >
                {card.value}
              </p>
              {card.sub && <p className="eldonia-hint mt-1">{card.sub}</p>}
              <div className="mt-4 flex flex-col gap-1">
                {card.links.map((link) => (
                  <Link key={link.href} href={link.href} className="eldonia-link text-sm">
                    {link.text}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="eldonia-card eldonia-card-dashed">
          <h2 className="font-display text-sm font-semibold tracking-wider text-eldonia-gold">
            モジュールへ
          </h2>
          <ul className="eldonia-body mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <li><Link href="/shop" className="eldonia-link">SHOP</Link> · <Link href="/shop/cart" className="eldonia-link">カート</Link></li>
            <li><Link href="/events" className="eldonia-link">EVENTS</Link></li>
            <li><Link href="/community" className="eldonia-link">COMMUNITY</Link></li>
            <li><Link href="/works" className="eldonia-link">WORKS</Link> · <Link href="/works/manage" className="eldonia-link">Guild 管理</Link></li>
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
