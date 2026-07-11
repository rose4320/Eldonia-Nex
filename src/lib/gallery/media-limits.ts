import type { ArtworkMediaType } from "@/types/database";

/** Default upload cap for gallery API (multipart). */
export const GALLERY_DEFAULT_MAX_BYTES = 50 * 1024 * 1024;

/** GLB / GLTF models may be larger than video/audio uploads. */
export const GALLERY_MODEL_MAX_BYTES = 100 * 1024 * 1024;

export const GALLERY_THUMB_MAX_BYTES = 5 * 1024 * 1024;

export function maxUploadBytesForMediaType(mediaType: ArtworkMediaType): number {
  return mediaType === "model" ? GALLERY_MODEL_MAX_BYTES : GALLERY_DEFAULT_MAX_BYTES;
}

export function maxUploadMegabytesLabel(mediaType: ArtworkMediaType): number {
  return maxUploadBytesForMediaType(mediaType) / (1024 * 1024);
}
