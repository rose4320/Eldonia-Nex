import { parseUiLocale, type UiLocale } from "@/lib/i18n/locale";

/** Parse Accept-Language into a supported UI locale, or null if none match. */
export function resolveUiLocaleFromAcceptLanguage(
  header: string | null | undefined,
): UiLocale | null {
  if (!header?.trim()) return null;

  const ranked = header
    .split(",")
    .map((part) => {
      const [rawTag, ...params] = part.trim().split(";");
      const tag = rawTag.toLowerCase();
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;
      return { tag, q: Number.isFinite(q) ? q : 0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (tag.startsWith("en")) return "en";
    if (tag.startsWith("ko")) return "ko";
    if (tag.startsWith("zh")) return "zh-CN";
    if (tag.startsWith("ja")) return "ja";
  }

  return null;
}

export function resolveUiLocale(
  cookieValue: string | undefined,
  acceptLanguage: string | null | undefined,
): UiLocale {
  if (cookieValue) return parseUiLocale(cookieValue);
  return resolveUiLocaleFromAcceptLanguage(acceptLanguage) ?? "ja";
}
