import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductCard } from "@/components/shop/product-card";
import { ShopHeroStrip } from "@/components/shop/shop-hero-strip";
import { ShopSidebar } from "@/components/shop/shop-sidebar";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { getShopProducts } from "@/lib/shop/get-products";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { realmLabel } from "@/lib/shop/constants";

type ShopPageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const { q, category = "all" } = await searchParams;
  const products = await getShopProducts({ q, category });

  const heading =
    q?.trim()
      ? t.common.searchResults(q.trim())
      : category !== "all"
        ? realmLabel(category, locale)
        : t.shop.heading;

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <ShopToolbar query={q} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-8">
        <section className="space-y-2">
          <p className="eldonia-eyebrow">SHOP</p>
          <h1 className="eldonia-heading eldonia-heading-lg">{heading}</h1>
          <p className="eldonia-body text-sm">{t.shop.lead}</p>
        </section>

        <EldoniaDivider />

        <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
          <ShopSidebar activeCategory={category} query={q} />

          <div className="flex min-w-0 flex-col gap-8">
            <ShopHeroStrip products={products} />

            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-sm tracking-wider text-[var(--eldonia-gold-muted)] uppercase">
                  {t.common.countItems(products.length, t.shop.productUnit)}
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
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
