import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  buildSignupResumePath,
  hasCompletedOnboarding,
  resolveAuthenticatedDestination,
} from "@/lib/onboarding/status";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/env";
import type { Database } from "@/types/database";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/settings",
  "/gallery/upload",
  "/help/tickets",
  "/works/manage",
  "/works/portfolio",
];

const AUTH_LOOKUP_TIMEOUT_MS = 2500;

function isProtectedPath(pathname: string): boolean {
  if (
    PROTECTED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  ) {
    return true;
  }

  return /^\/community\/b\/[^/]+\/new$/.test(pathname);
}

function needsAuthLookup(pathname: string): boolean {
  return (
    isProtectedPath(pathname) ||
    pathname === "/auth/login" ||
    pathname === "/" ||
    pathname === "/home" ||
    pathname === "/lp"
  );
}

async function getUserWithTimeout(
  supabase: ReturnType<typeof createServerClient<Database>>,
) {
  try {
    const result = await Promise.race([
      supabase.auth.getUser(),
      new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), AUTH_LOOKUP_TIMEOUT_MS),
      ),
    ]);

    return result?.data.user ?? null;
  } catch {
    return null;
  }
}

function fallbackWithoutSupabase(request: NextRequest, pathname: string) {
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/lp", request.url));
  }

  if (isProtectedPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("redirect_to", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({ request });
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/home") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!needsAuthLookup(pathname)) {
    return NextResponse.next({ request });
  }

  if (!isSupabaseConfigured()) {
    return fallbackWithoutSupabase(request, pathname);
  }

  try {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient<Database>(
      getSupabaseUrl(),
      getSupabasePublishableKey(),
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const user = await getUserWithTimeout(supabase);

    if (!user && pathname === "/") {
      return NextResponse.redirect(new URL("/lp", request.url));
    }

    if (user && pathname === "/lp") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (user && pathname === "/auth/login") {
      const destination = await resolveAuthenticatedDestination(
        supabase,
        user.id,
        request.nextUrl.searchParams.get("redirect_to"),
      );
      return NextResponse.redirect(new URL(destination, request.url));
    }

    if (user && isProtectedPath(pathname)) {
      const onboardingComplete = await hasCompletedOnboarding(supabase, user.id);
      if (!onboardingComplete) {
        return NextResponse.redirect(new URL(buildSignupResumePath(pathname), request.url));
      }
    }

    if (!user && isProtectedPath(pathname)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      loginUrl.searchParams.set("redirect_to", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return supabaseResponse;
  } catch {
    return fallbackWithoutSupabase(request, pathname);
  }
}
