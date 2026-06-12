import type { ArtworkMediaType } from "@/types/database";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
const VIDEO_TYPES = new Set(["video/mp4", "video/quicktime"]);
const AUDIO_TYPES = new Set(["audio/mpeg", "audio/wav", "audio/flac"]);
const DOCUMENT_TYPES = new Set(["application/pdf"]);

export function detectMediaType(mimeType: string): ArtworkMediaType | null {
  if (IMAGE_TYPES.has(mimeType)) return "image";
  if (VIDEO_TYPES.has(mimeType)) return "video";
  if (AUDIO_TYPES.has(mimeType)) return "audio";
  if (DOCUMENT_TYPES.has(mimeType)) return "document";
  return null;
}

export const ARTWORK_CATEGORIES = [
  { value: "illustration", label: "イラスト" },
  { value: "photo", label: "写真" },
  { value: "video", label: "動画" },
  { value: "music", label: "音楽" },
  { value: "document", label: "ドキュメント" },
  { value: "other", label: "その他" },
] as const;

export function categoryLabel(value: string): string {
  return ARTWORK_CATEGORIES.find((item) => item.value === value)?.label ?? value;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}
