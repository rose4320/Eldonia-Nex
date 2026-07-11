import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductCreateForm } from "@/components/settings/product-create-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { getArtworkProductPrefill } from "@/lib/shop/artwork-product-prefill";
import { createClient } from "@/lib/supabase/server";

type SettingsPostProductPageProps = {
  searchParams: Promise<{ from_artwork?: string }>;
};

export default async function SettingsPostProductPage({ searchParams }: SettingsPostProductPageProps) {
  const locale = await getUiLocale();
  const { pages, forms } = getContent(locale);
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectTo = params.from_artwork
      ? `/settings/post/product?from_artwork=${encodeURIComponent(params.from_artwork)}`
      : "/settings/post/product";
    redirect(`/auth/login?redirect_to=${encodeURIComponent(redirectTo)}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_creator")
    .eq("id", user.id)
    .single();

  const artworkPrefill = params.from_artwork
    ? await getArtworkProductPrefill(user.id, params.from_artwork)
    : null;

  const backHref = artworkPrefill ? "/settings#artworks" : "/settings#shop";

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <main className="eldonia-main eldonia-main-narrow">
        <Link href={backHref} className="eldonia-link text-sm">
          {pages.settings.back}
        </Link>
        <h1 className="eldonia-heading eldonia-heading-sm mt-3">{pages.settings.postProductTitle}</h1>
        <p className="eldonia-body mt-1 text-sm">
          {artworkPrefill
            ? pages.settings.postProductFromArtwork(artworkPrefill.title)
            : pages.settings.postProductLead}
        </p>
        {!profile?.is_creator && (
          <p className="eldonia-alert-error mt-4 text-sm">{forms.creatorRequired}</p>
        )}
        <section className="eldonia-card mt-6">
          <ProductCreateForm
            userId={user.id}
            disabled={!profile?.is_creator}
            initialValues={
              artworkPrefill
                ? {
                    title: artworkPrefill.title,
                    description: artworkPrefill.description,
                    category: artworkPrefill.category,
                    productType: artworkPrefill.productType,
                    imageUrl: artworkPrefill.imageUrl ?? "",
                  }
                : undefined
            }
          />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
