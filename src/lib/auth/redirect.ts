export function sanitizeRedirectTo(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}

const AUTH_LOOP_PREFIXES = [
  "/auth/login",
  "/auth/signup",
  "/auth/callback",
  "/auth/sign-out",
];

/** ログイン後の遷移先（認証ページへのループのみ防ぐ） */
export function resolvePostLoginPath(redirectTo?: string | null): string {
  const target = sanitizeRedirectTo(redirectTo);
  if (
    AUTH_LOOP_PREFIXES.some(
      (prefix) => target === prefix || target.startsWith(`${prefix}/`),
    )
  ) {
    return "/";
  }
  return target;
}
