import Link from "next/link";
import { SHOP_REALMS } from "@/lib/shop/constants";

type ShopSidebarProps = {
  activeCategory?: string;
  query?: string;
};

export function ShopSidebar({ activeCategory = "all", query }: ShopSidebarProps) {
  function hrefFor(category: string) {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (query?.trim()) params.set("q", query.trim());
    const qs = params.toString();
    return qs ? `/shop?${qs}` : "/shop";
  }

  return (
    <aside className="eldonia-shop-sidebar">
      <h2 className="eldonia-label">Realms</h2>
      <p className="eldonia-hint mt-1">領域で探す</p>
      <nav className="mt-4 flex flex-col gap-1">
        {SHOP_REALMS.map((realm) => {
          const active = activeCategory === realm.value;
          return (
            <Link
              key={realm.value}
              href={hrefFor(realm.value)}
              className={`rounded px-3 py-2 text-sm transition-colors ${
                active
                  ? "border border-[var(--eldonia-border-strong)] bg-[rgba(201,168,76,0.1)] text-[var(--eldonia-gold-light)]"
                  : "text-[var(--eldonia-text-muted)] hover:text-[var(--eldonia-gold)]"
              }`}
            >
              {realm.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
