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

/** ログイン後の既定遷移先（明示的な redirect_to が無い場合） */
export const DEFAULT_POST_LOGIN_PATH = "/home";

/** ログイン後の遷移先（既定は /home。認証ページへのループは防ぐ） */
export function resolvePostLoginPath(redirectTo?: string | null): string {
  const target = sanitizeRedirectTo(redirectTo);
  if (
    target === "/" ||
    AUTH_LOOP_PREFIXES.some(
      (prefix) => target === prefix || target.startsWith(`${prefix}/`),
    )
  ) {
    return DEFAULT_POST_LOGIN_PATH;
  }
  return target;
}
