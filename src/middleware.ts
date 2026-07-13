import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE } from "@/lib/i18n/locale";
import { resolveUiLocaleFromAcceptLanguage } from "@/lib/i18n/resolve-ui-locale";
import { updateSession } from "@/lib/supabase/middleware";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function applyLocaleBootstrap(request: NextRequest, response: NextResponse) {
  if (request.cookies.get(LOCALE_COOKIE)?.value) return;
  const inferred = resolveUiLocaleFromAcceptLanguage(
    request.headers.get("accept-language"),
  );
  if (inferred) {
    response.cookies.set(LOCALE_COOKIE, inferred, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }
}

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  applyLocaleBootstrap(request, response);

  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set("x-admin-path", request.nextUrl.pathname);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
