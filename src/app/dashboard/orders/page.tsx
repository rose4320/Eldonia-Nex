import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { OrderCard } from "@/components/commerce/order-card";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { getOrdersForUser } from "@/lib/commerce/get-orders";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardOrdersPage() {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect_to=/dashboard/orders");
  }

  const orders = await getOrdersForUser(user.id);

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main">
        <Link href="/settings" className="eldonia-link text-sm">
          {t.pages.dashboard.back}
        </Link>
        <section className="mt-4 space-y-2">
          <h1 className="eldonia-heading eldonia-heading-sm">{t.pages.dashboard.ordersTitle}</h1>
        </section>

        <EldoniaDivider />

        {orders.length === 0 ? (
          <div className="eldonia-card-dashed px-8 py-16 text-center">
            <p className="eldonia-body">{t.pages.dashboard.ordersEmpty}</p>
            <Link href="/shop" className="eldonia-link mt-4 inline-block text-sm">
              {t.shop.cartBrowseShop}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
