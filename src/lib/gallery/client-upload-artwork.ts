import {
  detectCategoryFromFile,
  resolveStorageContentType,
} from "@/lib/gallery/constants";
import type { ArtworkMediaType } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

function fileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "bin";
}

export async function uploadArtworkFileToStorage(
  supabase: SupabaseClient<Database>,
  userId: string,
  file: File,
  mediaType: ArtworkMediaType,
  suffix = "",
): Promise<{ publicUrl: string; objectPath: string }> {
  const extension = fileExtension(file.name);
  const objectPath = `${userId}/${crypto.randomUUID()}${suffix}.${extension}`;

  const { error } = await supabase.storage.from("artworks").upload(objectPath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: resolveStorageContentType(file, mediaType),
  });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("artworks").getPublicUrl(objectPath);

  return { publicUrl, objectPath };
}

export async function uploadArtworkMediaBundle(
  supabase: SupabaseClient<Database>,
  userId: string,
  file: File,
  thumbnailFile: File | null,
): Promise<{
  mediaType: ArtworkMediaType;
  category: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
}> {
  const fileInfo = detectCategoryFromFile(file);
  if (!fileInfo) {
    throw new Error("UNSUPPORTED_FORMAT");
  }

  const { mediaType, category } = fileInfo;
  const media = await uploadArtworkFileToStorage(supabase, userId, file, mediaType);

  let thumbnailUrl: string | null = mediaType === "image" ? media.publicUrl : null;

  if (mediaType !== "image") {
    if (!thumbnailFile) {
      throw new Error("THUMBNAIL_REQUIRED");
    }
    const thumb = await uploadArtworkFileToStorage(
      supabase,
      userId,
      thumbnailFile,
      "image",
      "-thumb",
    );
    thumbnailUrl = thumb.publicUrl;
  }

  return {
    mediaType,
    category,
    mediaUrl: media.publicUrl,
    thumbnailUrl,
  };
}

export function isOwnedArtworksStorageUrl(url: string, userId: string): boolean {
  try {
    const pathname = new URL(url).pathname;
    return pathname.includes(`/artworks/${userId}/`);
  } catch {
    return false;
  }
}
