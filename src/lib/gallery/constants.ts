import type { UiLocale } from "@/lib/i18n/locale";
import { artworkCategoryLabel, intlDateTag } from "@/lib/i18n/taxonomy";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
const VIDEO_TYPES = new Set(["video/mp4", "video/quicktime"]);
const AUDIO_TYPES = new Set(["audio/mpeg", "audio/wav", "audio/flac"]);
const DOCUMENT_TYPES = new Set(["application/pdf"]);

const PHOTO_EXTENSIONS = new Set(["jpg", "jpeg", "heic", "heif"]);

export function detectMediaType(mimeType: string): import("@/types/database").ArtworkMediaType | null {
  if (IMAGE_TYPES.has(mimeType)) return "image";
  if (VIDEO_TYPES.has(mimeType)) return "video";
  if (AUDIO_TYPES.has(mimeType)) return "audio";
  if (DOCUMENT_TYPES.has(mimeType)) return "document";
  return null;
}

export function detectCategoryFromFile(file: File): {
  mediaType: import("@/types/database").ArtworkMediaType;
  category: string;
} | null {
  const mediaType = detectMediaType(file.type);
  if (!mediaType) return null;

  return {
    mediaType,
    category: categoryFromMediaType(mediaType, file.name),
  };
}

function categoryFromMediaType(
  mediaType: import("@/types/database").ArtworkMediaType,
  filename: string,
): string {
  switch (mediaType) {
    case "video":
      return "video";
    case "audio":
      return "music";
    case "document":
      return "document";
    case "image": {
      const ext = filename.split(".").pop()?.toLowerCase();
      if (ext && PHOTO_EXTENSIONS.has(ext)) return "photo";
      return "illustration";
    }
    default:
      return "other";
  }
}

export const ARTWORK_CATEGORY_VALUES = [
  "illustration",
  "photo",
  "video",
  "music",
  "document",
  "other",
] as const;

export const IMAGE_ARTWORK_CATEGORY_VALUES = ["illustration", "photo"] as const;

export function categoryLabel(value: string, locale: UiLocale = "ja"): string {
  return artworkCategoryLabel(value, locale);
}

export function formatDate(iso: string, locale: UiLocale = "ja"): string {
  return new Intl.DateTimeFormat(intlDateTag(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}
