import type { ShopProductWithSeller } from "@/types/database";

function normalizeTitle(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, " ");
}

function buildDedupeKey(product: ShopProductWithSeller): string {
  if (product.source_artwork_id) {
    return `artwork:${product.source_artwork_id}`;
  }

  const image = product.image_url?.trim();
  if (product.seller_id && image) {
    return `media:${product.seller_id}:${image}`;
  }

  return `title:${product.seller_id ?? "platform"}:${normalizeTitle(product.title)}`;
}

/** 同一作品・同一画像・同一タイトルの重複を除き、最新の1件だけ残す。 */
export function dedupeShopProducts(
  products: ShopProductWithSeller[],
): ShopProductWithSeller[] {
  const byKey = new Map<string, ShopProductWithSeller>();

  for (const product of products) {
    const key = buildDedupeKey(product);
    const existing = byKey.get(key);
    if (!existing || product.created_at > existing.created_at) {
      byKey.set(key, product);
    }
  }

  return [...byKey.values()].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

/** ヒーロー帯用の注目商品（最大 limit 件）。 */
export function pickFeaturedProducts(
  products: ShopProductWithSeller[],
  limit = 3,
): ShopProductWithSeller[] {
  const featured = products.filter((p) => p.is_bestseller || p.is_nexus_choice);
  if (featured.length >= limit) {
    return featured.slice(0, limit);
  }

  const seen = new Set(featured.map((p) => p.id));
  for (const product of products) {
    if (featured.length >= limit) break;
    if (seen.has(product.id)) continue;
    featured.push(product);
    seen.add(product.id);
  }

  return featured.slice(0, limit);
}

export function excludeProductIds(
  products: ShopProductWithSeller[],
  excludeIds: Set<string>,
): ShopProductWithSeller[] {
  if (excludeIds.size === 0) return products;
  return products.filter((product) => !excludeIds.has(product.id));
}
