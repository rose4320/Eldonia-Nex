import type { ShopProduct } from "@/types/database";

const COVER_IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "heic",
  "heif",
]);

const DISTRIBUTION_EXTENSIONS = new Set([
  "mp3",
  "wav",
  "flac",
  "m4a",
  "aac",
  "ogg",
  "mp4",
  "mov",
  "webm",
  "pdf",
  "glb",
  "gltf",
  "zip",
  "rar",
  "7z",
  "psd",
  "clip",
]);

export type ProductDownloadSource = Pick<
  ShopProduct,
  "image_url" | "gallery_urls" | "download_url"
>;

export function urlFileExtension(url: string): string | null {
  const pathname = url.split("?")[0]?.split("#")[0] ?? "";
  const ext = pathname.split(".").pop()?.toLowerCase();
  return ext && ext.length <= 8 ? ext : null;
}

export function isLikelyCoverImageUrl(url: string): boolean {
  const ext = urlFileExtension(url);
  return ext ? COVER_IMAGE_EXTENSIONS.has(ext) : false;
}

export function isLikelyDistributionMediaUrl(url: string): boolean {
  const ext = urlFileExtension(url);
  if (!ext) return false;
  if (COVER_IMAGE_EXTENSIONS.has(ext)) return false;
  return DISTRIBUTION_EXTENSIONS.has(ext);
}

/** 配布用 URL — ジャケット（image_url）より優先 */
export function resolveProductDownloadUrl(product: ProductDownloadSource): string | null {
  const explicit = product.download_url?.trim();
  if (explicit) return explicit;

  for (const raw of product.gallery_urls) {
    const url = raw.trim();
    if (url && isLikelyDistributionMediaUrl(url)) {
      return url;
    }
  }

  const imageUrl = product.image_url?.trim();
  if (imageUrl && !isLikelyCoverImageUrl(imageUrl)) {
    return imageUrl;
  }

  for (const raw of product.gallery_urls) {
    const url = raw.trim();
    if (url) return url;
  }

  if (imageUrl) {
    return imageUrl;
  }

  return null;
}

export function productHasDownloadFile(product: ProductDownloadSource): boolean {
  return resolveProductDownloadUrl(product) !== null;
}

export function productDownloadFilename(title: string, sourceUrl: string): string {
  const ext = urlFileExtension(sourceUrl) ?? "bin";
  const safeTitle = title
    .trim()
    .replace(/[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return `${safeTitle || "product"}.${ext}`;
}

export function parseShopStoragePath(publicUrl: string): string | null {
  const marker = "/storage/v1/object/public/";
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;

  const rest = publicUrl.slice(idx + marker.length);
  const slash = rest.indexOf("/");
  if (slash === -1) return null;

  const bucket = rest.slice(0, slash);
  const path = rest.slice(slash + 1);
  if (!bucket || !path) return null;

  return `${bucket}/${path}`;
}

/** 登録時: デジタル商品の cover / download を正規化 */
export function normalizeDigitalProductUrls(input: {
  imageUrl: string;
  downloadUrl: string;
}): { image_url: string | null; download_url: string | null } {
  let cover = input.imageUrl.trim();
  let download = input.downloadUrl.trim();

  if (!download && cover && !isLikelyCoverImageUrl(cover)) {
    download = cover;
    cover = "";
  }

  return {
    image_url: cover || null,
    download_url: download || null,
  };
}
