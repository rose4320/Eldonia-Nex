import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { resolvePostLoginPath, sanitizeRedirectTo } from "@/lib/auth/redirect";

export function buildSignupResumePath(finalRedirect?: string | null): string {
  const params = new URLSearchParams({ resume: "1" });
  const safe = finalRedirect ? sanitizeRedirectTo(finalRedirect) : "/";
  if (safe !== "/") {
    params.set("redirect_to", safe);
  }
  return `/auth/signup?${params.toString()}`;
}

export async function hasCompletedOnboarding(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("user_onboarding")
      .select("completed_at")
      .eq("user_id", userId)
      .maybeSingle();

    return Boolean(data?.completed_at);
  } catch {
    return false;
  }
}

/** ログイン済みユーザーの遷移先（オンボーディング未完了なら signup resume へ） */
export async function resolveAuthenticatedDestination(
  supabase: SupabaseClient<Database>,
  userId: string,
  redirectTo?: string | null,
): Promise<string> {
  const complete = await hasCompletedOnboarding(supabase, userId);
  if (!complete) {
    const safe = redirectTo ? sanitizeRedirectTo(redirectTo) : "/";
    return buildSignupResumePath(safe !== "/" ? safe : null);
  }
  return resolvePostLoginPath(redirectTo);
}

export function draftFromUserMetadata(user: User): {
  displayName: string;
  username: string;
  country: string;
} {
  const metadata = user.user_metadata ?? {};
  return {
    displayName:
      (typeof metadata.display_name === "string" ? metadata.display_name : "") ||
      user.email?.split("@")[0] ||
      "",
    username:
      typeof metadata.username === "string" ? metadata.username.toLowerCase() : "",
    country:
      typeof metadata.country === "string" ? metadata.country.toUpperCase() : "JP",
  };
}
