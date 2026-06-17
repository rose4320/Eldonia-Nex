import { phraseTranslation } from "@/lib/i18n/phrases";
import type { UiLocale } from "@/lib/i18n/locale";
import {
  translateNexusDemo,
  type NexusLocale,
} from "@/lib/nexus-translate/translate";

function detectContentLocale(text: string): UiLocale {
  const cjk = text.match(/[\u3040-\u30ff\u4e00-\u9faf]/g)?.length ?? 0;
  const latin = text.match(/[a-zA-Z]/g)?.length ?? 0;
  if (cjk > latin) return "ja";
  if (latin > cjk * 0.6) return "en";
  return "ja";
}

function isUsefulHint(original: string, hint: string): boolean {
  const a = original.trim().toLowerCase();
  const b = hint.trim().toLowerCase();
  if (!b || a === b) return false;
  if (hint.startsWith("[Nexus")) return false;
  return true;
}

/** UI 言語と異なるコンテンツ向けに、括弧内表示用の翻訳ヒントを返す */
export function localizedHint(text: string, uiLocale: UiLocale): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const source = detectContentLocale(trimmed);
  if (source === uiLocale) return null;

  const exact = phraseTranslation(trimmed, uiLocale);
  if (exact && isUsefulHint(trimmed, exact)) return exact;

  const { text: demo } = translateNexusDemo(
    trimmed,
    uiLocale as NexusLocale,
    source as NexusLocale,
  );
  if (isUsefulHint(trimmed, demo)) return demo;

  return null;
}
