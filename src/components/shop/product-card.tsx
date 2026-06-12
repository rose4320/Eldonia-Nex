import Link from "next/link";
import {
  CATEGORY_ICONS,
  discountPercent,
  formatPrice,
  realmLabel,
} from "@/lib/shop/constants";
import type { ShopProductWithSeller } from "@/types/database";
import { StarRating } from "./star-rating";

type ProductCardProps = {
  product: ShopProductWithSeller;
};

export function ProductCard({ product }: ProductCardProps) {
  const discount = discountPercent(product.price, product.compare_at_price);
  const icon = CATEGORY_ICONS[product.category] ?? "◆";

  return (
    <Link href={`/shop/${product.id}`} className="eldonia-product-card group">
      <div className="eldonia-product-thumb overflow-hidden">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.title}
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

        <h2 className="line-clamp-2 text-sm leading-snug text-[var(--eldonia-text)] group-hover:text-[var(--eldonia-gold-light)]">
          {product.title}
        </h2>

        <StarRating rating={product.rating} reviewCount={product.review_count} />

        <div className="mt-auto flex flex-wrap items-baseline gap-2">
          <span className="font-display text-lg text-[var(--eldonia-gold-light)]">
            {formatPrice(product.price)}
          </span>
          {product.compare_at_price && (
            <span className="text-xs text-[var(--eldonia-text-dim)] line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
          {discount && (
            <span className="text-xs text-[var(--eldonia-gold)]">-{discount}%</span>
          )}
        </div>

        {product.is_nexus_prime && (
          <p className="eldonia-badge-nexus-prime w-fit">
            <span aria-hidden>⚜</span> Nexus Prime 対象
          </p>
        )}

        <p className="text-[10px] uppercase tracking-wider text-[var(--eldonia-text-dim)]">
          {realmLabel(product.category)}
          {product.product_type === "digital" ? " · 即時DL" : ""}
        </p>
      </div>
    </Link>
  );
}
