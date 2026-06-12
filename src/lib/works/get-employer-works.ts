import { createClient } from "@/lib/supabase/server";
import type { JobListingWithPoster } from "@/types/database";
import type { JobApplicationWithApplicant } from "./employer-types";

export type { JobApplicationWithApplicant } from "./employer-types";
export { applicationStatusLabel, jobStatusLabel } from "./employer-types";

export async function getMyJobListings(userId: string): Promise<JobListingWithPoster[]> {
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
      .eq("poster_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) return data as JobListingWithPoster[];
  } catch {
    // ignore
  }
  return [];
}

export async function getApplicationsForPoster(
  userId: string,
): Promise<JobApplicationWithApplicant[]> {
  try {
    const supabase = await createClient();
    const { data: jobs } = await supabase
      .from("job_listings")
      .select("id")
      .eq("poster_id", userId);

    const jobIds = (jobs ?? []).map((j) => j.id);
    if (jobIds.length === 0) return [];

    const { data, error } = await supabase
      .from("job_applications")
      .select(
        `
        *,
        profiles:applicant_id (display_name, username),
        job_listings:job_id (id, title)
      `,
      )
      .in("job_id", jobIds)
      .order("created_at", { ascending: false });

    if (!error && data) return data as JobApplicationWithApplicant[];
  } catch {
    // ignore
  }
  return [];
}
