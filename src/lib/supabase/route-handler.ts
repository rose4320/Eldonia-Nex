import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  getSupabasePublishableKey,
  getSupabaseServerKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";
import type { Database } from "@/types/database";

type RouteHandlerKey = "publishable" | "server";

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
