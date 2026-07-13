import type { ContentTranslationEntityType } from "@/lib/translation/content-cache";

type WarmField = { fieldName: string; text: string };

/** Fire-and-forget: cache translations after UGC is saved. */
export function requestTranslationWarm(params: {
  entityType: ContentTranslationEntityType;
  entityId: string;
  sourceLocale: string;
  fields: WarmField[];
}): void {
  void fetch("/api/translation/warm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  }).catch(() => {
    /* non-blocking */
  });
}
