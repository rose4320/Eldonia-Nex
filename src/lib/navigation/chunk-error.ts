const RECOVERABLE_ERROR_PATTERNS = [
  "Loading chunk",
  "ChunkLoadError",
  "Failed to fetch dynamically imported module",
  "Importing a module script failed",
  "Failed to load script",
  "dynamically imported module",
  "Failed to fetch RSC payload",
  "Server Components render",
  "Hydration failed",
  "Text content does not match",
  "Minified React error",
  "NetworkError",
  "Load failed",
  "Unexpected token '<'",
  "fetch failed",
] as const;

export function isRecoverableNavigationError(error: unknown): boolean {
  if (!error) return false;

  const message =
    error instanceof Error
      ? `${error.name} ${error.message}${
          "digest" in error && typeof error.digest === "string" ? ` ${error.digest}` : ""
        }`
      : typeof error === "string"
        ? error
        : String(error);

  return RECOVERABLE_ERROR_PATTERNS.some((pattern) => message.includes(pattern));
}

/** @deprecated Use isRecoverableNavigationError */
export const isChunkLoadError = isRecoverableNavigationError;

export const CHUNK_RELOAD_STORAGE_KEY = "eldonia-chunk-reload";

export function reloadOnceForChunkError(): boolean {
  if (typeof window === "undefined") return false;
  if (sessionStorage.getItem(CHUNK_RELOAD_STORAGE_KEY)) return false;

  sessionStorage.setItem(CHUNK_RELOAD_STORAGE_KEY, "1");
  hardReload();
  return true;
}

export function hardReload(): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.set("_r", Date.now().toString());
  window.location.replace(url.toString());
}

export function clearChunkReloadGuard(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CHUNK_RELOAD_STORAGE_KEY);
}
