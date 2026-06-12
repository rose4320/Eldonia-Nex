import Link from "next/link";
import { getCart } from "@/lib/cart/cookie-cart";

type ShopToolbarProps = {
  query?: string;
};

export async function ShopToolbar({ query }: ShopToolbarProps) {
  const cart = await getCart();
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  return (
    <div className="eldonia-shop-toolbar">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-3">
        <Link href="/shop" className="eldonia-eyebrow shrink-0 hover:text-[var(--eldonia-gold-light)]">
          SHOP
        </Link>

        <form action="/shop" method="get" className="eldonia-shop-search min-w-[12rem] flex-1">
          <input
            type="search"
            name="q"
            defaultValue={query ?? ""}
            placeholder="Nexus 内を検索..."
            className="eldonia-shop-search-input"
            aria-label="商品検索"
          />
          <button type="submit" className="eldonia-shop-search-btn">
            検索
          </button>
        </form>

        <Link href="/shop/cart" className="eldonia-btn-ghost shrink-0 text-xs">
          カート · {count}
        </Link>
      </div>
    </div>
  );
}
