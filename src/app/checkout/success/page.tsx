import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { clearCart } from "@/lib/cart/cookie-cart";

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;
  await clearCart();

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <main className="eldonia-main flex flex-1 items-center justify-center">
        <section className="eldonia-card max-w-lg text-center">
          <p className="eldonia-eyebrow">Checkout</p>
          <h1 className="eldonia-heading eldonia-heading-lg mt-3">決済完了</h1>
          <p className="eldonia-body mt-4 text-sm">
            お支払いありがとうございます。確認メールは Stripe 経由で送信されます。
          </p>
          {session_id && (
            <p className="eldonia-hint mt-2 break-all">Session: {session_id}</p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="eldonia-btn-primary">
              SHOP に戻る
            </Link>
            <Link href="/dashboard" className="eldonia-btn-secondary">
              ダッシュボード
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
