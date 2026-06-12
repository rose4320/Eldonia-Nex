import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED = ["pending", "reviewing", "accepted", "rejected"] as const;

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const body = (await request.json()) as {
    applicationId?: string;
    status?: string;
  };

  if (!body.applicationId || !body.status) {
    return NextResponse.json(
      { error: "applicationId と status が必要です。" },
      { status: 400 },
    );
  }

  if (!ALLOWED.includes(body.status as (typeof ALLOWED)[number])) {
    return NextResponse.json({ error: "無効なステータスです。" }, { status: 400 });
  }

  const { error } = await supabase
    .from("job_applications")
    .update({ status: body.status })
    .eq("id", body.applicationId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
