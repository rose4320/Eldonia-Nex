import { NextResponse, type NextRequest } from "next/server";
import { mapSupabaseAuthMessage } from "@/lib/supabase/env";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { password?: string };
  const password = body.password ?? "";

  if (password.length < 6) {
    return NextResponse.json(
      { error: "パスワードは 6 文字以上にしてください。" },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ ok: true });
  const supabase = createRouteHandlerClient(request, response);
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return NextResponse.json(
      { error: mapSupabaseAuthMessage(error.message) },
      { status: 400 },
    );
  }

  return response;
}
