import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { EmployerDashboard } from "@/components/works/employer-dashboard";
import { JobCreateForm } from "@/components/works/job-create-form";
import { WorksToolbar } from "@/components/works/works-toolbar";
import {
  getApplicationsForPoster,
  getMyJobListings,
} from "@/lib/works/get-employer-works";
import { createClient } from "@/lib/supabase/server";

export default async function WorksManagePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect_to=/works/manage");
  }

  const [jobs, applications] = await Promise.all([
    getMyJobListings(user.id),
    getApplicationsForPoster(user.id),
  ]);

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <WorksToolbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <Link href="/works" className="eldonia-link text-sm">
          ← WORKS
        </Link>
        <h1 className="eldonia-heading eldonia-heading-lg mt-4">Guild 管理</h1>
        <p className="eldonia-body mt-2 text-sm">
          求人の掲載・応募管理。求人主向けダッシュボードです。
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[22rem_1fr]">
          <JobCreateForm />
          <EmployerDashboard jobs={jobs} applications={applications} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
