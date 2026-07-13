"use client";

import { useEffect, useState } from "react";
import { TranslatedContentLine } from "@/components/i18n/content-line";
import { useLocale } from "@/components/providers/locale-provider";
import { inferSourceLocale } from "@/lib/translation/infer-source-locale";
import { normalizeNexusLocale } from "@/lib/nexus-translate/translate";

type LabChatTranslatedBodyProps = {
  text: string;
};

/** Lab chat: live translate when source ≠ UI locale, show translation + original. */
export function LabChatTranslatedBody({ text }: LabChatTranslatedBodyProps) {
  const locale = useLocale();
  const sourceLocale = inferSourceLocale(text);
  const source = normalizeNexusLocale(sourceLocale);
  const target = normalizeNexusLocale(locale);
  const requestKey = `${text}\0${source}\0${target}`;
  const [cache, setCache] = useState<{ key: string; translated: string | null }>(
    () => ({ key: requestKey, translated: null }),
  );
  const translated = cache.key === requestKey ? cache.translated : null;

  useEffect(() => {
    if (!text.trim() || source === target) return;

    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/nexus/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, source, target }),
        });
        const data = (await res.json()) as { translated?: string };
        if (!cancelled && res.ok && data.translated?.trim()) {
          setCache({ key: requestKey, translated: data.translated.trim() });
        }
      } catch {
        /* keep original-only fallback */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [text, source, target, requestKey]);

  return (
    <TranslatedContentLine
      text={text}
      translatedText={translated}
      sourceLocale={sourceLocale}
      locale={locale}
      as="p"
      className="mt-1 whitespace-pre-wrap text-sm text-eldonia-text-muted"
      hintClassName="eldonia-localized-hint text-[10px]"
    />
  );
}
