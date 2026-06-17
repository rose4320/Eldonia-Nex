import Link from "next/link";
import { ContentLine } from "@/components/i18n/content-line";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import { CheckoutButton } from "@/components/cart/checkout-button";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { removeFromCart } from "@/lib/cart/cookie-cart";
import { formatCartPrice, resolveCart } from "@/lib/cart/resolve-cart";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

async function removeItem(formData: FormData) {
  "use server";
  const kind = formData.get("kind") as "shop" | "event";
  const id = formData.get("id") as string;
  await removeFromCart(kind, id);
  const { redirect } = await import("next/navigation");
  redirect("/shop/cart");
}

export default async function CartPage() {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { items, total } = await resolveCart();

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <ShopToolbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <p className="eldonia-eyebrow">CART</p>
        <h1 className="eldonia-heading eldonia-heading-lg mt-2">{t.shop.cartHeading}</h1>

        {items.length === 0 ? (
          <div className="eldonia-card-dashed mt-8 px-8 py-16 text-center">
            <p className="eldonia-body">{t.shop.cartEmpty}</p>
            <Link href="/shop" className="eldonia-link mt-4 inline-block text-sm">
              {t.shop.cartBrowseShop}
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.line.kind}-${item.line.id}`}
                className="eldonia-card flex flex-wrap items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--eldonia-gold-muted)]">{item.subtitle}</p>
                  <ContentLine
                    text={item.title}
                    locale={locale}
                    as="h2"
                    className="font-display text-[var(--eldonia-gold-light)]"
                    hintClassName="eldonia-localized-hint text-xs"
                  />
                  <p className="text-sm text-[var(--eldonia-text-dim)]">
                    {formatCartPrice(item.unitPrice)} × {item.line.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-display text-lg">{formatCartPrice(item.lineTotal)}</p>
                  <form action={removeItem}>
                    <input type="hidden" name="kind" value={item.line.kind} />
                    <input type="hidden" name="id" value={item.line.id} />
                    <button type="submit" className="eldonia-btn-ghost text-xs">
                      {t.shop.cartRemove}
                    </button>
                  </form>
                </div>
              </div>
            ))}

            <div className="eldonia-buy-box">
              <EldoniaDivider />
              <p className="mt-4 flex justify-between font-display text-xl">
                <span>{t.shop.cartTotal}</span>
                <span className="text-[var(--eldonia-gold-light)]">{formatCartPrice(total)}</span>
              </p>
              {user ? (
                <div className="mt-4">
                  <CheckoutButton />
                </div>
              ) : (
                <Link
                  href="/auth/login?redirect_to=/shop/cart"
                  className="eldonia-btn-primary mt-4 block text-center"
                >
                  {t.shop.cartLoginCheckout}
                </Link>
              )}
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
