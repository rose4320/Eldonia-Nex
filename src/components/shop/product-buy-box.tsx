"use client";

import Link from "next/link";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import {
  discountPercent,
  formatPrice,
  realmLabel,
} from "@/lib/shop/constants";
import type { ShopProductWithSeller } from "@/types/database";
import { StarRating } from "./star-rating";

type ProductBuyBoxProps = {
  product: ShopProductWithSeller;
  isLoggedIn: boolean;
};

export function ProductBuyBox({ product, isLoggedIn }: ProductBuyBoxProps) {
  const locale = useLocale();
  const t = useContent().shop;
  const discount = discountPercent(product.price, product.compare_at_price);
  const inStock =
    product.product_type === "digital" ||
    product.stock_quantity === null ||
    product.stock_quantity > 0;

  return (
    <div className="eldonia-buy-box sticky top-6 space-y-4">
      {product.compare_at_price && (
        <p className="text-sm text-[var(--eldonia-text-dim)]">
          {t.comparePrice}:{" "}
          <span className="line-through">{formatPrice(product.compare_at_price, locale)}</span>
          {discount && (
            <span className="ml-2 text-[var(--eldonia-gold)]">-{discount}%</span>
          )}
        </p>
      )}

      <p className="font-display text-3xl text-[var(--eldonia-gold-light)]">
        {formatPrice(product.price, locale)}
      </p>

      <StarRating
        rating={product.rating}
        reviewCount={product.review_count}
        size="md"
        locale={locale}
        ratingAria={t.ratingAria}
      />

      <div className="space-y-2 border-t border-[var(--eldonia-border)] pt-4 text-sm">
        {product.is_nexus_prime && (
          <p className="eldonia-badge-nexus-prime">
            <span aria-hidden>⚜</span> {t.nexusPrimeEligible}
          </p>
        )}
        <p className="text-[var(--eldonia-text-muted)]">
          {t.labelRealm}: {realmLabel(product.category, locale)}
        </p>
        <p className="text-[var(--eldonia-text-muted)]">
          {t.labelType}:{" "}
          {product.product_type === "digital" ? t.typeDigitalLong : t.typePhysicalLong}
        </p>
        {product.product_type === "physical" && product.stock_quantity !== null && (
          <p className={inStock ? "text-[var(--eldonia-gold-muted)]" : "eldonia-alert-error"}>
            {inStock
              ? t.inStock(product.stock_quantity)
              : t.outOfStock}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {isLoggedIn ? (
          <>
            <AddToCartButton kind="shop" id={product.id} disabled={!inStock} />
            <AddToCartButton
              kind="shop"
              id={product.id}
              label={t.buyNow}
              disabled={!inStock}
              buyNow
              className="eldonia-btn-secondary w-full"
            />
          </>
        ) : (
          <Link
            href={`/auth/login?redirect_to=/shop/${product.id}`}
            className="eldonia-btn-primary w-full text-center"
          >
            {t.loginToBuy}
          </Link>
        )}
      </div>

      <p className="eldonia-hint text-center">{t.secureCheckout}</p>
    </div>
  );
}
