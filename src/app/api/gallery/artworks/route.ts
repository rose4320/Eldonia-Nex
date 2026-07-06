import { NextResponse, type NextRequest } from "next/server";
import {
  detectCategoryFromFile,
  isThumbnailImageFile,
  resolveStorageContentType,
} from "@/lib/gallery/constants";
import { awardUserExp } from "@/lib/exp/award-exp";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

const MAX_BYTES = 50 * 1024 * 1024;
const MAX_THUMB_BYTES = 5 * 1024 * 1024;

async function uploadToArtworksBucket(
  supabase: ReturnType<typeof createRouteHandlerClient>,
  userId: string,
  file: File,
  mediaType: import("@/types/database").ArtworkMediaType,
  suffix: string,
) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const objectPath = `${userId}/${crypto.randomUUID()}${suffix}.${extension}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const contentType = resolveStorageContentType(file, mediaType);

  const { error: uploadError } = await supabase.storage
    .from("artworks")
    .upload(objectPath, fileBuffer, {
      cacheControl: "3600",
      upsert: false,
      contentType,
    });

  if (uploadError) {
    return { error: uploadError.message as string };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("artworks").getPublicUrl(objectPath);

  return { publicUrl };
}

async function ensureCreatorProfile(
  supabase: ReturnType<typeof createRouteHandlerClient>,
  user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> },
) {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return null;

  const displayName =
    (user.user_metadata?.display_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Creator";

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    display_name: displayName,
  });

  return error?.message ?? null;
}

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
  const thumbnail = formData.get("thumbnail");
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
    return NextResponse.json({ error: "ファイルサイズが大きすぎます（50MB以内）。" }, { status: 400 });
  }

  const fileInfo = detectCategoryFromFile(file);
  if (!fileInfo) {
    return NextResponse.json(
      { error: "対応していないファイル形式です。" },
      { status: 400 },
    );
  }

  const { mediaType } = fileInfo;
  const needsThumbnail = mediaType !== "image";

  if (needsThumbnail) {
    if (!(thumbnail instanceof File) || thumbnail.size === 0) {
      return NextResponse.json(
        { error: "音声・動画・PDF にはサムネイル画像が必要です。" },
        { status: 400 },
      );
    }
    if (!isThumbnailImageFile(thumbnail)) {
      return NextResponse.json(
        { error: "サムネイルは JPEG / PNG / GIF / WebP 画像にしてください。" },
        { status: 400 },
      );
    }
    if (thumbnail.size > MAX_THUMB_BYTES) {
      return NextResponse.json(
        { error: "サムネイル画像は 5MB 以内にしてください。" },
        { status: 400 },
      );
    }
  }

  const profileError = await ensureCreatorProfile(supabase, user);
  if (profileError) {
    return NextResponse.json(
      { error: `プロフィールの作成に失敗しました: ${profileError}` },
      { status: 400 },
    );
  }

  const category =
    mediaType === "image" && categoryInput ? categoryInput : fileInfo.category;

  const mediaUpload = await uploadToArtworksBucket(supabase, user.id, file, mediaType, "");
  if ("error" in mediaUpload && mediaUpload.error) {
    return NextResponse.json(
      { error: `ファイルのアップロードに失敗しました: ${mediaUpload.error}` },
      { status: 400 },
    );
  }

  let thumbnailUrl: string | null =
    mediaType === "image" ? mediaUpload.publicUrl! : null;

  if (needsThumbnail && thumbnail instanceof File) {
    const thumbUpload = await uploadToArtworksBucket(
      supabase,
      user.id,
      thumbnail,
      "image",
      "-thumb",
    );
    if ("error" in thumbUpload && thumbUpload.error) {
      return NextResponse.json(
        { error: `サムネイルのアップロードに失敗しました: ${thumbUpload.error}` },
        { status: 400 },
      );
    }
    thumbnailUrl = thumbUpload.publicUrl!;
  }

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
      media_type: mediaType,
      media_url: mediaUpload.publicUrl!,
      thumbnail_url: thumbnailUrl,
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
