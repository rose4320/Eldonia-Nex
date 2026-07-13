/** Events cover spec — docs/18_Events機能要件定義書.md §5.1 */

export const EVENT_COVER_ASPECT = 2;
export const EVENT_COVER_ASPECT_TOLERANCE = 0.08;
export const EVENT_COVER_MIN_WIDTH = 1200;
export const EVENT_COVER_MIN_HEIGHT = 600;
export const EVENT_COVER_MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export type EventCoverValidationCode =
  | "format"
  | "size"
  | "aspect"
  | "min_dimensions"
  | "load_failed";

export type EventCoverValidationResult =
  | { ok: true; width: number; height: number }
  | { ok: false; code: EventCoverValidationCode };

export function isAllowedEventCoverMime(type: string): boolean {
  return ALLOWED_MIME.has(type);
}

export function isEventCoverAspectRatio(width: number, height: number): boolean {
  if (width <= 0 || height <= 0) return false;
  const ratio = width / height;
  return Math.abs(ratio - EVENT_COVER_ASPECT) <= EVENT_COVER_ASPECT_TOLERANCE;
}

export function loadImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("load_failed"));
    };
    img.src = url;
  });
}

export async function validateEventCoverFile(file: File): Promise<EventCoverValidationResult> {
  if (!isAllowedEventCoverMime(file.type)) {
    return { ok: false, code: "format" };
  }
  if (file.size > EVENT_COVER_MAX_BYTES) {
    return { ok: false, code: "size" };
  }

  try {
    const { width, height } = await loadImageDimensions(file);
    if (width < EVENT_COVER_MIN_WIDTH || height < EVENT_COVER_MIN_HEIGHT) {
      return { ok: false, code: "min_dimensions" };
    }
    if (!isEventCoverAspectRatio(width, height)) {
      return { ok: false, code: "aspect" };
    }
    return { ok: true, width, height };
  } catch {
    return { ok: false, code: "load_failed" };
  }
}

/** Responsive `sizes` for list card thumbnails (§5.1). */
export const EVENT_COVER_CARD_SIZES = "(max-width: 640px) 120px, (max-width: 1024px) 160px, 200px";
