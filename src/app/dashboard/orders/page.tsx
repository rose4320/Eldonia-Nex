import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { OrderCard } from "@/components/commerce/order-card";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { getOrdersForUser } from "@/lib/commerce/get-orders";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardOrdersPage() {
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
        <Link href="/dashboard" className="eldonia-link text-sm">
          ← ダッシュボード
        </Link>
        <section className="mt-4 space-y-2">
          <p className="eldonia-eyebrow">Orders</p>
          <h1 className="eldonia-heading eldonia-heading-sm">注文履歴</h1>
          <p className="eldonia-body text-sm">Stripe 決済済みの注文一覧です。</p>
        </section>

        <EldoniaDivider />

        {orders.length === 0 ? (
          <div className="eldonia-card-dashed px-8 py-16 text-center">
            <p className="eldonia-body">注文履歴がありません。</p>
            <Link href="/shop" className="eldonia-link mt-4 inline-block text-sm">
              SHOP を見る →
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
