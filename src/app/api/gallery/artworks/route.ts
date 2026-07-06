import { NextResponse, type NextRequest } from "next/server";
import {
  detectCategoryFromFile,
  isThumbnailImageFile,
  resolveStorageContentType,
} from "@/lib/gallery/constants";
import { isOwnedArtworksStorageUrl } from "@/lib/gallery/client-upload-artwork";
import { awardUserExp } from "@/lib/exp/award-exp";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";
import type { ArtworkMediaType } from "@/types/database";

const MAX_BYTES = 50 * 1024 * 1024;
const MAX_THUMB_BYTES = 5 * 1024 * 1024;

type JsonArtworkBody = {
  title?: string;
  description?: string;
  category?: string;
  tags?: string;
  media_type?: ArtworkMediaType;
  media_url?: string;
  thumbnail_url?: string | null;
};

async function uploadToArtworksBucket(
  supabase: ReturnType<typeof createRouteHandlerClient>,
  userId: string,
  file: File,
  mediaType: ArtworkMediaType,
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

async function insertArtworkRecord(
  supabase: ReturnType<typeof createRouteHandlerClient>,
  userId: string,
  input: {
    title: string;
    description: string;
    category: string;
    tagsRaw: string;
    mediaType: ArtworkMediaType;
    mediaUrl: string;
    thumbnailUrl: string | null;
  },
) {
  const tagList = input.tagsRaw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 10);

  const { data: artwork, error: insertError } = await supabase
    .from("artworks")
    .insert({
      creator_id: userId,
      title: input.title,
      description: input.description || null,
      media_type: input.mediaType,
      media_url: input.mediaUrl,
      thumbnail_url: input.thumbnailUrl,
      category: input.category,
      tags: tagList,
      is_public: true,
    })
    .select("id")
    .single();

  if (insertError || !artwork) {
    return { error: insertError?.message ?? "作品の保存に失敗しました。" };
  }

  await awardUserExp(supabase, "artwork.upload", artwork.id);
  return { id: artwork.id };
}

async function handleJsonRegister(
  request: NextRequest,
  supabase: ReturnType<typeof createRouteHandlerClient>,
  user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> },
  cookieResponse: NextResponse,
) {
  const body = (await request.json()) as JsonArtworkBody;
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const categoryInput = String(body.category ?? "").trim();
  const tagsRaw = String(body.tags ?? "");
  const mediaType = body.media_type;
  const mediaUrl = String(body.media_url ?? "").trim();
  const thumbnailUrl =
    body.thumbnail_url == null ? null : String(body.thumbnail_url).trim() || null;

  if (!title) {
    return NextResponse.json({ error: "タイトルを入力してください。" }, { status: 400 });
  }

  if (!mediaType || !mediaUrl) {
    return NextResponse.json({ error: "作品ファイルの情報が不足しています。" }, { status: 400 });
  }

  if (!isOwnedArtworksStorageUrl(mediaUrl, user.id)) {
    return NextResponse.json({ error: "作品ファイルの保存先が不正です。" }, { status: 400 });
  }

  if (mediaType !== "image") {
    if (!thumbnailUrl) {
      return NextResponse.json(
        { error: "音声・動画・PDF にはサムネイル画像が必要です。" },
        { status: 400 },
      );
    }
    if (!isOwnedArtworksStorageUrl(thumbnailUrl, user.id)) {
      return NextResponse.json({ error: "サムネイルの保存先が不正です。" }, { status: 400 });
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
    mediaType === "image" && categoryInput
      ? categoryInput
      : categoryInput ||
        (mediaType === "audio" ? "music" : mediaType === "document" ? "document" : mediaType);

  const result = await insertArtworkRecord(supabase, user.id, {
    title,
    description,
    category,
    tagsRaw,
    mediaType,
    mediaUrl,
    thumbnailUrl: mediaType === "image" ? mediaUrl : thumbnailUrl,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(
    { ok: true, id: result.id },
    { headers: cookieResponse.headers },
  );
}

async function handleMultipartUpload(
  request: NextRequest,
  supabase: ReturnType<typeof createRouteHandlerClient>,
  user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> },
  cookieResponse: NextResponse,
) {
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

  const result = await insertArtworkRecord(supabase, user.id, {
    title,
    description,
    category,
    tagsRaw,
    mediaType,
    mediaUrl: mediaUpload.publicUrl!,
    thumbnailUrl,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(
    { ok: true, id: result.id },
    { headers: cookieResponse.headers },
  );
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

  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      return await handleJsonRegister(request, supabase, user, cookieResponse);
    }
    return await handleMultipartUpload(request, supabase, user, cookieResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "作品の登録に失敗しました。";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
