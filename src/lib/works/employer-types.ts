import type { UiLocale } from "@/lib/i18n/locale";
import type { JobApplication, JobListingWithPoster } from "@/types/database";

export type JobApplicationWithApplicant = JobApplication & {
  profiles: { display_name: string | null; username: string | null } | null;
  job_listings: Pick<JobListingWithPoster, "id" | "title"> | null;
};

const APPLICATION_STATUS: Record<string, Record<UiLocale, string>> = {
  pending: { ja: "未対応", en: "Pending", ko: "대기", "zh-CN": "待处理" },
  reviewing: { ja: "確認中", en: "Reviewing", ko: "검토 중", "zh-CN": "审核中" },
  accepted: { ja: "採用", en: "Accepted", ko: "채용", "zh-CN": "录用" },
  rejected: { ja: "不採用", en: "Rejected", ko: "불합격", "zh-CN": "未录用" },
};

const JOB_STATUS: Record<string, Record<UiLocale, string>> = {
  open: { ja: "募集中", en: "Open", ko: "모집 중", "zh-CN": "招聘中" },
  closed: { ja: "募集終了", en: "Closed", ko: "마감", "zh-CN": "已结束" },
  filled: { ja: "充足", en: "Filled", ko: "충원", "zh-CN": "已满" },
};

export function applicationStatusLabel(status: string, locale: UiLocale = "ja"): string {
  return APPLICATION_STATUS[status]?.[locale] ?? status;
}

export function jobStatusLabel(status: string, locale: UiLocale = "ja"): string {
  return JOB_STATUS[status]?.[locale] ?? status;
}
