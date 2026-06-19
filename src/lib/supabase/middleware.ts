import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { resolvePostLoginPath } from "@/lib/auth/redirect";
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

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuthLookup = isProtectedPath(pathname) || pathname === "/auth/login";

  if (!needsAuthLookup) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  if (user && pathname === "/auth/login") {
    const redirectTo = resolvePostLoginPath(
      request.nextUrl.searchParams.get("redirect_to"),
    );
    const home = request.nextUrl.clone();
    home.pathname = redirectTo;
    home.search = "";
    return NextResponse.redirect(home);
  }

  if (!user && isProtectedPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("redirect_to", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
