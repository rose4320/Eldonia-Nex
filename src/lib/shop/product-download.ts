import type { ShopProduct } from "@/types/database";

export function resolveProductDownloadUrl(
  product: Pick<ShopProduct, "image_url" | "gallery_urls">,
): string | null {
  const primary = product.image_url?.trim();
  if (primary) return primary;

  const gallery = product.gallery_urls.find((url) => url.trim().length > 0);
  return gallery?.trim() ?? null;
}

export function productDownloadFilename(title: string, sourceUrl: string): string {
  const pathname = sourceUrl.split("?")[0] ?? "";
  const extMatch = /\.([a-zA-Z0-9]{2,8})$/.exec(pathname);
  const ext = extMatch?.[1] ?? "bin";
  const safeTitle = title
    .trim()
    .replace(/[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return `${safeTitle || "product"}.${ext}`;
}

export function productHasDownloadFile(
  product: Pick<ShopProduct, "image_url" | "gallery_urls">,
): boolean {
  if (product.image_url?.trim()) return true;
  return product.gallery_urls.some((url) => url.trim().length > 0);
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
