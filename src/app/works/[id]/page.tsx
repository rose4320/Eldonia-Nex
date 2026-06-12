import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JobApplyForm } from "@/components/works/job-apply-form";
import { WorksToolbar } from "@/components/works/works-toolbar";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { formatBudget, jobTypeLabel } from "@/lib/works/constants";
import { getJobListing, getPortfolioForUser } from "@/lib/works/get-works";
import { createClient } from "@/lib/supabase/server";

type JobDetailPageProps = { params: Promise<{ id: string }> };

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await getJobListing(id);

  if (!job) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const portfolio = user ? await getPortfolioForUser(user.id) : null;
  const poster = job.profiles?.display_name ?? job.profiles?.username ?? "求人主";

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <WorksToolbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <Link href="/works" className="eldonia-link text-sm">
          ← WORKS
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <article className="eldonia-card space-y-4">
            {job.is_featured && (
              <span className="eldonia-badge-bestseller">Featured Guild Quest</span>
            )}
            <h1 className="eldonia-heading eldonia-heading-sm">{job.title}</h1>
            <p className="text-sm text-[var(--eldonia-text-muted)]">求人主: {poster}</p>
            <div className="my-4">
              <EldoniaDivider />
            </div>
            <p className="eldonia-body whitespace-pre-wrap text-sm">{job.description}</p>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[var(--eldonia-text-dim)]">種別</dt>
                <dd>{jobTypeLabel(job.job_type)}</dd>
              </div>
              <div>
                <dt className="text-[var(--eldonia-text-dim)]">報酬</dt>
                <dd>{formatBudget(job.budget_min, job.budget_max)}</dd>
              </div>
              <div>
                <dt className="text-[var(--eldonia-text-dim)]">場所</dt>
                <dd>{job.location ?? "—"}</dd>
              </div>
            </dl>
            <ul className="flex flex-wrap gap-2">
              {job.skills_required.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-[var(--eldonia-border)] px-3 py-1 text-xs"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </article>

          <JobApplyForm job={job} portfolio={portfolio} isLoggedIn={!!user} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
