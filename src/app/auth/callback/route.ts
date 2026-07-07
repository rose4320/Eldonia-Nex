import { NextResponse, type NextRequest } from "next/server";
import { syncDjangoUserFromSupabase } from "@/lib/django/sync-user";
import { tryDailyLoginExp } from "@/lib/quests/daily-login-exp";
import { resolvePostLoginPath } from "@/lib/auth/redirect";
import { resolveAuthenticatedDestination } from "@/lib/onboarding/status";
import { LOCALE_COOKIE, parseUiLocale } from "@/lib/i18n/locale";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function applyLocaleCookie(response: NextResponse, locale: string | null) {
  if (!locale) return;
  response.cookies.set(LOCALE_COOKIE, parseUiLocale(locale), {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const localeParam = searchParams.get("locale");
  const authError = searchParams.get("error_description") ?? searchParams.get("error");

  if (authError) {
    const params = new URLSearchParams({
      error: "auth_callback_failed",
      detail: authError,
    });
    if (localeParam) {
      params.set("locale", localeParam);
    }
    const response = NextResponse.redirect(`${origin}/auth/login?${params.toString()}`);
    applyLocaleCookie(response, localeParam);
    return response;
  }

  if (code) {
    const fallbackDestination = resolvePostLoginPath(searchParams.get("redirect_to"));
    let response = NextResponse.redirect(`${origin}${fallbackDestination}`);
    const supabase = createRouteHandlerClient(request, response, "publishable");
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await syncDjangoUserFromSupabase(data.user);
      await tryDailyLoginExp(supabase);

      const destination = await resolveAuthenticatedDestination(
        supabase,
        data.user.id,
        searchParams.get("redirect_to"),
      );

      if (destination !== fallbackDestination) {
        const redirected = NextResponse.redirect(`${origin}${destination}`);
        for (const cookie of response.cookies.getAll()) {
          redirected.cookies.set(cookie);
        }
        response = redirected;
      }

      const locale =
        (data.user.user_metadata?.locale as string | undefined) ?? localeParam;
      applyLocaleCookie(response, locale ?? null);
      return response;
    }

    const params = new URLSearchParams({
      error: "auth_callback_failed",
      detail: error?.message ?? "exchange_code_failed",
    });
    if (localeParam) {
      params.set("locale", localeParam);
    }
    const failed = NextResponse.redirect(`${origin}/auth/login?${params.toString()}`);
    applyLocaleCookie(failed, localeParam);
    return failed;
  }

  const params = new URLSearchParams({ error: "auth_callback_failed" });
  if (localeParam) {
    params.set("locale", localeParam);
  }
  const response = NextResponse.redirect(`${origin}/auth/login?${params.toString()}`);
  applyLocaleCookie(response, localeParam);
  return response;
}
