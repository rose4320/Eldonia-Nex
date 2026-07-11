import type { UiLocale } from "@/lib/i18n/locale";
import { intlDateTag } from "@/lib/i18n/taxonomy";

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
const MODEL_TYPES = new Set(["model/gltf-binary", "model/gltf+json"]);

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
  glb: "model",
  gltf: "model",
};

export function detectMediaType(mimeType: string): import("@/types/database").ArtworkMediaType | null {
  if (IMAGE_TYPES.has(mimeType)) return "image";
  if (VIDEO_TYPES.has(mimeType)) return "video";
  if (AUDIO_TYPES.has(mimeType)) return "audio";
  if (DOCUMENT_TYPES.has(mimeType)) return "document";
  if (MODEL_TYPES.has(mimeType)) return "model";
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
    case "glb":
      return "model/gltf-binary";
    case "gltf":
      return "model/gltf+json";
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
    case "model":
      return "model/gltf-binary";
    default:
      return "application/octet-stream";
  }
}

export function isThumbnailImageFile(file: File): boolean {
  if (file.type && IMAGE_TYPES.has(file.type)) return true;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext ? ["jpg", "jpeg", "png", "gif", "webp"].includes(ext) : false;
}

/** 音声・動画・PDF など、サムネイル画像が必要な作品か */
export function artworkNeedsThumbnail(file: File | null): boolean {
  if (!file) return false;
  const info = detectCategoryFromFile(file);
  if (info) return info.mediaType !== "image";
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext) return false;
  return ["mp3", "wav", "flac", "m4a", "mp4", "mov", "webm", "pdf", "glb", "gltf"].includes(ext);
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
    case "model":
      return "3d";
    case "image": {
      const ext = filename.split(".").pop()?.toLowerCase();
      if (ext && PHOTO_EXTENSIONS.has(ext)) return "photo";
      return "illustration";
    }
    default:
      return "other";
  }
}

const BGM_EXTENSIONS = new Set(["mp3", "wav", "flac", "m4a"]);

/** Optional ambient BGM file (not the primary audio artwork). */
export function isBgmAudioFile(file: File): boolean {
  if (AUDIO_TYPES.has(file.type)) return true;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return BGM_EXTENSIONS.has(ext ?? "");
}

export const MEDIA_FILE_ACCEPT: Record<
  import("@/types/database").ArtworkMediaType,
  string
> = {
  image: "image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp",
  video: "video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm",
  audio:
    "audio/mpeg,audio/mp3,audio/wav,audio/flac,audio/mp4,audio/x-m4a,.mp3,.wav,.flac,.m4a",
  document: "application/pdf,.pdf",
  model: ".glb,.gltf,model/gltf-binary,model/gltf+json",
};

export function resolveFileMediaType(
  file: File,
): import("@/types/database").ArtworkMediaType | null {
  return (
    (file.type ? detectMediaType(file.type) : null) ??
    detectMediaTypeFromExtension(file.name)
  );
}

export function fileMatchesMediaType(
  file: File,
  expected: import("@/types/database").ArtworkMediaType,
): boolean {
  return resolveFileMediaType(file) === expected;
}

export {
  ARTWORK_CATEGORY_VALUES,
  IMAGE_ARTWORK_CATEGORY_VALUES,
  categoryLabel,
  disciplineLabel,
  formatBadgeLabel,
  galleryRealmFilterLabel,
  sanitizeDisciplines,
  isArtworkCategory,
  isCreatorDiscipline,
  resolveArtworkFormat,
  CREATOR_DISCIPLINE_VALUES,
  DOCUMENT_ARTWORK_CATEGORY_VALUES,
  GALLERY_REALM_FILTER_VALUES,
} from "@/lib/gallery/creator-taxonomy";

export function formatDate(iso: string, locale: UiLocale = "ja"): string {
  return new Intl.DateTimeFormat(intlDateTag(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

/** ギャラリー一覧・詳細で使うカバー画像 URL */
export function artworkCoverUrl(artwork: {
  thumbnail_url: string | null;
  media_type: import("@/types/database").ArtworkMediaType;
  media_url: string;
}): string | null {
  if (artwork.thumbnail_url) return artwork.thumbnail_url;
  if (artwork.media_type === "image") return artwork.media_url;
  return null;
}
