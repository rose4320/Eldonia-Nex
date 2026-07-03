import { NextResponse, type NextRequest } from "next/server";
import { syncDjangoUserFromSupabase } from "@/lib/django/sync-user";
import { tryDailyLoginExp } from "@/lib/quests/daily-login-exp";
import { mapSupabaseAuthMessage } from "@/lib/supabase/env";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "メールアドレスとパスワードを入力してください。" },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ ok: true });
  const supabase = createRouteHandlerClient(request, response);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const isConnectionError = error.message.toLowerCase().includes("fetch failed");
    return NextResponse.json(
      { error: mapSupabaseAuthMessage(error.message) },
      { status: isConnectionError ? 503 : 401 },
    );
  }

  if (data.user) {
    await syncDjangoUserFromSupabase(data.user);
    await tryDailyLoginExp(supabase);
  }

  return response;
}
