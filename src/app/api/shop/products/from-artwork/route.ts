import { NextResponse } from "next/server";
import { awardUserExp } from "@/lib/exp/award-exp";
import { buildArtworkShopListing } from "@/lib/shop/artwork-to-product";
import { createClient } from "@/lib/supabase/server";

type FromArtworkBody = {
  artworkId?: string;
  price?: number;
  isFree?: boolean;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  let body: FromArtworkBody;
  try {
    body = (await request.json()) as FromArtworkBody;
  } catch {
    return NextResponse.json({ error: "リクエスト形式が不正です。" }, { status: 400 });
  }

  const artworkId = body.artworkId?.trim();
  if (!artworkId) {
    return NextResponse.json({ error: "作品 ID が必要です。" }, { status: 400 });
  }

  const { data: artwork, error: artworkError } = await supabase
    .from("artworks")
    .select("id, title, description, thumbnail_url, media_url, media_type, category")
    .eq("id", artworkId)
    .eq("creator_id", user.id)
    .maybeSingle();

  if (artworkError || !artwork) {
    return NextResponse.json({ error: "作品が見つかりません。" }, { status: 404 });
  }

  const listing = buildArtworkShopListing(artwork);

  if (listing.product_type === "digital" && !listing.download_url) {
    return NextResponse.json(
      { error: "配布ファイルが設定されていない作品です。" },
      { status: 400 },
    );
  }

  const price = body.isFree ? 0 : Number(body.price ?? 0);
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "価格を正しく指定してください。" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("shop_products")
    .select("id, is_active")
    .eq("seller_id", user.id)
    .eq("source_artwork_id", artworkId)
    .maybeSingle();

  if (existing?.is_active) {
    return NextResponse.json({
      ok: true,
      alreadyListed: true,
      productId: existing.id,
      redirect: `/shop/${existing.id}`,
    });
  }

  const insertPayload = {
    seller_id: user.id,
    title: listing.title,
    description: listing.description,
    category: listing.category,
    product_type: listing.product_type,
    price,
    stock_quantity: listing.product_type === "physical" ? 0 : null,
    image_url: listing.image_url,
    download_url: listing.download_url,
    source_artwork_id: artworkId,
    is_active: true,
  };

  if (existing) {
    const { data: updated, error: updateError } = await supabase
      .from("shop_products")
      .update({
        title: insertPayload.title,
        description: insertPayload.description,
        category: insertPayload.category,
        product_type: insertPayload.product_type,
        price: insertPayload.price,
        stock_quantity: insertPayload.stock_quantity,
        image_url: insertPayload.image_url,
        download_url: insertPayload.download_url,
        is_active: true,
      })
      .eq("id", existing.id)
      .eq("seller_id", user.id)
      .select("id")
      .single();

    if (updateError || !updated) {
      return NextResponse.json(
        { error: updateError?.message ?? "Shop への再公開に失敗しました。" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      productId: updated.id,
      redirect: `/shop/${updated.id}`,
    });
  }

  const { data: product, error: insertError } = await supabase
    .from("shop_products")
    .insert(insertPayload)
    .select("id")
    .single();

  if (insertError || !product) {
    const missingColumn = insertError?.message?.includes("source_artwork_id");
    if (missingColumn) {
      const { source_artwork_id: _omit, ...fallbackPayload } = insertPayload;
      const { data: fallbackProduct, error: fallbackError } = await supabase
        .from("shop_products")
        .insert(fallbackPayload)
        .select("id")
        .single();

      if (fallbackError || !fallbackProduct) {
        return NextResponse.json(
          { error: fallbackError?.message ?? "Shop への登録に失敗しました。" },
          { status: 500 },
        );
      }

      await awardUserExp(supabase, "product.create", fallbackProduct.id);
      return NextResponse.json({
        ok: true,
        productId: fallbackProduct.id,
        redirect: `/shop/${fallbackProduct.id}`,
        warning: "source_artwork_id 未適用 — マイグレーション 034 を実行してください。",
      });
    }

    return NextResponse.json(
      { error: insertError?.message ?? "Shop への登録に失敗しました。" },
      { status: 500 },
    );
  }

  await awardUserExp(supabase, "product.create", product.id);

  return NextResponse.json({
    ok: true,
    productId: product.id,
    redirect: `/shop/${product.id}`,
  });
}
