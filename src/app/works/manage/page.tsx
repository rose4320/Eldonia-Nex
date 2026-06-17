import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { EmployerDashboard } from "@/components/works/employer-dashboard";
import { JobCreateForm } from "@/components/works/job-create-form";
import { WorksToolbar } from "@/components/works/works-toolbar";
import { localizeJobListings } from "@/lib/works/localize-job";
import {
  getApplicationsForPoster,
  getMyJobListings,
} from "@/lib/works/get-employer-works";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

export default async function WorksManagePage() {
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
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
  const localizedJobs = localizeJobListings(jobs, locale);

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <WorksToolbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <Link href="/works" className="eldonia-link text-sm">
          {pages.works.back}
        </Link>
        <h1 className="eldonia-heading eldonia-heading-lg mt-4">{pages.works.manageTitle}</h1>
        <p className="eldonia-body mt-2 text-sm">{pages.works.manageLead}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[22rem_1fr]">
          <JobCreateForm />
          <EmployerDashboard jobs={localizedJobs} applications={applications} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
