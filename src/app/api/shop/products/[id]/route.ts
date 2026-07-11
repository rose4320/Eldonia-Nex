import { NextResponse, type NextRequest } from "next/server";
import { normalizeDigitalProductUrls } from "@/lib/shop/product-download";
import { createClient } from "@/lib/supabase/server";

type ProductPatchBody = {
  is_active?: boolean;
  image_url?: string | null;
  download_url?: string | null;
};

async function getOwnedProduct(
  supabase: Awaited<ReturnType<typeof createClient>>,
  id: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from("shop_products")
    .select("id, seller_id, is_active, title, product_type")
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

  let body: ProductPatchBody;
  try {
    body = (await request.json()) as ProductPatchBody;
  } catch {
    return NextResponse.json({ error: "リクエスト形式が不正です。" }, { status: 400 });
  }

  const product = await getOwnedProduct(supabase, id, user.id);
  if (!product) {
    return NextResponse.json({ error: "商品が見つかりません。" }, { status: 404 });
  }

  const patch: {
    is_active?: boolean;
    image_url?: string | null;
    download_url?: string | null;
  } = {};

  if (typeof body.is_active === "boolean") {
    patch.is_active = body.is_active;
  }

  if (body.image_url !== undefined || body.download_url !== undefined) {
    if (product.product_type !== "digital") {
      return NextResponse.json({ error: "デジタル商品のみ配布 URL を更新できます。" }, { status: 400 });
    }

    const normalized = normalizeDigitalProductUrls({
      imageUrl: body.image_url ?? "",
      downloadUrl: body.download_url ?? "",
    });

    if (!normalized.download_url) {
      return NextResponse.json({ error: "配布ファイル URL を入力してください。" }, { status: 400 });
    }

    patch.image_url = normalized.image_url;
    patch.download_url = normalized.download_url;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "更新内容がありません。" }, { status: 400 });
  }

  const { error: updateError } = await supabase
    .from("shop_products")
    .update(patch)
    .eq("id", id)
    .eq("seller_id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    is_active: typeof patch.is_active === "boolean" ? patch.is_active : product.is_active,
    image_url: patch.image_url ?? undefined,
    download_url: patch.download_url ?? undefined,
  });
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
