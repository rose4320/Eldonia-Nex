import { NextResponse, type NextRequest } from "next/server";
import { syncDjangoUserFromSupabase } from "@/lib/django/sync-user";
import { tryDailyLoginExp } from "@/lib/quests/daily-login-exp";
import { resolveAuthenticatedDestination } from "@/lib/onboarding/status";
import { LOCALE_COOKIE, parseUiLocale } from "@/lib/i18n/locale";
import { createOAuthCallbackClient } from "@/lib/supabase/route-handler";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function applyLocaleCookie(response: NextResponse, locale: string | null) {
  if (!locale) return;
  response.cookies.set(LOCALE_COOKIE, parseUiLocale(locale), {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}

function loginFailureRedirect(origin: string, detail: string, localeParam: string | null) {
  const params = new URLSearchParams({
    error: "auth_callback_failed",
    detail,
  });
  if (localeParam) {
    params.set("locale", localeParam);
  }
  const response = NextResponse.redirect(`${origin}/auth/login?${params.toString()}`);
  applyLocaleCookie(response, localeParam);
  return response;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const localeParam = searchParams.get("locale");
  const authError = searchParams.get("error_description") ?? searchParams.get("error");

  if (authError) {
    return loginFailureRedirect(origin, authError, localeParam);
  }

  if (code) {
    const { supabase, redirectWithSession } = createOAuthCallbackClient(request, "publishable");
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await syncDjangoUserFromSupabase(data.user);
      await tryDailyLoginExp(supabase);

      const destination = await resolveAuthenticatedDestination(
        supabase,
        data.user.id,
        searchParams.get("redirect_to"),
      );

      const locale =
        (data.user.user_metadata?.locale as string | undefined) ?? localeParam;
      const response = redirectWithSession(`${origin}${destination}`);
      applyLocaleCookie(response, locale ?? null);
      return response;
    }

    return loginFailureRedirect(origin, error?.message ?? "exchange_code_failed", localeParam);
  }

  return loginFailureRedirect(origin, "missing_code", localeParam);
}
