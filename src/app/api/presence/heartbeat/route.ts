import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { inferPresenceArea } from "@/lib/presence/areas";

export const runtime = "nodejs";

type Body = {
  path?: string;
  area?: string;
  title?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse(null, { status: 204 });
    }

    let body: Body = {};
    try {
      body = (await request.json()) as Body;
    } catch {
      body = {};
    }

    const path = (body.path || "/").slice(0, 500);
    const area = (body.area || inferPresenceArea(path)).slice(0, 40);
    const title = (body.title || "").slice(0, 200);
    const userAgent = (request.headers.get("user-agent") || "").slice(0, 300);
    const now = new Date().toISOString();

    const { error } = await supabase.from("user_presence").upsert(
      {
        user_id: user.id,
        path,
        area,
        title,
        is_authenticated: true,
        last_seen_at: now,
        user_agent: userAgent || null,
        updated_at: now,
      },
      { onConflict: "user_id" },
    );

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, area, path });
  } catch (err) {
    const message = err instanceof Error ? err.message : "presence failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
