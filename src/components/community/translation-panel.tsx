"use client";

import { useEffect, useRef, useState } from "react";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import {
  NEXUS_LOCALES,
  normalizeNexusLocale,
  resolveNexusTarget,
  type NexusLocale,
} from "@/lib/nexus-translate/translate";

type TranslationPanelProps = {
  text: string;
  sourceLocale?: string;
  defaultTarget?: NexusLocale;
  compact?: boolean;
  variant?: "body" | "title";
  initialTranslated?: string | null;
};

export function TranslationPanel({
  text,
  sourceLocale = "ja",
  defaultTarget,
  compact = false,
  variant = "body",
  initialTranslated = null,
}: TranslationPanelProps) {
  const { pages } = useContent();
  const uiLocale = useLocale();
  const nexus = pages.community;
  const source = normalizeNexusLocale(sourceLocale);
  const preferredTarget = resolveNexusTarget(
    source,
    defaultTarget ?? uiLocale,
  );
  const [target, setTarget] = useState<NexusLocale>(preferredTarget);
  const [translated, setTranslated] = useState<string | null>(initialTranslated);
  const [mode, setMode] = useState<string | null>(
    initialTranslated ? "google" : null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalOnly, setOriginalOnly] = useState(false);
  const autoFetchedRef = useRef(Boolean(initialTranslated));

  const needsTranslation = source !== target;

  async function fetchTranslation(nextTarget: NexusLocale) {
    if (nextTarget === source) {
      setTranslated(null);
      setMode(null);
      setOriginalOnly(false);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/nexus/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target: nextTarget, source }),
      });
      const data = (await res.json()) as {
        translated?: string;
        mode?: string;
        error?: string;
      };
      if (!res.ok || !data.translated) {
        setError(data.error ?? nexus.nexusErr);
        return;
      }
      setTranslated(data.translated);
      setMode(data.mode ?? null);
      setOriginalOnly(false);
    } catch {
      setError(nexus.nexusErr);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (autoFetchedRef.current || !needsTranslation) return;
    autoFetchedRef.current = true;
    void fetchTranslation(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- auto-translate once when no server cache
  }, [needsTranslation, target]);

  const mainText =
    !needsTranslation || originalOnly || !translated ? text : translated;
  const mainClass =
    variant === "title"
      ? "eldonia-heading eldonia-heading-sm whitespace-pre-wrap"
      : compact
        ? "eldonia-body whitespace-pre-wrap text-sm"
        : "eldonia-body whitespace-pre-wrap text-sm";

  return (
    <div className={compact ? "mt-2" : variant === "title" ? "" : "mt-4 rounded border border-[var(--eldonia-border)] p-3"}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="eldonia-badge-nexus-prime text-[10px]">{nexus.nexusBadge}</span>
        <select
          value={target}
          onChange={(e) => {
            const next = e.target.value as NexusLocale;
            setTarget(next);
            setTranslated(null);
            setMode(null);
            setOriginalOnly(false);
            setError(null);
            autoFetchedRef.current = true;
            void fetchTranslation(next);
          }}
          className="rounded border border-[var(--eldonia-border)] bg-[var(--eldonia-surface)] px-2 py-1 text-xs"
          aria-label={nexus.nexusTargetAria}
        >
          {NEXUS_LOCALES.map((locale) => (
            <option key={locale.value} value={locale.value}>
              {locale.value === "ja"
                ? "日本語"
                : locale.value === "en"
                  ? "English"
                  : locale.value === "ko"
                    ? "한국어"
                    : "中文"}
              {locale.value === source
                ? ` (${nexus.nexusOriginalLang ?? "原文"})`
                : ""}
            </option>
          ))}
        </select>
        {needsTranslation && (
          <>
            <button
              type="button"
              onClick={() => void fetchTranslation(target)}
              disabled={loading}
              className="eldonia-btn-ghost text-xs"
            >
              {loading ? nexus.nexusTranslating : nexus.nexusRetranslate}
            </button>
            <button
              type="button"
              onClick={() => setOriginalOnly((v) => !v)}
              className="eldonia-link text-xs"
            >
              {originalOnly ? nexus.nexusShow : nexus.nexusOriginalOnly}
            </button>
          </>
        )}
      </div>

      {variant === "title" ? (
        <h1 className={`${mainClass} mt-3`}>{loading && !translated ? text : mainText}</h1>
      ) : (
        <p className={`${mainClass} mt-3`}>
          {loading && !translated ? text : mainText}
          {mode === "demo" && translated && !originalOnly && needsTranslation && (
            <span className="eldonia-hint ml-2 text-[10px]">{nexus.nexusDemoHint}</span>
          )}
        </p>
      )}

      {needsTranslation && !originalOnly && translated && translated !== text && (
        <p className="eldonia-localized-hint mt-2 whitespace-pre-wrap">{text}</p>
      )}

      {error && <p className="eldonia-alert-error mt-2 text-xs">{error}</p>}
    </div>
  );
}
