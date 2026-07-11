import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { resolveArtworkVisibilityActor } from "@/lib/gallery/artwork-access";
import { createAdminClient } from "@/lib/supabase/admin";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

type VisibilityBody = {
  is_public?: boolean;
};

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const cookieResponse = NextResponse.json({ ok: true });
  const supabase = createRouteHandlerClient(request, cookieResponse);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  let body: VisibilityBody;
  try {
    body = (await request.json()) as VisibilityBody;
  } catch {
    return NextResponse.json({ error: "リクエスト形式が不正です。" }, { status: 400 });
  }

  if (typeof body.is_public !== "boolean") {
    return NextResponse.json({ error: "公開状態を指定してください。" }, { status: 400 });
  }

  const { data: artwork, error: fetchError } = await supabase
    .from("artworks")
    .select("id, creator_id, is_public")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !artwork) {
    return NextResponse.json({ error: "作品が見つかりません。" }, { status: 404 });
  }

  const actor = await resolveArtworkVisibilityActor(user.id, artwork.creator_id);
  if (!actor) {
    return NextResponse.json({ error: "この操作は投稿者または管理者のみ可能です。" }, { status: 403 });
  }

  if (artwork.is_public === body.is_public) {
    return NextResponse.json(
      { ok: true, is_public: body.is_public, actor },
      { headers: cookieResponse.headers },
    );
  }

  if (actor === "owner") {
    const { error: updateError } = await supabase
      .from("artworks")
      .update({ is_public: body.is_public })
      .eq("id", id)
      .eq("creator_id", user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }
  } else {
    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json(
        { error: "管理者クライアントが未設定です。" },
        { status: 503 },
      );
    }

    const { error: updateError } = await admin
      .from("artworks")
      .update({ is_public: body.is_public })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }
  }

  revalidatePath("/gallery");
  revalidatePath("/");
  revalidatePath(`/gallery/${id}`);

  return NextResponse.json(
    { ok: true, is_public: body.is_public, actor },
    { headers: cookieResponse.headers },
  );
}
