import type { UiLocale } from "@/lib/i18n/locale";
import { createClient } from "@/lib/supabase/server";
import type { JobListingWithPoster, Portfolio } from "@/types/database";
import { getSampleJobs, getSamplePortfolio } from "./sample-data";
import { localizeJobListing, localizeJobListings } from "./localize-job";

type JobFilters = { q?: string; type?: string };

function filterJobs(jobs: JobListingWithPoster[], filters: JobFilters) {
  let result = jobs.filter((j) => j.status === "open");
  if (filters.type && filters.type !== "all") {
    result = result.filter((j) => j.job_type === filters.type);
  }
  const term = filters.q?.trim().toLowerCase();
  if (term) {
    result = result.filter(
      (j) =>
        j.title.toLowerCase().includes(term) ||
        j.description.toLowerCase().includes(term) ||
        j.skills_required.some((s) => s.toLowerCase().includes(term)),
    );
  }
  return result;
}

export async function getJobListings(
  filters: JobFilters = {},
  locale: UiLocale = "ja",
): Promise<JobListingWithPoster[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("job_listings")
      .select(
        `
        *,
        profiles:poster_id (display_name, username)
      `,
      )
      .eq("status", "open")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (!error && data?.length) {
      return filterJobs(
        localizeJobListings(data as JobListingWithPoster[], locale),
        filters,
      );
    }
  } catch {
    // fallback
  }
  return filterJobs(getSampleJobs(locale), filters);
}

export async function getJobListing(
  id: string,
  locale: UiLocale = "ja",
): Promise<JobListingWithPoster | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("job_listings")
      .select(
        `
        *,
        profiles:poster_id (display_name, username)
      `,
      )
      .eq("id", id)
      .single();

    if (!error && data) {
      return localizeJobListing(data as JobListingWithPoster, locale);
    }
  } catch {
    // fallback
  }
  return getSampleJobs(locale).find((j) => j.id === id) ?? null;
}

export async function getPortfolioForUser(
  userId: string,
  options?: { useSampleFallback?: boolean; locale?: UiLocale },
): Promise<Portfolio | null> {
  const locale = options?.locale ?? "ja";
  const sample = getSamplePortfolio(locale);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) return data as Portfolio;
    if (!error && !data) {
      return options?.useSampleFallback === false
        ? null
        : { ...sample, user_id: userId };
    }
  } catch {
    // fallback
  }
  return options?.useSampleFallback === false
    ? null
    : { ...sample, user_id: userId };
}
