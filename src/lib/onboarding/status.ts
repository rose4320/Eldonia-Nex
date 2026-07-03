import type { SupabaseClient } from "@supabase/supabase-js";
import { resolvePostLoginPath, sanitizeRedirectTo } from "@/lib/auth/redirect";
import type { Database } from "@/types/database";

type AppSupabaseClient = SupabaseClient<Database>;

export function buildSignupResumePath(redirectTo?: string | null): string {
  const destination = sanitizeRedirectTo(redirectTo);
  const params = new URLSearchParams({ resume: "1" });

  if (destination !== "/") {
    params.set("redirect_to", destination);
  }

  return `/auth/signup?${params.toString()}`;
}

export async function hasCompletedOnboarding(
  supabase: AppSupabaseClient,
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_onboarding")
    .select("completed_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return false;
  }

  return Boolean(data?.completed_at);
}

export async function resolveAuthenticatedDestination(
  supabase: AppSupabaseClient,
  userId: string,
  redirectTo?: string | null,
): Promise<string> {
  const destination = resolvePostLoginPath(redirectTo);
  const onboardingComplete = await hasCompletedOnboarding(supabase, userId);

  return onboardingComplete ? destination : buildSignupResumePath(destination);
}
