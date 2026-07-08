import { NextResponse, type NextRequest } from "next/server";
import { resolveArtworkDownloadActor } from "@/lib/gallery/artwork-download-access";
import {
  buildDownloadFilename,
  parseArtworksStoragePath,
} from "@/lib/gallery/artwork-download";
import { createClient } from "@/lib/supabase/server";

type DownloadFile = "media" | "thumbnail";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: artworkId } = await context.params;
  const file = (request.nextUrl.searchParams.get("file") ?? "media") as DownloadFile;

  if (file !== "media" && file !== "thumbnail") {
    return NextResponse.json({ error: "Invalid file type." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const { data: artwork, error } = await supabase
    .from("artworks")
    .select("id, title, creator_id, media_url, thumbnail_url")
    .eq("id", artworkId)
    .maybeSingle();

  if (error || !artwork) {
    return NextResponse.json({ error: "作品が見つかりません。" }, { status: 404 });
  }

  const actor = await resolveArtworkDownloadActor(
    user.id,
    artworkId,
    artwork.creator_id,
  );
  if (!actor) {
    return NextResponse.json(
      { error: "投稿者または Lab の共同作業者のみダウンロードできます。" },
      { status: 403 },
    );
  }

  const targetUrl = file === "thumbnail" ? artwork.thumbnail_url : artwork.media_url;
  if (!targetUrl) {
    return NextResponse.json({ error: "ファイルがありません。" }, { status: 404 });
  }

  const storagePath = parseArtworksStoragePath(targetUrl);
  if (storagePath) {
    const filename = buildDownloadFilename(
      artwork.title,
      targetUrl,
      file === "thumbnail" ? "-thumb" : "",
    );
    const { data: signed, error: signError } = await supabase.storage
      .from("artworks")
      .createSignedUrl(storagePath, 120, { download: filename });

    if (signError || !signed?.signedUrl) {
      return NextResponse.json(
        { error: signError?.message ?? "ダウンロード URL の生成に失敗しました。" },
        { status: 500 },
      );
    }

    return NextResponse.redirect(signed.signedUrl);
  }

  const siteOrigin = request.nextUrl.origin;
  const absolute = targetUrl.startsWith("/") ? `${siteOrigin}${targetUrl}` : targetUrl;
  return NextResponse.redirect(absolute);
}
