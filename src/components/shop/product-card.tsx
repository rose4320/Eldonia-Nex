import Link from "next/link";
import { TranslatedContentLine } from "@/components/i18n/content-line";
import {
  CATEGORY_ICONS,
  discountPercent,
  formatPrice,
  realmLabel,
} from "@/lib/shop/constants";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { inferSourceLocale } from "@/lib/translation/infer-source-locale";
import type { ShopProductWithSeller } from "@/types/database";
import { StarRating } from "./star-rating";

type ProductCardProps = {
  product: ShopProductWithSeller;
  translations?: { title?: string; description?: string };
};

export async function ProductCard({ product, translations }: ProductCardProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const discount = discountPercent(product.price, product.compare_at_price);
  const icon = CATEGORY_ICONS[product.category] ?? "◆";
  const titleLocale = inferSourceLocale(product.title);

  return (
    <Link href={`/shop/${product.id}`} className="eldonia-product-card group">
      <div className="eldonia-product-thumb overflow-hidden">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={translations?.title ?? product.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
          />
        ) : (
          <span aria-hidden>{icon}</span>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap gap-1">
          {product.is_bestseller && (
            <span className="eldonia-badge-bestseller">Realm Bestseller</span>
          )}
          {product.is_nexus_choice && (
            <span className="eldonia-badge-nexus-choice">Nexus Choice</span>
          )}
        </div>

        <TranslatedContentLine
          text={product.title}
          translatedText={translations?.title}
          sourceLocale={titleLocale}
          locale={locale}
          as="h2"
          className="line-clamp-2 text-sm leading-snug text-[var(--eldonia-text)] group-hover:text-[var(--eldonia-gold-light)]"
          hintClassName="eldonia-localized-hint text-[11px] line-clamp-2"
        />

        <StarRating
          rating={product.rating}
          reviewCount={product.review_count}
          locale={locale}
          ratingAria={t.shop.ratingAria}
        />

        <div className="mt-auto flex flex-wrap items-baseline gap-2">
          <span className="font-display text-lg text-[var(--eldonia-gold-light)]">
            {formatPrice(product.price, locale)}
          </span>
          {product.compare_at_price && (
            <span className="text-xs text-[var(--eldonia-text-dim)] line-through">
              {formatPrice(product.compare_at_price, locale)}
            </span>
          )}
          {discount && (
            <span className="text-xs text-[var(--eldonia-gold)]">-{discount}%</span>
          )}
        </div>

        {product.is_nexus_prime && (
          <p className="eldonia-badge-nexus-prime w-fit">
            <span aria-hidden>⚜</span> {t.shop.nexusPrimeBadge}
          </p>
        )}

        <p className="text-[10px] uppercase tracking-wider text-[var(--eldonia-text-dim)]">
          {realmLabel(product.category, locale)}
          {product.product_type === "digital" ? t.shop.instantDownload : ""}
        </p>
      </div>
    </Link>
  );
}
