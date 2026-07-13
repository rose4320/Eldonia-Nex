import Link from "next/link";
import { TranslatedContentLine, TagWithHint } from "@/components/i18n/content-line";
import { formatBudget, jobTypeLabel } from "@/lib/works/constants";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { localizedHint } from "@/lib/i18n/localized-hint";
import { inferSourceLocale } from "@/lib/translation/infer-source-locale";
import type { JobListingWithPoster } from "@/types/database";

type JobCardProps = {
  job: JobListingWithPoster;
  translations?: { title?: string; description?: string };
};

export async function JobCard({ job, translations }: JobCardProps) {
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const posterFallback = pages.posterFallback;
  const poster = job.profiles?.display_name ?? job.profiles?.username ?? posterFallback;
  const locationHint = job.location ? localizedHint(job.location, locale) : null;
  const titleLocale = inferSourceLocale(job.title);

  return (
    <Link href={`/works/${job.id}`} className="eldonia-job-card group">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          {job.is_featured && (
            <span className="eldonia-badge-bestseller mb-2 inline-block">
              {pages.works.badgeFeatured}
            </span>
          )}
          <TranslatedContentLine
            text={job.title}
            translatedText={translations?.title}
            sourceLocale={titleLocale}
            locale={locale}
            as="h2"
            className="font-display text-lg text-[var(--eldonia-gold-light)] group-hover:text-[var(--eldonia-gold)]"
            hintClassName="eldonia-localized-hint text-xs"
          />
          <p className="mt-1 text-sm text-[var(--eldonia-text-muted)]">{poster}</p>
        </div>
        <span className="eldonia-badge-nexus-prime">{jobTypeLabel(job.job_type, locale)}</span>
      </div>
      <TranslatedContentLine
        text={job.description}
        translatedText={translations?.description}
        sourceLocale={inferSourceLocale(job.description, titleLocale)}
        locale={locale}
        as="p"
        className="eldonia-body mt-3 line-clamp-2 text-sm"
        hintClassName="eldonia-localized-hint text-xs line-clamp-2"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills_required.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-[var(--eldonia-border)] px-2 py-0.5 text-xs text-[var(--eldonia-text-dim)]"
          >
            <TagWithHint text={skill} locale={locale} />
          </span>
        ))}
      </div>
      <p className="mt-4 font-display text-[var(--eldonia-gold)]">
        {formatBudget(job.budget_min, job.budget_max, locale)}
        {job.location && (
          <span className="ml-3 text-sm text-[var(--eldonia-text-dim)]">
            {job.location}
            {locationHint && (
              <span className="eldonia-localized-hint-inline"> ({locationHint})</span>
            )}
          </span>
        )}
      </p>
    </Link>
  );
}
