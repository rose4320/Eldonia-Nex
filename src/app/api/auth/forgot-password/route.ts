import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { buildAuthCallbackUrl, getPublicSiteUrl } from "@/lib/auth/site-url";
import { parseUiLocale } from "@/lib/i18n/locale";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
  mapSupabaseAuthMessage,
} from "@/lib/supabase/env";
import type { Database } from "@/types/database";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string; locale?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  const locale = parseUiLocale(body.locale);

  if (!email) {
    return NextResponse.json(
      { error: "メールアドレスを入力してください。" },
      { status: 400 },
    );
  }

  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();
  if (!url || !key) {
    return NextResponse.json({ error: "Supabase が未設定です。" }, { status: 503 });
  }

  const supabase = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const redirectTo = buildAuthCallbackUrl(
    "/auth/reset-password",
    getPublicSiteUrl(),
    locale,
  );

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  if (error) {
    return NextResponse.json(
      { error: mapSupabaseAuthMessage(error.message) },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
