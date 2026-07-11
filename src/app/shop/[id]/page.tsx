import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentLine, TagWithHint } from "@/components/i18n/content-line";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductBuyBox } from "@/components/shop/product-buy-box";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { CATEGORY_ICONS, realmLabel } from "@/lib/shop/constants";
import { getContent } from "@/lib/i18n/content/messages";
import { getShopProduct } from "@/lib/shop/get-products";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { canDownloadShopProduct } from "@/lib/shop/product-download-access";
import { productHasDownloadFile } from "@/lib/shop/product-download";
import { createClient } from "@/lib/supabase/server";

type ShopDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ShopDetailPage({ params }: ShopDetailPageProps) {
  const { id } = await params;
  const locale = await getUiLocale();
  const t = getContent(locale);
  const product = await getShopProduct(id);

  if (!product) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const sellerName =
    product.profiles?.display_name ??
    product.profiles?.username ??
    "Eldonia Seller";
  const icon = CATEGORY_ICONS[product.category] ?? "◆";
  const description = product.description ?? t.shop.descriptionPending;
  const canDownload =
    product.product_type === "digital" &&
    productHasDownloadFile(product) &&
    (await canDownloadShopProduct(user?.id, product));

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <ShopToolbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <Link href="/shop" className="eldonia-link text-sm">
          {t.shop.backToShop}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-6">
            <div className="eldonia-card overflow-hidden p-0">
              <div className="flex aspect-square max-h-[32rem] items-center justify-center bg-[var(--eldonia-surface)]">
                {product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-8xl opacity-80" aria-hidden>
                    {icon}
                  </span>
                )}
              </div>
            </div>

            <section className="eldonia-card">
              <ContentLine
                text={product.title}
                locale={locale}
                as="h1"
                className="eldonia-heading eldonia-heading-sm"
                hintClassName="eldonia-localized-hint text-sm"
              />
              <p className="mt-2 text-sm text-[var(--eldonia-text-muted)]">
                {t.shop.seller}: {sellerName}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.is_bestseller && (
                  <span className="eldonia-badge-bestseller">{t.pages.shop.badgeBestseller}</span>
                )}
                {product.is_nexus_choice && (
                  <span className="eldonia-badge-nexus-choice">{t.pages.shop.badgeChoice}</span>
                )}
              </div>

              <div className="my-6">
                <EldoniaDivider />
              </div>

              <h2 className="eldonia-label">{t.shop.aboutHeading}</h2>
              <ContentLine
                text={description}
                locale={locale}
                as="p"
                className="eldonia-body mt-3 whitespace-pre-wrap text-sm"
                hintClassName="eldonia-localized-hint text-xs"
              />

              {product.tags.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-[var(--eldonia-border)] px-3 py-1 text-xs text-[var(--eldonia-text-muted)]"
                    >
                      #<TagWithHint text={tag} locale={locale} />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="eldonia-card">
              <h2 className="eldonia-label">{t.shop.detailsHeading}</h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div className="flex justify-between gap-4 border-b border-[var(--eldonia-border)] pb-2">
                  <dt className="text-[var(--eldonia-text-dim)]">{t.shop.labelRealm}</dt>
                  <dd>{realmLabel(product.category, locale)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[var(--eldonia-border)] pb-2">
                  <dt className="text-[var(--eldonia-text-dim)]">{t.shop.labelType}</dt>
                  <dd>
                    {product.product_type === "digital"
                      ? t.shop.typeDigital
                      : t.shop.typePhysical}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[var(--eldonia-border)] pb-2">
                  <dt className="text-[var(--eldonia-text-dim)]">{t.shop.labelNexusPrime}</dt>
                  <dd>
                    {product.is_nexus_prime ? t.shop.nexusPrimeYes : t.shop.nexusPrimeNo}
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          <ProductBuyBox product={product} isLoggedIn={!!user} canDownload={canDownload} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
