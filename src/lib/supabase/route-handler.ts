import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerKey, getSupabaseUrl } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

export function createRouteHandlerClient(
  request: NextRequest,
  response: NextResponse,
) {
  return createServerClient<Database>(
    getSupabaseUrl(),
    getSupabaseServerKey(),
    {
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
    },
  );
}
