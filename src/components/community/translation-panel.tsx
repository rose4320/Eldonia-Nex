"use client";

import { useState } from "react";
import { NEXUS_LOCALES, type NexusLocale } from "@/lib/nexus-translate/translate";

type TranslationPanelProps = {
  text: string;
  sourceLocale?: string;
  defaultTarget?: NexusLocale;
  compact?: boolean;
};

export function TranslationPanel({
  text,
  sourceLocale = "ja",
  defaultTarget = "en",
  compact = false,
}: TranslationPanelProps) {
  const [target, setTarget] = useState<NexusLocale>(defaultTarget);
  const [translated, setTranslated] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  async function handleTranslate() {
    setLoading(true);
    try {
      const res = await fetch("/api/nexus/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target, source: sourceLocale }),
      });
      const data = (await res.json()) as {
        translated?: string;
        mode?: string;
        error?: string;
      };
      if (!res.ok || !data.translated) {
        alert(data.error ?? "翻訳に失敗しました。");
        return;
      }
      setTranslated(data.translated);
      setMode(data.mode ?? null);
      setShowTranslation(true);
    } catch {
      alert("翻訳に失敗しました。");
    } finally {
      setLoading(false);
    }
  }

  if (sourceLocale === target && !showTranslation) {
    return null;
  }

  return (
    <div className={compact ? "mt-2" : "mt-4 rounded border border-[var(--eldonia-border)] p-3"}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="eldonia-badge-nexus-prime text-[10px]">翻訳 Nexus</span>
        <select
          value={target}
          onChange={(e) => {
            setTarget(e.target.value as NexusLocale);
            setShowTranslation(false);
            setTranslated(null);
          }}
          className="rounded border border-[var(--eldonia-border)] bg-[var(--eldonia-surface)] px-2 py-1 text-xs"
          aria-label="翻訳先言語"
        >
          {NEXUS_LOCALES.filter((l) => l.value !== sourceLocale).map((locale) => (
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
          {loading ? "翻訳中..." : showTranslation ? "再翻訳" : "翻訳を表示"}
        </button>
        {showTranslation && (
          <button
            type="button"
            onClick={() => setShowTranslation(false)}
            className="eldonia-link text-xs"
          >
            原文のみ
          </button>
        )}
      </div>
      {showTranslation && translated && (
        <p className="eldonia-body mt-3 whitespace-pre-wrap text-sm text-[var(--eldonia-gold-muted)]">
          {translated}
          {mode === "demo" && (
            <span className="eldonia-hint ml-2 text-[10px]">（デモ辞書翻訳）</span>
          )}
        </p>
      )}
    </div>
  );
}
