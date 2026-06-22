import { NextResponse, type NextRequest } from "next/server";
import { detectCategoryFromFile } from "@/lib/gallery/constants";
import { awardUserExp } from "@/lib/exp/award-exp";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

const MAX_BYTES = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const cookieResponse = NextResponse.json({ ok: true });
  const supabase = createRouteHandlerClient(request, cookieResponse);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryInput = String(formData.get("category") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "作品ファイルを選択してください。" }, { status: 400 });
  }

  if (!title) {
    return NextResponse.json({ error: "タイトルを入力してください。" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "ファイルサイズが大きすぎます。" }, { status: 400 });
  }

  const fileInfo = detectCategoryFromFile(file);
  if (!fileInfo) {
    return NextResponse.json(
      { error: "対応していないファイル形式です。" },
      { status: 400 },
    );
  }

  const category =
    fileInfo.mediaType === "image" && categoryInput ? categoryInput : fileInfo.category;
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const objectPath = `${user.id}/${crypto.randomUUID()}.${extension}`;

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from("artworks")
    .upload(objectPath, fileBuffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("artworks").getPublicUrl(objectPath);

  const tagList = tagsRaw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 10);

  const { data: artwork, error: insertError } = await supabase
    .from("artworks")
    .insert({
      creator_id: user.id,
      title,
      description: description || null,
      media_type: fileInfo.mediaType,
      media_url: publicUrl,
      thumbnail_url: fileInfo.mediaType === "image" ? publicUrl : null,
      category,
      tags: tagList,
      is_public: true,
    })
    .select("id")
    .single();

  if (insertError || !artwork) {
    return NextResponse.json(
      { error: insertError?.message ?? "作品の保存に失敗しました。" },
      { status: 400 },
    );
  }

  await awardUserExp(supabase, "artwork.upload", artwork.id);

  return NextResponse.json(
    { ok: true, id: artwork.id },
    { headers: cookieResponse.headers },
  );
}
