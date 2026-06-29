import { NextResponse, type NextRequest } from "next/server";
import { syncDjangoUserFromSupabase } from "@/lib/django/sync-user";
import { resolveAuthenticatedDestination } from "@/lib/onboarding/status";
import { tryDailyLoginExp } from "@/lib/quests/daily-login-exp";
import { mapSupabaseAuthMessage } from "@/lib/supabase/env";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    redirectTo?: string;
  };

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  const redirectTo = body.redirectTo ?? null;

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
    return NextResponse.json(
      { error: mapSupabaseAuthMessage(error.message) },
      { status: 401 },
    );
  }

  if (data.user) {
    await syncDjangoUserFromSupabase(data.user);
    await tryDailyLoginExp(supabase);
    const destination = await resolveAuthenticatedDestination(
      supabase,
      data.user.id,
      redirectTo,
    );
    const jsonResponse = NextResponse.json({ ok: true, destination });
    response.cookies.getAll().forEach((cookie) => {
      jsonResponse.cookies.set(cookie);
    });
    return jsonResponse;
  }

  return response;
}
