import { HelpNav } from "@/components/support/help-nav";
import { ContactForm } from "@/components/support/contact-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SLA_INFO } from "@/lib/support/constants";
import { createClient } from "@/lib/supabase/server";

export default async function ContactPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let defaultName = "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, username")
      .eq("id", user.id)
      .single();
    defaultName = profile?.display_name ?? profile?.username ?? "";
  }

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main">
        <section className="space-y-4">
          <h1 className="eldonia-heading eldonia-heading-lg">お問い合わせ</h1>
          <p className="text-sm leading-7 text-eldonia-text-muted">
            サポートデスクへチケットを作成します。送信後にチケット番号（ENX-YYYYMMDD-XXXXXX）が発行されます。
            初回返信は {SLA_INFO.firstResponse} を目安にご連絡いたします。
          </p>
          <HelpNav current="/help/contact" />
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="eldonia-card">
            <ContactForm
              userId={user?.id}
              defaultName={defaultName}
              defaultEmail={user?.email ?? ""}
            />
          </div>

          <aside className="space-y-4">
            <div className="eldonia-card">
              <h2 className="text-sm font-semibold text-eldonia-gold-light">返信前にご確認</h2>
              <ul className="mt-3 space-y-2 eldonia-body text-sm">
                <li>
                  <a href="/help/faq" className="text-eldonia-gold hover:text-eldonia-gold-light">
                    よくある質問
                  </a>
                </li>
                <li>
                  <a href="/help/guides" className="text-eldonia-gold hover:text-eldonia-gold-light">
                    利用ガイド
                  </a>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-eldonia-gold/30 bg-eldonia-gold/5 p-6">
              <h2 className="text-sm font-semibold text-eldonia-gold-light">緊急のご連絡</h2>
              <p className="mt-2 text-sm leading-6 text-eldonia-text-muted">
                アカウント乗っ取り・決済障害などは件名に「【緊急】」を含めてください。
              </p>
              <a
                href={`mailto:${SLA_INFO.email}`}
                className="mt-3 inline-block text-sm font-medium text-eldonia-gold hover:text-eldonia-gold-light"
              >
                {SLA_INFO.email}
              </a>
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
