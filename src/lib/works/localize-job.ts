import type { UiLocale } from "@/lib/i18n/locale";
import { phraseTranslation } from "@/lib/i18n/phrases";
import type { JobListingWithPoster } from "@/types/database";
import { getSampleJobs } from "./sample-data";

function translateField(text: string, locale: UiLocale): string {
  return phraseTranslation(text, locale) ?? text;
}

/** DB の日本語シード等を UI ロケール向けテキストに差し替え */
export function localizeJobListing(
  job: JobListingWithPoster,
  locale: UiLocale,
): JobListingWithPoster {
  if (locale === "ja") return job;

  const catalog = getSampleJobs(locale).find((s) => s.id === job.id);
  if (catalog) {
    return {
      ...job,
      title: catalog.title,
      description: catalog.description,
      location: catalog.location,
      skills_required: catalog.skills_required,
      profiles:
        job.profiles?.display_name || job.profiles?.username
          ? job.profiles
          : catalog.profiles,
    };
  }

  return {
    ...job,
    title: translateField(job.title, locale),
    description: translateField(job.description, locale),
    location: job.location ? translateField(job.location, locale) : null,
    skills_required: job.skills_required.map((s) => translateField(s, locale)),
  };
}

export function localizeJobListings(
  jobs: JobListingWithPoster[],
  locale: UiLocale,
): JobListingWithPoster[] {
  return jobs.map((job) => localizeJobListing(job, locale));
}
