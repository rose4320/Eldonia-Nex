import Link from "next/link";
import { ClearCartOnMount } from "@/components/commerce/clear-cart-on-mount";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string; free?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const { session_id, free } = await searchParams;
  const isFree = free === "1";

  return (
    <div className="eldonia-page">
      <ClearCartOnMount />
      <SiteHeader />
      <main className="eldonia-main flex flex-1 items-center justify-center">
        <section className="eldonia-card max-w-lg text-center">
          <p className="eldonia-eyebrow">{t.pages.checkout.eyebrow}</p>
          <h1 className="eldonia-heading eldonia-heading-lg mt-3">
            {isFree ? t.pages.checkout.titleFree : t.pages.checkout.title}
          </h1>
          <p className="eldonia-body mt-4 text-sm">
            {isFree ? t.pages.checkout.bodyFree : t.pages.checkout.body}
          </p>
          {session_id && (
            <p className="eldonia-hint mt-2 break-all">Session: {session_id}</p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="eldonia-btn-primary">
              {t.pages.checkout.backShop}
            </Link>
            <Link href="/settings" className="eldonia-btn-secondary">
              {t.pages.checkout.dashboard}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
