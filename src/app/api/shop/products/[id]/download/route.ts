import { NextResponse, type NextRequest } from "next/server";
import { canDownloadShopProduct } from "@/lib/shop/product-download-access";
import {
  parseShopStoragePath,
  productDownloadFilename,
  resolveProductDownloadUrl,
} from "@/lib/shop/product-download";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: productId } = await context.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const { data: product, error } = await supabase
    .from("shop_products")
    .select("id, title, seller_id, product_type, image_url, gallery_urls, is_active")
    .eq("id", productId)
    .maybeSingle();

  if (error || !product) {
    return NextResponse.json({ error: "商品が見つかりません。" }, { status: 404 });
  }

  if (product.product_type !== "digital") {
    return NextResponse.json({ error: "デジタル商品のみダウンロードできます。" }, { status: 400 });
  }

  const allowed = await canDownloadShopProduct(user.id, product);
  if (!allowed) {
    return NextResponse.json(
      { error: "ダウンロード権限がありません。入手後に再度お試しください。" },
      { status: 403 },
    );
  }

  const downloadUrl = resolveProductDownloadUrl(product);
  if (!downloadUrl) {
    return NextResponse.json({ error: "配布ファイルが登録されていません。" }, { status: 404 });
  }

  const filename = productDownloadFilename(product.title, downloadUrl);
  const storageRef = parseShopStoragePath(downloadUrl);

  if (storageRef) {
    const [bucket, ...pathParts] = storageRef.split("/");
    const path = pathParts.join("/");
    const { data: signed, error: signError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 120, { download: filename });

    if (signError || !signed?.signedUrl) {
      return NextResponse.json(
        { error: signError?.message ?? "ダウンロード URL の生成に失敗しました。" },
        { status: 500 },
      );
    }

    return NextResponse.redirect(signed.signedUrl);
  }

  const siteOrigin = request.nextUrl.origin;
  const absolute = downloadUrl.startsWith("/") ? `${siteOrigin}${downloadUrl}` : downloadUrl;
  return NextResponse.redirect(absolute);
}
