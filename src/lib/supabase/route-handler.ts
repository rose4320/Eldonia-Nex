import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import {
  getSupabasePublishableKey,
  getSupabaseServerKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";
import type { Database } from "@/types/database";

type RouteHandlerKey = "publishable" | "server";

type StoredAuthCookie = {
  name: string;
  value: string;
  options?: Partial<ResponseCookie>;
};

export function createRouteHandlerClient(
  request: NextRequest,
  response: NextResponse,
  key: RouteHandlerKey = "server",
) {
  const apiKey =
    key === "publishable" ? getSupabasePublishableKey() : getSupabaseServerKey();

  return createServerClient<Database>(getSupabaseUrl(), apiKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}

/** OAuth PKCE exchange — collect cookies with options, then redirect once. */
export function createOAuthCallbackClient(
  request: NextRequest,
  key: RouteHandlerKey = "publishable",
) {
  const jar: StoredAuthCookie[] = [];
  const apiKey =
    key === "publishable" ? getSupabasePublishableKey() : getSupabaseServerKey();

  const supabase = createServerClient<Database>(getSupabaseUrl(), apiKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          jar.push({ name, value, options });
        });
      },
    },
  });

  function redirectWithSession(url: string) {
    const response = NextResponse.redirect(url);
    jar.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  }

  return { supabase, redirectWithSession };
}
