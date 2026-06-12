import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PortfolioForm } from "@/components/works/portfolio-form";
import { WorksToolbar } from "@/components/works/works-toolbar";
import { createClient } from "@/lib/supabase/server";
import { getPortfolioForUser } from "@/lib/works/get-works";

export default async function PortfolioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect_to=/works/portfolio");
  }

  const portfolio = await getPortfolioForUser(user.id, { useSampleFallback: false });

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <WorksToolbar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
        <Link href="/works" className="eldonia-link text-sm">
          ← WORKS
        </Link>
        <h1 className="eldonia-heading eldonia-heading-lg mt-4">ポートフォリオ</h1>
        <p className="eldonia-body mt-2 text-sm">
          応募時に添付される公開プロフィール。EXP・称号・スキルを編集できます。
        </p>

        <PortfolioForm userId={user.id} portfolio={portfolio} />
      </main>

      <SiteFooter />
    </div>
  );
}
