"use client";

import Link from "next/link";
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
  const discount = discountPercent(product.price, product.compare_at_price);
  const inStock =
    product.product_type === "digital" ||
    product.stock_quantity === null ||
    product.stock_quantity > 0;

  return (
    <div className="eldonia-buy-box sticky top-6 space-y-4">
      {product.compare_at_price && (
        <p className="text-sm text-[var(--eldonia-text-dim)]">
          参考価格:{" "}
          <span className="line-through">{formatPrice(product.compare_at_price)}</span>
          {discount && (
            <span className="ml-2 text-[var(--eldonia-gold)]">-{discount}%</span>
          )}
        </p>
      )}

      <p className="font-display text-3xl text-[var(--eldonia-gold-light)]">
        {formatPrice(product.price)}
      </p>

      <StarRating rating={product.rating} reviewCount={product.review_count} size="md" />

      <div className="space-y-2 border-t border-[var(--eldonia-border)] pt-4 text-sm">
        {product.is_nexus_prime && (
          <p className="eldonia-badge-nexus-prime">
            <span aria-hidden>⚜</span> Nexus Prime 対象 — 送料無料・特典あり
          </p>
        )}
        <p className="text-[var(--eldonia-text-muted)]">
          領域: {realmLabel(product.category)}
        </p>
        <p className="text-[var(--eldonia-text-muted)]">
          種別: {product.product_type === "digital" ? "デジタル（即時ダウンロード）" : "物理商品"}
        </p>
        {product.product_type === "physical" && product.stock_quantity !== null && (
          <p className={inStock ? "text-[var(--eldonia-gold-muted)]" : "eldonia-alert-error"}>
            {inStock ? `在庫: 残り ${product.stock_quantity} 点` : "在庫切れ"}
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
              label="今すぐ購入"
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
            ログインして購入
          </Link>
        )}
      </div>

      <p className="eldonia-hint text-center">
        安全な決済 · Eldonia-Nex 出品者保護（準備中）
      </p>
    </div>
  );
}
