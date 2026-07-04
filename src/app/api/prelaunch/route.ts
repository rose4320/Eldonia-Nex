import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: { email?: string; locale?: string; referralCode?: string | null };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "メールアドレスの形式が正しくありません。" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "サーバー設定が未完了です。時間をおいて再度お試しください。" },
      { status: 503 },
    );
  }

  const locale = body.locale?.slice(0, 10) ?? null;
  const referralCode = body.referralCode?.trim().slice(0, 64) || null;
  const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;

  const { error } = await admin.from("prelaunch_registrations").insert({
    email,
    locale,
    referral_code: referralCode,
    source: "lp_cta",
    user_agent: userAgent,
  });

  if (error) {
    // 23505 = unique_violation: 既に登録済みでも成功扱いにする
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, alreadyRegistered: true });
    }
    return NextResponse.json(
      { error: "登録に失敗しました。時間をおいて再度お試しください。" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
