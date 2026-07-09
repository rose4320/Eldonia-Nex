function djangoApiBaseUrl(): string {
  return (
    process.env.DJANGO_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://127.0.0.1:8000/api/v1"
  ).replace(/\/$/, "");
}

/** Supabase 投稿後に Django Admin 用 DB へ作品を同期（失敗しても投稿は成功扱い） */
export async function syncDjangoCatalogForCreator(creatorId: string): Promise<void> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (process.env.INTERNAL_API_TOKEN) {
    headers["x-internal-api-token"] = process.env.INTERNAL_API_TOKEN;
  }

  try {
    await fetch(`${djangoApiBaseUrl()}/catalog/sync/`, {
      method: "POST",
      headers,
      body: JSON.stringify({ creator_id: creatorId, artworks_only: true }),
      cache: "no-store",
    });
  } catch {
    // non-blocking
  }
}
