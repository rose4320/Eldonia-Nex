import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

function fileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "jpg";
}

export async function uploadEventCoverToStorage(
  supabase: SupabaseClient<Database>,
  userId: string,
  file: File,
): Promise<string> {
  const extension = fileExtension(file.name);
  const objectPath = `${userId}/${crypto.randomUUID()}-event-cover.${extension}`;

  const { error } = await supabase.storage.from("artworks").upload(objectPath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("artworks").getPublicUrl(objectPath);

  return publicUrl;
}
