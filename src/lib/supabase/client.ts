import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

export function hasBrowserSupabaseConfig(): boolean {
  return Boolean(getSupabaseUrl() && getSupabasePublishableKey());
}

export function createClient() {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();

  if (!url || !key) {
    throw new Error(
      "Supabase の Publishable Key が未設定です。Dashboard → Settings → API から " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY を設定してください。",
    );
  }

  return createBrowserClient<Database>(url, key);
}
