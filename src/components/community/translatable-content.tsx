"use client";

import { useState } from "react";
import { LOCALE_LABELS } from "@/lib/community/constants";
import type { NexusLocale } from "@/lib/nexus-translate/translate";

type TranslatableContentProps = {
  text: string;
  sourceLocale: string;
  defaultTarget?: NexusLocale;
  className?: string;
};

export function TranslatableContent({
  text,
  sourceLocale,
  defaultTarget = "en",
  className = "eldonia-body whitespace-pre-wrap text-sm",
}: TranslatableContentProps) {
  const [translated, setTranslated] = useState<string | null>(null);
  const [target, setTarget] = useState<NexusLocale>(defaultTarget);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(true);

  const sourceLabel = LOCALE_LABELS[sourceLocale] ?? sourceLocale;
  const needsTranslation = sourceLocale !== target;

  async function handleTranslate(nextTarget?: NexusLocale) {
    const locale = nextTarget ?? target;
    setTarget(locale);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/nexus/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          target: locale,
          source: sourceLocale,
        }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok || !data.text) {
        setError(data.error ?? "翻訳に失敗しました。");
        return;
      }
      setTranslated(data.text);
    } catch {
      setError("翻訳に失敗しました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="eldonia-badge-nexus-prime text-[10px]">翻訳 Nexus</span>
        <span className="text-xs text-[var(--eldonia-text-dim)]">原文: {sourceLabel}</span>
        {needsTranslation && (
          <>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value as NexusLocale)}
              className="rounded border border-[var(--eldonia-border)] bg-[var(--eldonia-surface)] px-2 py-1 text-xs"
              aria-label="翻訳先言語"
            >
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="zh-CN">中文</option>
            </select>
            <button
              type="button"
              onClick={() => handleTranslate()}
              disabled={loading}
              className="eldonia-btn-ghost text-xs"
            >
              {loading ? "翻訳中..." : "Nexus で翻訳"}
            </button>
          </>
        )}
      </div>

      {showOriginal && <p className={className}>{text}</p>}

      {translated && (
        <div className="eldonia-nexus-translation rounded border border-[var(--eldonia-border-strong)] p-4">
          <p className="eldonia-eyebrow mb-2">Nexus Translation · {LOCALE_LABELS[target] ?? target}</p>
          <p className={className}>{translated}</p>
          <button
            type="button"
            onClick={() => setShowOriginal((v) => !v)}
            className="eldonia-link mt-3 text-xs"
          >
            {showOriginal ? "原文を隠す" : "原文を表示"}
          </button>
        </div>
      )}

      {error && <p className="eldonia-alert-error text-sm">{error}</p>}
    </div>
  );
}
