import type { UiLocale } from "@/lib/i18n/locale";

/** Infer source locale from text when DB has no locale column. */
export function inferSourceLocale(text: string, fallback: UiLocale = "ja"): UiLocale {
  const trimmed = text.trim();
  if (!trimmed) return fallback;

  const hangul = trimmed.match(/[\uac00-\ud7af]/g)?.length ?? 0;
  const kana = trimmed.match(/[\u3040-\u30ff]/g)?.length ?? 0;
  const han = trimmed.match(/[\u4e00-\u9faf]/g)?.length ?? 0;
  const cjk = kana + han;
  const latin = trimmed.match(/[a-zA-Z]/g)?.length ?? 0;

  if (hangul > cjk && hangul > latin * 0.4) return "ko";
  // Brand + Japanese suffix titles (e.g. Eldonia-Nex 使い方) must stay ja.
  if (kana >= 1) return "ja";
  if (cjk > latin) return "ja";
  if (latin > cjk * 0.6) return "en";
  return fallback;
}
