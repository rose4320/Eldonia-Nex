import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { MODULE_NAV_LINKS } from "@/lib/layout/nav-links";
import { createClient } from "@/lib/supabase/server";

const MODULE_HREF = Object.fromEntries(
  MODULE_NAV_LINKS.filter((l) => l.label !== "LAB").map((l) => [l.label, l.href]),
) as Record<string, string>;

export default async function HomePage() {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main eldonia-main-narrow">
        <section className="space-y-6 text-center">
          <p className="eldonia-eyebrow">{t.home.eyebrow}</p>
          <h1 className="eldonia-heading eldonia-heading-xl mx-auto max-w-3xl">
            {t.home.heroTitle}
          </h1>
          <EldoniaDivider />
          <p className="eldonia-body mx-auto max-w-2xl whitespace-pre-line text-lg">
            {t.home.heroBody}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {user ? (
              <>
                <Link href="/settings" className="eldonia-btn-primary">
                  {t.home.ctaSettings}
                </Link>
                <Link href="/settings/post/artwork" className="eldonia-btn-secondary">
                  {t.home.ctaPostArtwork}
                </Link>
              </>
            ) : (
              <Link href="/auth/signup" className="eldonia-btn-primary">
                {t.home.ctaSignup}
              </Link>
            )}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.home.modules.map((module) => (
            <Link
              key={module.name}
              href={MODULE_HREF[module.name] ?? "/"}
              className="eldonia-card eldonia-card-interactive"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-sm font-semibold tracking-wider text-eldonia-gold">
                  {module.name}
                </h2>
                <span className="eldonia-badge eldonia-badge-ready">
                  {t.common.available}
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
