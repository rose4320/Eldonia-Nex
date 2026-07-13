import { resolveStorageContentType } from "@/lib/gallery/constants";
import type { ArtworkMediaType } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const MAX_LAB_SHARE_BYTES = 25 * 1024 * 1024;

function fileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "bin";
}

function guessMediaType(file: File): ArtworkMediaType {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return "document";
  }
  return "document";
}

/** Upload a Lab chat share into the artworks bucket (member-owned path). */
export async function uploadLabChatShare(
  supabase: SupabaseClient<Database>,
  userId: string,
  labId: string,
  file: File,
): Promise<{ publicUrl: string; name: string }> {
  if (file.size > MAX_LAB_SHARE_BYTES) {
    throw new Error("FILE_TOO_LARGE");
  }

  const extension = fileExtension(file.name);
  const safeName = file.name.replace(/[^\w.\-()\s\u3040-\u30ff\u4e00-\u9fff]/g, "_").slice(0, 120);
  const objectPath = `${userId}/lab/${labId}/${crypto.randomUUID()}.${extension}`;
  const mediaType = guessMediaType(file);

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

  return { publicUrl, name: safeName || `file.${extension}` };
}
