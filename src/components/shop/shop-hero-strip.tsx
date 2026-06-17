import Link from "next/link";
import { ContentLine } from "@/components/i18n/content-line";
import type { ShopProductWithSeller } from "@/types/database";
import { formatPrice } from "@/lib/shop/constants";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";

type ShopHeroStripProps = {
  products: ShopProductWithSeller[];
};

export async function ShopHeroStrip({ products }: ShopHeroStripProps) {
  const locale = await getUiLocale();
  const { shop } = getContent(locale);
  const featured = products.filter((p) => p.is_bestseller || p.is_nexus_choice).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section>
      <h2 className="eldonia-eyebrow">{shop.heroHeading}</h2>
      <div className="mt-3 flex gap-4 overflow-x-auto pb-2">
        {featured.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.id}`}
            className="eldonia-shop-hero-card group min-w-[14rem]"
          >
            <p className="eldonia-badge-bestseller">{shop.featured}</p>
            <ContentLine
              text={product.title}
              locale={locale}
              as="h3"
              className="mt-2 font-display text-sm text-[var(--eldonia-gold-light)] group-hover:text-[var(--eldonia-gold)]"
              hintClassName="eldonia-localized-hint text-[10px] line-clamp-2"
            />
            <p className="mt-2 text-lg text-[var(--eldonia-gold)]">
              {formatPrice(product.price, locale)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
