import Link from "next/link";
import { PageIntro } from "@/components/layout/page-intro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductCard } from "@/components/shop/product-card";
import { ShopHeroStrip } from "@/components/shop/shop-hero-strip";
import { ShopSidebar } from "@/components/shop/shop-sidebar";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import { LpSectionRule } from "@/components/ui/lp-section-rule";
import { getShopProducts } from "@/lib/shop/get-products";
import {
  excludeProductIds,
  pickFeaturedProducts,
} from "@/lib/shop/dedupe-products";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { MODULE_ICONS } from "@/lib/layout/module-icons";
import { realmLabel } from "@/lib/shop/constants";

type ShopPageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const { q, category = "all" } = await searchParams;
  const products = await getShopProducts({ q, category });
  const featuredProducts = pickFeaturedProducts(products, 3);
  const featuredIds = new Set(featuredProducts.map((product) => product.id));
  const gridProducts = excludeProductIds(products, featuredIds);

  const heading =
    q?.trim()
      ? t.common.searchResults(q.trim())
      : category !== "all"
        ? realmLabel(category, locale)
        : t.shop.heading;

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />
      <ShopToolbar query={q} />

      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="SHOP"
          title={heading}
          lead={t.shop.lead}
          iconSrc={MODULE_ICONS.shop}
        />

        <LpSectionRule />

        <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
          <ShopSidebar activeCategory={category} query={q} />

          <div className="flex min-w-0 flex-col gap-8">
            <ShopHeroStrip products={featuredProducts} />

            {gridProducts.length > 0 || products.length === 0 ? (
            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-sm tracking-wider text-[var(--eldonia-gold-muted)] uppercase">
                  {t.common.countItems(
                    gridProducts.length > 0 ? gridProducts.length : products.length,
                    t.shop.productUnit,
                  )}
                </h2>
                {(q || category !== "all") && (
                  <Link href="/shop" className="eldonia-link text-sm">
                    {t.common.clearFilter}
                  </Link>
                )}
              </div>

              {products.length === 0 ? (
                <div className="eldonia-card-dashed rounded-xl px-8 py-16 text-center">
                  <p className="eldonia-body">{t.shop.empty}</p>
                  <Link href="/shop" className="eldonia-link mt-4 inline-block text-sm">
                    {t.shop.viewAll}
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {gridProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </section>
            ) : null}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
