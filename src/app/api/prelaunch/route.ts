import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 試験段階の事前登録:
 * - メールを prelaunch_registrations に保存
 * - そのメールで Supabase アカウントを自動作成（既存なら再利用）
 * - 最上級プラン(pro)を付与しオンボーディング完了扱いにする
 * - サーバー側でログインしセッション Cookie を発行 → そのまま / へ入れる
 *
 * 本格運用ではこの自動ログイン/自動 pro 付与を廃止し、プラン選択・決済導線に差し替える。
 */
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

  // 1) 事前登録メールの保存と 2) アカウント自動作成（試験段階のみ）は独立なので並列実行
  const password = `${crypto.randomUUID()}${crypto.randomUUID()}`;
  let userId: string | null = null;

  const [{ error: insertError }, { data: created, error: createError }] =
    await Promise.all([
      admin.from("prelaunch_registrations").insert({
        email,
        locale,
        referral_code: referralCode,
        source: "lp_cta",
        user_agent: userAgent,
      }),
      admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      }),
    ]);

  let alreadyRegistered = false;
  if (insertError) {
    if (insertError.code === "23505") {
      alreadyRegistered = true;
    } else {
      return NextResponse.json(
        { error: "登録に失敗しました。時間をおいて再度お試しください。" },
        { status: 500 },
      );
    }
  }

  if (created?.user) {
    userId = created.user.id;
  } else {
    // 既存ユーザーとみなし、id を取得してパスワードを再設定
    const { data: linkData } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkData?.user) {
      userId = linkData.user.id;
      await admin.auth.admin.updateUserById(userId, {
        password,
        email_confirm: true,
      });
    }
  }

  if (!userId) {
    return NextResponse.json(
      { error: createError?.message ?? "アカウント作成に失敗しました。" },
      { status: 500 },
    );
  }

  // 3) 最上級プラン付与＋オンボーディング完了扱い（試験段階）
  await Promise.all([
    admin.from("profiles").update({ subscription_plan: "pro" }).eq("id", userId),
    admin.from("user_onboarding").upsert(
      {
        user_id: userId,
        selected_plan: "pro",
        payment_status: "not_required",
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    ),
  ]);

  // 4) サーバー側でログインしてセッション Cookie を発行
  const response = NextResponse.json({ ok: true, alreadyRegistered, loggedIn: true });
  const supabase = createRouteHandlerClient(request, response);
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    // ログインに失敗しても登録自体は成功しているので success 扱い（/ では未ログイン→/lp）
    return NextResponse.json({ ok: true, alreadyRegistered, loggedIn: false });
  }

  return response;
}
