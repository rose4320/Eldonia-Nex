import type { JobApplication, JobListingWithPoster } from "@/types/database";

export type JobApplicationWithApplicant = JobApplication & {
  profiles: { display_name: string | null; username: string | null } | null;
  job_listings: Pick<JobListingWithPoster, "id" | "title"> | null;
};

export function applicationStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "未対応",
    reviewing: "確認中",
    accepted: "採用",
    rejected: "不採用",
  };
  return map[status] ?? status;
}

export function jobStatusLabel(status: string): string {
  const map: Record<string, string> = {
    open: "募集中",
    closed: "募集終了",
    filled: "充足",
  };
  return map[status] ?? status;
}
