"use client";

import { useEffect, useState } from "react";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import {
  listNexusTargetLocales,
  normalizeNexusLocale,
  resolveNexusTarget,
  type NexusLocale,
} from "@/lib/nexus-translate/translate";

type TranslationPanelProps = {
  text: string;
  sourceLocale?: string;
  defaultTarget?: NexusLocale;
  compact?: boolean;
};

export function TranslationPanel({
  text,
  sourceLocale = "ja",
  defaultTarget,
  compact = false,
}: TranslationPanelProps) {
  const { pages } = useContent();
  const uiLocale = useLocale();
  const nexus = pages.community;
  const source = normalizeNexusLocale(sourceLocale);
  const targetOptions = listNexusTargetLocales(source);
  const preferredTarget = resolveNexusTarget(
    source,
    defaultTarget ?? uiLocale,
  );
  const [target, setTarget] = useState<NexusLocale>(preferredTarget);
  const [translated, setTranslated] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    setTarget((current) =>
      current !== source && targetOptions.some((locale) => locale.value === current)
        ? current
        : preferredTarget,
    );
    setShowTranslation(false);
    setTranslated(null);
    setError(null);
  }, [source, preferredTarget, targetOptions]);

  async function handleTranslate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/nexus/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target, source }),
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
      setShowTranslation(true);
    } catch {
      setError(nexus.nexusErr);
    } finally {
      setLoading(false);
    }
  }

  if (targetOptions.length === 0) {
    return null;
  }

  return (
    <div className={compact ? "mt-2" : "mt-4 rounded border border-[var(--eldonia-border)] p-3"}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="eldonia-badge-nexus-prime text-[10px]">{nexus.nexusBadge}</span>
        <select
          value={target}
          onChange={(e) => {
            setTarget(e.target.value as NexusLocale);
            setShowTranslation(false);
            setTranslated(null);
            setError(null);
          }}
          className="rounded border border-[var(--eldonia-border)] bg-[var(--eldonia-surface)] px-2 py-1 text-xs"
          aria-label={nexus.nexusTargetAria}
        >
          {targetOptions.map((locale) => (
            <option key={locale.value} value={locale.value}>
              {locale.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleTranslate}
          disabled={loading}
          className="eldonia-btn-ghost text-xs"
        >
          {loading ? nexus.nexusTranslating : showTranslation ? nexus.nexusRetranslate : nexus.nexusShow}
        </button>
        {showTranslation && (
          <button
            type="button"
            onClick={() => setShowTranslation(false)}
            className="eldonia-link text-xs"
          >
            {nexus.nexusOriginalOnly}
          </button>
        )}
      </div>
      {showTranslation && translated && (
        <p className="eldonia-body mt-3 whitespace-pre-wrap text-sm text-[var(--eldonia-gold-muted)]">
          {translated}
          {mode === "demo" && (
            <span className="eldonia-hint ml-2 text-[10px]">{nexus.nexusDemoHint}</span>
          )}
        </p>
      )}
      {error && <p className="eldonia-alert-error mt-2 text-xs">{error}</p>}
    </div>
  );
}
