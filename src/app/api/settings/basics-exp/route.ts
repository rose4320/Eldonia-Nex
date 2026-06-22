import { NextResponse, type NextRequest } from "next/server";
import { awardUserExp } from "@/lib/exp/award-exp";
import { isBasicsComplete } from "@/lib/settings/basics-completion";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

export async function POST(request: NextRequest) {
  const cookieResponse = NextResponse.json({ ok: true });
  const supabase = createRouteHandlerClient(request, cookieResponse);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const [profileRes, settingsRes, awardRes] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", user.id).single(),
    supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("user_exp_awards")
      .select("id")
      .eq("user_id", user.id)
      .eq("action_type", "profile.basics")
      .eq("reference_key", "profile.basics")
      .maybeSingle(),
  ]);

  if (profileRes.error) {
    return NextResponse.json({ error: profileRes.error.message }, { status: 400 });
  }

  if (awardRes.data) {
    return NextResponse.json(
      { ok: true, gained: 0, reason: "already_awarded" as const },
      { headers: cookieResponse.headers },
    );
  }

  if (!isBasicsComplete(settingsRes.data, profileRes.data)) {
    return NextResponse.json(
      { ok: true, gained: 0, reason: "incomplete" as const },
      { headers: cookieResponse.headers },
    );
  }

  const gained = await awardUserExp(supabase, "profile.basics", "profile.basics");

  return NextResponse.json(
    { ok: true, gained, reason: gained > 0 ? null : ("already_awarded" as const) },
    { headers: cookieResponse.headers },
  );
}
