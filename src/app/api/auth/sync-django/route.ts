import { NextResponse } from "next/server";
import { syncDjangoUserFromSupabase } from "@/lib/django/sync-user";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const result = await syncDjangoUserFromSupabase(user);

  if (!result.ok) {
    return NextResponse.json(
      { error: "Django ユーザー同期に失敗しました。" },
      { status: 502 },
    );
  }

  return NextResponse.json(result);
}
