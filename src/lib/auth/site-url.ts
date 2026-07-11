const DEFAULT_SITE_URL = "http://localhost:3000";

export function getPublicSiteUrl(fallbackOrigin?: string): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  if (fallbackOrigin) return fallbackOrigin.replace(/\/$/, "");
  return DEFAULT_SITE_URL;
}

export function buildAuthCallbackUrl(
  redirectTo: string,
  fallbackOrigin?: string,
  locale?: string,
): string {
  const base = fallbackOrigin
    ? fallbackOrigin.replace(/\/$/, "")
    : getPublicSiteUrl();
  const params = new URLSearchParams({ redirect_to: redirectTo });
  if (locale) {
    params.set("locale", locale);
  }
  return `${base}/auth/callback?${params.toString()}`;
}
