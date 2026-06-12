"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  applicationStatusLabel,
  jobStatusLabel,
  type JobApplicationWithApplicant,
} from "@/lib/works/employer-types";
import { jobTypeLabel } from "@/lib/works/constants";
import type { JobListingWithPoster } from "@/types/database";

type EmployerDashboardProps = {
  jobs: JobListingWithPoster[];
  applications: JobApplicationWithApplicant[];
};

export function EmployerDashboard({ jobs, applications }: EmployerDashboardProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function updateJobStatus(jobId: string, status: string) {
    setLoadingId(jobId);
    await fetch("/api/works/jobs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, status }),
    });
    setLoadingId(null);
    router.refresh();
  }

  async function updateApplicationStatus(applicationId: string, status: string) {
    setLoadingId(applicationId);
    await fetch("/api/works/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, status }),
    });
    setLoadingId(null);
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-4">
        <h2 className="eldonia-label">掲載中の求人 ({jobs.length})</h2>
        {jobs.length === 0 ? (
          <p className="eldonia-body text-sm">まだ求人を掲載していません。</p>
        ) : (
          jobs.map((job) => (
            <article key={job.id} className="eldonia-card space-y-2">
              <h3 className="font-display text-[var(--eldonia-gold-light)]">{job.title}</h3>
              <p className="text-xs text-[var(--eldonia-text-dim)]">
                {jobTypeLabel(job.job_type)} · {jobStatusLabel(job.status)}
              </p>
              <div className="flex flex-wrap gap-2">
                {job.status === "open" && (
                  <button
                    type="button"
                    disabled={loadingId === job.id}
                    onClick={() => updateJobStatus(job.id, "closed")}
                    className="eldonia-btn-ghost text-xs"
                  >
                    募集終了
                  </button>
                )}
                {job.status !== "open" && (
                  <button
                    type="button"
                    disabled={loadingId === job.id}
                    onClick={() => updateJobStatus(job.id, "open")}
                    className="eldonia-btn-ghost text-xs"
                  >
                    再開
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </section>

      <section className="space-y-4">
        <h2 className="eldonia-label">応募 ({applications.length})</h2>
        {applications.length === 0 ? (
          <p className="eldonia-body text-sm">応募はまだありません。</p>
        ) : (
          applications.map((app) => {
            const applicant =
              app.profiles?.display_name ?? app.profiles?.username ?? "応募者";
            const snapshot = app.portfolio_snapshot as {
              headline?: string;
              level?: number;
              title_badge?: string;
            } | null;

            return (
              <article key={app.id} className="eldonia-card space-y-2">
                <p className="text-xs text-[var(--eldonia-gold-muted)]">
                  {app.job_listings?.title}
                </p>
                <h3 className="font-display text-sm">{applicant}</h3>
                <p className="eldonia-body line-clamp-3 text-sm">{app.cover_message}</p>
                {snapshot && (
                  <p className="text-xs text-[var(--eldonia-text-dim)]">
                    Portfolio: {snapshot.headline} · Lv.{snapshot.level} ·{" "}
                    {snapshot.title_badge}
                  </p>
                )}
                <p className="text-xs">{applicationStatusLabel(app.status)}</p>
                <div className="flex flex-wrap gap-2">
                  {(["reviewing", "accepted", "rejected"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={loadingId === app.id || app.status === status}
                      onClick={() => updateApplicationStatus(app.id, status)}
                      className="eldonia-btn-ghost text-xs"
                    >
                      {applicationStatusLabel(status)}
                    </button>
                  ))}
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
