import Link from "next/link";
import { HelpNav } from "@/components/support/help-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HELP_LINKS, SLA_INFO } from "@/lib/support/constants";
import { createClient } from "@/lib/supabase/server";

export default async function HelpPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main">
        <section className="space-y-4">
          <p className="eldonia-eyebrow">
            Help Center
          </p>
          <h1 className="eldonia-heading eldonia-heading-lg">ヘルプセンター</h1>
          <p className="max-w-2xl text-sm leading-7 text-eldonia-text-muted">
            よくある質問の確認、利用ガイド、お問い合わせはこちらから。
            解決しない場合はサポートデスクへチケットを作成してください。
          </p>
          <HelpNav current="/help" />
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {HELP_LINKS.filter((link) => !link.requiresAuth || user).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="eldonia-card transition-shadow hover:shadow-md"
            >
              <span className="text-2xl">{link.icon}</span>
              <h2 className="mt-3 font-display text-lg font-semibold tracking-wide text-eldonia-gold-light">{link.title}</h2>
              <p className="mt-2 eldonia-body text-sm">{link.description}</p>
            </Link>
          ))}
          {!user && (
            <Link
              href="/auth/login?redirect_to=/help/tickets"
              className="rounded-2xl border border-dashed eldonia-card eldonia-card-dashed border-eldonia-gold/40 p-6 transition-colors hover:border-eldonia-gold/60"
            >
              <span className="text-2xl">🎫</span>
              <h2 className="mt-3 font-display text-lg font-semibold tracking-wide text-eldonia-gold-light">
                マイチケット（要ログイン）
              </h2>
              <p className="mt-2 text-sm text-eldonia-gold">
                ログインすると問い合わせ履歴の確認・追加返信ができます。
              </p>
            </Link>
          )}
        </section>

        <section className="eldonia-card">
          <h2 className="font-display text-lg font-semibold tracking-wide text-eldonia-gold-light">サポート SLA</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="eldonia-label">
                初回返信
              </dt>
              <dd className="mt-1 text-sm text-eldonia-text">{SLA_INFO.firstResponse}</dd>
            </div>
            <div>
              <dt className="eldonia-label">
                受付時間
              </dt>
              <dd className="mt-1 text-sm text-eldonia-text">{SLA_INFO.hours}</dd>
            </div>
            <div>
              <dt className="eldonia-label">
                メール
              </dt>
              <dd className="mt-1 text-sm text-eldonia-text">
                <a
                  href={`mailto:${SLA_INFO.email}`}
                  className="text-eldonia-gold hover:text-eldonia-gold-light"
                >
                  {SLA_INFO.email}
                </a>
              </dd>
            </div>
          </dl>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
