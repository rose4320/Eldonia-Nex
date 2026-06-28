import { sanitizeRedirectTo } from "@/lib/auth/redirect";
import { buildAuthCallbackUrl } from "@/lib/auth/site-url";
import { createClient, hasBrowserSupabaseConfig } from "@/lib/supabase/client";

export function isGoogleAuthEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "false") return false;
  return hasBrowserSupabaseConfig();
}

export async function signInWithGoogle(options: {
  redirectTo: string;
  origin: string;
  signup?: boolean;
  referralCode?: string | null;
}): Promise<void> {
  const supabase = createClient();
  let destination = sanitizeRedirectTo(options.redirectTo);

  if (options.signup) {
    const params = new URLSearchParams({ resume: "1" });
    if (destination !== "/") {
      params.set("redirect_to", destination);
    }
    if (options.referralCode) {
      params.set("ref", options.referralCode);
    }
    destination = `/auth/signup?${params.toString()}`;
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: buildAuthCallbackUrl(destination, options.origin),
    },
  });

  if (error) {
    throw error;
  }
}
