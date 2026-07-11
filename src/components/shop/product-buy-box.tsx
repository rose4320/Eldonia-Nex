"use client";

import Link from "next/link";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductDownloadLink } from "@/components/shop/product-download-link";
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
  canDownload?: boolean;
  hasClaimed?: boolean;
  isSeller?: boolean;
};

export function ProductBuyBox({
  product,
  isLoggedIn,
  canDownload = false,
  hasClaimed = false,
  isSeller = false,
}: ProductBuyBoxProps) {
  const locale = useLocale();
  const t = useContent().shop;
  const discount = discountPercent(product.price, product.compare_at_price);
  const inStock =
    product.product_type === "digital" ||
    product.stock_quantity === null ||
    product.stock_quantity > 0;
  const isFree = product.price === 0;
  const showPurchaseActions = isLoggedIn && !hasClaimed && !isSeller;

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

      {hasClaimed && (
        <p className="rounded-md border border-[var(--eldonia-border)] bg-[var(--eldonia-surface)] px-3 py-2 text-center text-sm text-[var(--eldonia-gold-muted)]">
          {t.alreadyOwned}
        </p>
      )}

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
        {canDownload && (
          <ProductDownloadLink
            productId={product.id}
            label={t.downloadProduct}
            className="eldonia-btn-primary w-full text-center"
          />
        )}
        {showPurchaseActions ? (
          <>
            <AddToCartButton kind="shop" id={product.id} disabled={!inStock} />
            <AddToCartButton
              kind="shop"
              id={product.id}
              label={isFree ? t.getFree : t.buyNow}
              disabled={!inStock}
              buyNow
              freeDigitalClaim={isFree && product.product_type === "digital"}
              className="eldonia-btn-secondary w-full"
            />
          </>
        ) : !isLoggedIn ? (
          <Link
            href={`/auth/login?redirect_to=/shop/${product.id}`}
            className="eldonia-btn-primary w-full text-center"
          >
            {isFree ? t.loginToGetFree : t.loginToBuy}
          </Link>
        ) : null}
      </div>

      <p className="eldonia-hint text-center">
        {hasClaimed
          ? t.ownedHint
          : isSeller
            ? t.sellerPreviewHint
            : isFree
              ? t.freeCheckoutHint
              : t.secureCheckout}
      </p>
    </div>
  );
}
