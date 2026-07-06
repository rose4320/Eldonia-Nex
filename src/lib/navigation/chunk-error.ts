const CHUNK_ERROR_PATTERNS = [
  "Loading chunk",
  "ChunkLoadError",
  "Failed to fetch dynamically imported module",
  "Importing a module script failed",
  "Failed to load script",
  "dynamically imported module",
] as const;

export function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;

  const message =
    error instanceof Error
      ? `${error.name} ${error.message}`
      : typeof error === "string"
        ? error
        : String(error);

  return CHUNK_ERROR_PATTERNS.some((pattern) => message.includes(pattern));
}

export const CHUNK_RELOAD_STORAGE_KEY = "eldonia-chunk-reload";

export function reloadOnceForChunkError(): boolean {
  if (typeof window === "undefined") return false;
  if (sessionStorage.getItem(CHUNK_RELOAD_STORAGE_KEY)) return false;

  sessionStorage.setItem(CHUNK_RELOAD_STORAGE_KEY, "1");
  window.location.reload();
  return true;
}

export function clearChunkReloadGuard(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CHUNK_RELOAD_STORAGE_KEY);
}
