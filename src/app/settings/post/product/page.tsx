import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductCreateForm } from "@/components/settings/product-create-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPostProductPage() {
  const locale = await getUiLocale();
  const { pages, forms } = getContent(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect_to=/settings/post/product");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_creator")
    .eq("id", user.id)
    .single();

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <main className="eldonia-main eldonia-main-narrow">
        <Link href="/settings#posts" className="eldonia-link text-sm">
          {pages.settings.back}
        </Link>
        <h1 className="eldonia-heading eldonia-heading-sm mt-3">{pages.settings.postProductTitle}</h1>
        <p className="eldonia-body mt-1 text-sm">{pages.settings.postProductLead}</p>
        {!profile?.is_creator && (
          <p className="eldonia-alert-error mt-4 text-sm">{forms.creatorRequired}</p>
        )}
        <section className="eldonia-card mt-6">
          <ProductCreateForm userId={user.id} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
