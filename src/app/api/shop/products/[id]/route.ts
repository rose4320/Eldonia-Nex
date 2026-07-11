import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ProductVisibilityBody = {
  is_active?: boolean;
};

async function getOwnedProduct(supabase: Awaited<ReturnType<typeof createClient>>, id: string, userId: string) {
  const { data, error } = await supabase
    .from("shop_products")
    .select("id, seller_id, is_active, title")
    .eq("id", id)
    .maybeSingle();

  if (error || !data || data.seller_id !== userId) {
    return null;
  }

  return data;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  let body: ProductVisibilityBody;
  try {
    body = (await request.json()) as ProductVisibilityBody;
  } catch {
    return NextResponse.json({ error: "リクエスト形式が不正です。" }, { status: 400 });
  }

  if (typeof body.is_active !== "boolean") {
    return NextResponse.json({ error: "公開状態を指定してください。" }, { status: 400 });
  }

  const product = await getOwnedProduct(supabase, id, user.id);
  if (!product) {
    return NextResponse.json({ error: "商品が見つかりません。" }, { status: 404 });
  }

  const { error: updateError } = await supabase
    .from("shop_products")
    .update({ is_active: body.is_active })
    .eq("id", id)
    .eq("seller_id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, is_active: body.is_active });
}

/** SHOP から非公開（データは保持） */
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const product = await getOwnedProduct(supabase, id, user.id);
  if (!product) {
    return NextResponse.json({ error: "商品が見つかりません。" }, { status: 404 });
  }

  const { error: updateError } = await supabase
    .from("shop_products")
    .update({ is_active: false })
    .eq("id", id)
    .eq("seller_id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, is_active: false });
}
