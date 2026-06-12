import Link from "next/link";
import { HelpNav } from "@/components/support/help-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SLA_INFO } from "@/lib/support/constants";

type SuccessPageProps = {
  searchParams: Promise<{ ticket?: string }>;
};

export default async function ContactSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const ticketNumber = params.ticket ?? "（番号を確認できません）";

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
        <section className="eldonia-card border-eldonia-gold/40 text-center">
          <p className="text-4xl">✅</p>
          <h1 className="mt-4 eldonia-heading eldonia-heading-sm">
            お問い合わせを受け付けました
          </h1>
          <p className="mt-3 eldonia-body text-sm">
            チケット番号を控えておいてください。{SLA_INFO.firstResponse} に初回返信いたします。
          </p>
          <p className="mt-6 rounded-lg bg-eldonia-surface-elevated px-4 py-3 font-mono font-display text-lg font-semibold tracking-wide text-eldonia-gold-light ring-1 ring-eldonia-gold/40">
            {ticketNumber}
          </p>
        </section>

        <section className="space-y-4 text-center eldonia-body text-sm">
          <p>
            アカウントをお持ちの方は{" "}
            <Link href="/auth/login?redirect_to=/help/tickets" className="text-eldonia-gold hover:text-eldonia-gold-light">
              ログイン
            </Link>
            すると「マイチケット」から履歴を確認できます。
          </p>
          <HelpNav current="/help/contact" />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
