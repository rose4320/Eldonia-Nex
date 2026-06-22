import Link from "next/link";
import { redirect } from "next/navigation";
import { UploadForm } from "@/components/gallery/upload-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPostArtworkPage() {
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect_to=/settings/post/artwork");
  }

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <main className="eldonia-main eldonia-main-narrow">
        <Link href="/settings#posts" className="eldonia-link text-sm">
          {pages.settings.back}
        </Link>
        <h1 className="eldonia-heading eldonia-heading-sm mt-3">{pages.settings.postArtworkTitle}</h1>
        <p className="eldonia-body mt-1 text-sm">{pages.settings.postArtworkLead}</p>
        <section className="eldonia-card mt-6">
          <UploadForm successRedirect="/settings#posts" />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
