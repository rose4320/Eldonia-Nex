import Link from "next/link";
import { HelpNav } from "@/components/support/help-nav";
import { ContactForm } from "@/components/support/contact-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SLA_INFO } from "@/lib/support/constants";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

export default async function ContactPage() {
  const locale = await getUiLocale();
  const t = getContent(locale);
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
          <h1 className="eldonia-heading eldonia-heading-lg">{t.pages.help.contactTitle}</h1>
          <p className="text-sm leading-7 text-eldonia-text-muted">
            {t.pages.help.contactLead(t.help.slaFirstResponseValue)}
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
              <h2 className="text-sm font-semibold text-eldonia-gold-light">
                {t.pages.help.contactSidebarTitle}
              </h2>
              <ul className="mt-3 space-y-2 eldonia-body text-sm">
                <li>
                  <Link href="/help/faq" className="text-eldonia-gold hover:text-eldonia-gold-light">
                    {t.pages.help.contactSidebarFaq}
                  </Link>
                </li>
                <li>
                  <Link href="/help/guides" className="text-eldonia-gold hover:text-eldonia-gold-light">
                    {t.pages.help.guidesTitle}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-eldonia-gold/30 bg-eldonia-gold/5 p-6">
              <p className="text-sm leading-6 text-eldonia-text-muted">
                {t.pages.help.contactEmergency}
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
