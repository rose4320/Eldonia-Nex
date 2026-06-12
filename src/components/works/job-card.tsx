import Link from "next/link";
import { formatBudget, jobTypeLabel } from "@/lib/works/constants";
import type { JobListingWithPoster } from "@/types/database";

type JobCardProps = { job: JobListingWithPoster };

export function JobCard({ job }: JobCardProps) {
  const poster = job.profiles?.display_name ?? job.profiles?.username ?? "求人主";

  return (
    <Link href={`/works/${job.id}`} className="eldonia-job-card group">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          {job.is_featured && (
            <span className="eldonia-badge-bestseller mb-2 inline-block">Featured</span>
          )}
          <h2 className="font-display text-lg text-[var(--eldonia-gold-light)] group-hover:text-[var(--eldonia-gold)]">
            {job.title}
          </h2>
          <p className="mt-1 text-sm text-[var(--eldonia-text-muted)]">{poster}</p>
        </div>
        <span className="eldonia-badge-nexus-prime">{jobTypeLabel(job.job_type)}</span>
      </div>
      <p className="eldonia-body mt-3 line-clamp-2 text-sm">{job.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills_required.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-[var(--eldonia-border)] px-2 py-0.5 text-xs text-[var(--eldonia-text-dim)]"
          >
            {skill}
          </span>
        ))}
      </div>
      <p className="mt-4 font-display text-[var(--eldonia-gold)]">
        {formatBudget(job.budget_min, job.budget_max)}
        {job.location && (
          <span className="ml-3 text-sm text-[var(--eldonia-text-dim)]">{job.location}</span>
        )}
      </p>
    </Link>
  );
}
