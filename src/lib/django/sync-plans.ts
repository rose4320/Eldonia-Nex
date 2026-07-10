/** Sync Django plan catalog ↔ Supabase subscription_plans (archive old). */

export async function syncPlansWithDjango(
  mode: "bidirectional" | "push" = "push",
): Promise<{ ok: boolean; error?: string; result?: unknown }> {
  const base = (
    process.env.DJANGO_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://127.0.0.1:8000/api/v1"
  ).replace(/\/$/, "");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (process.env.INTERNAL_API_TOKEN) {
    headers["x-internal-api-token"] = process.env.INTERNAL_API_TOKEN;
  }

  try {
    const response = await fetch(`${base}/plans/sync/`, {
      method: "POST",
      headers,
      body: JSON.stringify({ mode }),
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok) {
      return { ok: false, error: payload?.error ?? response.statusText };
    }
    return { ok: true, result: payload };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "plan sync failed",
    };
  }
}
