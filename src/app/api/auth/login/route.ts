import { NextResponse, type NextRequest } from "next/server";
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
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json(
      { error: mapSupabaseAuthMessage(error.message) },
      { status: 401 },
    );
  }

  return response;
}
