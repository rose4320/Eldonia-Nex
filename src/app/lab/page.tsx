import Link from "next/link";
import { PageIntro } from "@/components/layout/page-intro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LpSectionRule } from "@/components/ui/lp-section-rule";
import { getUserLabs } from "@/lib/gallery/get-user-labs";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { getContent } from "@/lib/i18n/content/messages";
import { MODULE_ICONS } from "@/lib/layout/module-icons";
import { createClient } from "@/lib/supabase/server";

export default async function LabHubPage() {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const labs = user ? await getUserLabs(user.id) : [];
  const dateLocale = locale === "ja" ? "ja-JP" : locale === "ko" ? "ko-KR" : "en-US";

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="LAB"
          title="LAB"
          lead={t.lab.lead}
          hint={t.lab.flowHint}
          iconSrc={MODULE_ICONS.lab}
        />

        <LpSectionRule />

        {!user ? (
          <div className="eldonia-card text-center">
            <p className="eldonia-body text-sm">
              <Link href="/auth/login?redirect_to=/lab" className="eldonia-link">
                {t.chrome.login}
              </Link>
            </p>
          </div>
        ) : labs.length === 0 ? (
          <div className="eldonia-card-dashed px-6 py-10 text-center">
            <p className="eldonia-body text-sm">{t.lab.empty}</p>
            <Link href="/gallery" className="eldonia-link mt-3 inline-block text-sm">
              {t.pages.lab.galleryLink}
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {labs.map((lab) => (
              <li key={lab.id}>
                <Link
                  href={`/gallery/${lab.artwork_id}/lab`}
                  className="eldonia-card flex gap-4 transition hover:border-eldonia-gold/50"
                >
                  {lab.artworkThumb ? (
                    <img
                      src={lab.artworkThumb}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-md border border-eldonia-border object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-eldonia-border bg-eldonia-surface text-xs text-eldonia-text-dim">
                      LAB
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-semibold text-eldonia-gold-light">
                      {lab.title}
                    </p>
                    <p className="eldonia-body mt-1 truncate text-xs text-eldonia-text-muted">
                      {lab.artworkTitle}
                    </p>
                    <p className="eldonia-hint mt-2 text-xs">
                      {t.lab.memberCount(lab.memberCount)} ·{" "}
                      {new Date(lab.created_at).toLocaleDateString(dateLocale)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
