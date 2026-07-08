const SUPABASE_PUBLIC_ARTWORKS_RE =
  /\/storage\/v1\/object\/public\/artworks\/(.+)$/;

export function parseArtworksStoragePath(publicUrl: string): string | null {
  try {
    const { pathname } = new URL(publicUrl);
    const match = pathname.match(SUPABASE_PUBLIC_ARTWORKS_RE);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  } catch {
    const match = publicUrl.match(SUPABASE_PUBLIC_ARTWORKS_RE);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  }
}

export function buildDownloadFilename(title: string, url: string, suffix = ""): string {
  const ext = url.split("?")[0]?.split(".").pop()?.toLowerCase() ?? "bin";
  const safeTitle = title
    .trim()
    .replace(/[^\w\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af-]+/g, "_")
    .slice(0, 60) || "artwork";
  return `${safeTitle}${suffix}.${ext}`;
}
