export type NexusLocale = "ja" | "en" | "ko" | "zh-CN";

export const NEXUS_LOCALES: { value: NexusLocale; label: string }[] = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
  { value: "ko", label: "한국어" },
  { value: "zh-CN", label: "中文" },
];

const JA_TO_EN: Record<string, string> = {
  ようこそ: "Welcome",
  クリエイター: "creator",
  作品: "artwork",
  共有: "share",
  協業: "collaboration",
  翻訳: "translation",
  掲示板: "forum",
  スレッド: "thread",
  返信: "reply",
  求人: "job listing",
  ポートフォリオ: "portfolio",
  イベント: "event",
  チケット: "ticket",
  ショップ: "shop",
  ギャラリー: "gallery",
  ネクサス: "Nexus",
  Eldonia: "Eldonia",
};

const EN_TO_JA: Record<string, string> = Object.fromEntries(
  Object.entries(JA_TO_EN).map(([ja, en]) => [en.toLowerCase(), ja]),
);

function isMostlyJapanese(text: string): boolean {
  const cjk = text.match(/[\u3040-\u30ff\u4e00-\u9faf]/g);
  return (cjk?.length ?? 0) > text.length * 0.15;
}

function applyDictionary(text: string, map: Record<string, string>): string {
  let result = text;
  for (const [from, to] of Object.entries(map)) {
    result = result.replaceAll(from, to);
  }
  return result;
}

export function translateNexusDemo(
  text: string,
  target: NexusLocale,
  source?: NexusLocale,
): { text: string; mode: "demo" | "passthrough" } {
  const trimmed = text.trim();
  if (!trimmed) return { text: "", mode: "passthrough" };

  const detectedSource =
    source ?? (isMostlyJapanese(trimmed) ? "ja" : "en");

  if (detectedSource === target) {
    return { text: trimmed, mode: "passthrough" };
  }

  if (target === "en" && detectedSource === "ja") {
    const translated = applyDictionary(trimmed, JA_TO_EN);
    return {
      text:
        translated === trimmed
          ? `[Nexus EN] ${trimmed}`
          : translated,
      mode: "demo",
    };
  }

  if (target === "ja" && detectedSource === "en") {
    let translated = trimmed;
    for (const [en, ja] of Object.entries(EN_TO_JA)) {
      translated = translated.replace(new RegExp(`\\b${en}\\b`, "gi"), ja);
    }
    return {
      text:
        translated === trimmed
          ? `[Nexus JA] ${trimmed}`
          : translated,
      mode: "demo",
    };
  }

  const label = NEXUS_LOCALES.find((l) => l.value === target)?.label ?? target;
  return {
    text: `[Nexus → ${label}] ${trimmed}`,
    mode: "demo",
  };
}
