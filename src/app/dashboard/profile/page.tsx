import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect_to=/dashboard/profile");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/dashboard");
  }

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main eldonia-main-narrow">
        <div>
          <Link href="/dashboard" className="eldonia-link text-sm">
            ← ダッシュボード
          </Link>
          <h1 className="eldonia-heading eldonia-heading-sm mt-3">プロフィール編集</h1>
          <p className="eldonia-body mt-1 text-sm">公開プロフィール情報を更新できます。</p>
        </div>

        <section className="eldonia-card">
          <ProfileForm profile={profile} />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
