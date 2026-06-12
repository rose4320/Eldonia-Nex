import Link from "next/link";
import type { ShopProductWithSeller } from "@/types/database";
import { formatPrice } from "@/lib/shop/constants";

type ShopHeroStripProps = {
  products: ShopProductWithSeller[];
};

export function ShopHeroStrip({ products }: ShopHeroStripProps) {
  const featured = products.filter((p) => p.is_bestseller || p.is_nexus_choice).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section>
      <h2 className="eldonia-eyebrow">Featured in the Nexus</h2>
      <div className="mt-3 flex gap-4 overflow-x-auto pb-2">
        {featured.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.id}`}
            className="eldonia-shop-hero-card group"
          >
            <p className="eldonia-badge-bestseller">注目</p>
            <h3 className="mt-2 font-display text-sm text-[var(--eldonia-gold-light)] group-hover:text-[var(--eldonia-gold)]">
              {product.title}
            </h3>
            <p className="mt-2 text-lg text-[var(--eldonia-gold)]">
              {formatPrice(product.price)}
            </p>
            {product.is_nexus_prime && (
              <p className="eldonia-badge-nexus-prime mt-2">Nexus Prime</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
