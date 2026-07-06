import type { UiLocale } from "@/lib/i18n/locale";
import { artworkCategoryLabel, intlDateTag } from "@/lib/i18n/taxonomy";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
const VIDEO_TYPES = new Set(["video/mp4", "video/quicktime", "video/webm"]);
const AUDIO_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/flac",
  "audio/x-flac",
  "audio/mp4",
  "audio/x-m4a",
]);
const DOCUMENT_TYPES = new Set(["application/pdf"]);

const PHOTO_EXTENSIONS = new Set(["jpg", "jpeg", "heic", "heif"]);

const EXTENSION_MEDIA: Record<string, import("@/types/database").ArtworkMediaType> = {
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  webp: "image",
  heic: "image",
  heif: "image",
  mp4: "video",
  mov: "video",
  webm: "video",
  mp3: "audio",
  wav: "audio",
  flac: "audio",
  m4a: "audio",
  pdf: "document",
};

export function detectMediaType(mimeType: string): import("@/types/database").ArtworkMediaType | null {
  if (IMAGE_TYPES.has(mimeType)) return "image";
  if (VIDEO_TYPES.has(mimeType)) return "video";
  if (AUDIO_TYPES.has(mimeType)) return "audio";
  if (DOCUMENT_TYPES.has(mimeType)) return "document";
  return null;
}

function detectMediaTypeFromExtension(filename: string): import("@/types/database").ArtworkMediaType | null {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (!ext) return null;
  return EXTENSION_MEDIA[ext] ?? null;
}

/** Storage アップロード用 — バケット許可 MIME に合わせる */
export function resolveStorageContentType(
  file: File,
  mediaType: import("@/types/database").ArtworkMediaType,
): string {
  if (file.type && detectMediaType(file.type)) {
    if (file.type === "audio/mp3") return "audio/mpeg";
    return file.type;
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "mp4":
      return "video/mp4";
    case "mov":
      return "video/quicktime";
    case "mp3":
      return "audio/mpeg";
    case "wav":
      return "audio/wav";
    case "flac":
      return "audio/flac";
    case "pdf":
      return "application/pdf";
    default:
      break;
  }

  switch (mediaType) {
    case "image":
      return "image/jpeg";
    case "video":
      return "video/mp4";
    case "audio":
      return "audio/mpeg";
    case "document":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

export function isThumbnailImageFile(file: File): boolean {
  if (file.type && IMAGE_TYPES.has(file.type)) return true;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext ? ["jpg", "jpeg", "png", "gif", "webp"].includes(ext) : false;
}

export function detectCategoryFromFile(file: File): {
  mediaType: import("@/types/database").ArtworkMediaType;
  category: string;
} | null {
  const mediaType =
    (file.type ? detectMediaType(file.type) : null) ??
    detectMediaTypeFromExtension(file.name);
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
