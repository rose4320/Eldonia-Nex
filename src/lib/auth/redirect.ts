export function sanitizeRedirectTo(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}

/** ログイン後の遷移先（設定ループ時はトップへ） */
export function resolvePostLoginPath(redirectTo?: string | null): string {
  const target = sanitizeRedirectTo(redirectTo);
  if (target === "/settings" || target.startsWith("/settings/")) {
    return "/";
  }
  return target;
}
