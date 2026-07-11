import type { Provider } from "@supabase/supabase-js";
import { sanitizeRedirectTo } from "@/lib/auth/redirect";
import { buildAuthCallbackUrl } from "@/lib/auth/site-url";
import { createClient, hasBrowserSupabaseConfig } from "@/lib/supabase/client";

/** Supabase-native OAuth providers wired into the auth UI. */
export type OAuthProvider = "google" | "facebook" | "twitter" | "discord";

export const OAUTH_PROVIDERS: OAuthProvider[] = [
  "google",
  "facebook",
  "twitter",
  "discord",
];

const ENABLE_FLAGS: Record<OAuthProvider, string | undefined> = {
  google: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED,
  facebook: process.env.NEXT_PUBLIC_AUTH_FACEBOOK_ENABLED,
  twitter: process.env.NEXT_PUBLIC_AUTH_TWITTER_ENABLED,
  discord: process.env.NEXT_PUBLIC_AUTH_DISCORD_ENABLED,
};

/** Google only is on by default; others require explicit NEXT_PUBLIC_AUTH_*_ENABLED=true. */
const DEFAULT_ENABLED: Record<OAuthProvider, boolean> = {
  google: true,
  facebook: false,
  twitter: false,
  discord: false,
};

/** Supabase Auth provider id (X uses `x`, not legacy `twitter`). */
const SUPABASE_PROVIDER: Record<OAuthProvider, Provider> = {
  google: "google",
  facebook: "facebook",
  twitter: "x",
  discord: "discord",
};

/** A provider is shown when Supabase is configured and its env flag allows it. */
export function isProviderEnabled(provider: OAuthProvider): boolean {
  if (!hasBrowserSupabaseConfig()) return false;

  const flag = ENABLE_FLAGS[provider];
  if (flag === "true") return true;
  if (flag === "false") return false;
  return DEFAULT_ENABLED[provider];
}

export function enabledOAuthProviders(): OAuthProvider[] {
  return OAUTH_PROVIDERS.filter((provider) => isProviderEnabled(provider));
}

/** @deprecated Use isProviderEnabled("google"). Kept for backward compatibility. */
export function isGoogleAuthEnabled(): boolean {
  return isProviderEnabled("google");
}

type SignInOptions = {
  redirectTo: string;
  origin: string;
  signup?: boolean;
  referralCode?: string | null;
};

function resolveOAuthDestination(options: SignInOptions): string {
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

  return destination;
}

export async function signInWithProvider(
  provider: OAuthProvider,
  options: SignInOptions,
): Promise<void> {
  const supabase = createClient();
  const destination = resolveOAuthDestination(options);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: SUPABASE_PROVIDER[provider],
    options: {
      redirectTo: buildAuthCallbackUrl(destination, options.origin),
    },
  });

  if (error) {
    throw error;
  }
}

/** @deprecated Use signInWithProvider("google", options). */
export async function signInWithGoogle(options: SignInOptions): Promise<void> {
  return signInWithProvider("google", options);
}
