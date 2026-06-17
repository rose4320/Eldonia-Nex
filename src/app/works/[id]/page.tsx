import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JobApplyForm } from "@/components/works/job-apply-form";
import { WorksToolbar } from "@/components/works/works-toolbar";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { ContentLine, TagWithHint } from "@/components/i18n/content-line";
import { formatBudget, jobTypeLabel } from "@/lib/works/constants";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { localizedHint } from "@/lib/i18n/localized-hint";
import { getJobListing, getPortfolioForUser } from "@/lib/works/get-works";
import { createClient } from "@/lib/supabase/server";

type JobDetailPageProps = { params: Promise<{ id: string }> };

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const job = await getJobListing(id, locale);

  if (!job) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const portfolio = user
    ? await getPortfolioForUser(user.id, { locale })
    : null;
  const poster =
    job.profiles?.display_name ?? job.profiles?.username ?? pages.posterFallback;
  const locationHint = job.location ? localizedHint(job.location, locale) : null;

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <WorksToolbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <Link href="/works" className="eldonia-link text-sm">
          {pages.works.back}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <article className="eldonia-card space-y-4">
            {job.is_featured && (
              <span className="eldonia-badge-bestseller">{pages.works.badgeFeatured}</span>
            )}
            <ContentLine
              text={job.title}
              locale={locale}
              as="h1"
              className="eldonia-heading eldonia-heading-sm"
              hintClassName="eldonia-localized-hint text-sm"
            />
            <p className="text-sm text-[var(--eldonia-text-muted)]">
              {pages.works.labelPoster}: {poster}
            </p>
            <div className="my-4">
              <EldoniaDivider />
            </div>
            <ContentLine
              text={job.description}
              locale={locale}
              as="p"
              className="eldonia-body whitespace-pre-wrap text-sm"
              hintClassName="eldonia-localized-hint text-xs"
            />
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[var(--eldonia-text-dim)]">{pages.works.labelType}</dt>
                <dd>{jobTypeLabel(job.job_type, locale)}</dd>
              </div>
              <div>
                <dt className="text-[var(--eldonia-text-dim)]">{pages.works.labelPay}</dt>
                <dd>{formatBudget(job.budget_min, job.budget_max, locale)}</dd>
              </div>
              <div>
                <dt className="text-[var(--eldonia-text-dim)]">{pages.works.labelLocation}</dt>
                <dd>
                  {job.location ? (
                    <>
                      {job.location}
                      {locationHint && (
                        <span className="eldonia-localized-hint-inline"> ({locationHint})</span>
                      )}
                    </>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
            <ul className="flex flex-wrap gap-2">
              {job.skills_required.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-[var(--eldonia-border)] px-3 py-1 text-xs"
                >
                  <TagWithHint text={skill} locale={locale} />
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
