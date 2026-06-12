"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { levelFromExp, PORTFOLIO_VISIBILITY } from "@/lib/works/constants";
import type { Portfolio, PortfolioVisibility } from "@/types/database";

type PortfolioFormProps = {
  userId: string;
  portfolio: Portfolio | null;
};

export function PortfolioForm({ userId, portfolio }: PortfolioFormProps) {
  const router = useRouter();
  const [headline, setHeadline] = useState(portfolio?.headline ?? "");
  const [summary, setSummary] = useState(portfolio?.summary ?? "");
  const [skillsText, setSkillsText] = useState((portfolio?.skills ?? []).join(", "));
  const [expPoints, setExpPoints] = useState(portfolio?.exp_points ?? 0);
  const [titleBadge, setTitleBadge] = useState(portfolio?.title_badge ?? "Novice");
  const [visibility, setVisibility] = useState<PortfolioVisibility>(
    portfolio?.visibility ?? "public",
  );
  const [attachOnApply, setAttachOnApply] = useState(portfolio?.attach_on_apply ?? true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const level = levelFromExp(expPoints);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const skills = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const supabase = createClient();
    const { error: upsertError } = await supabase.from("portfolios").upsert(
      {
        user_id: userId,
        headline: headline.trim() || null,
        summary: summary.trim() || null,
        skills,
        exp_points: Math.max(0, expPoints),
        level: levelFromExp(Math.max(0, expPoints)),
        title_badge: titleBadge.trim() || null,
        visibility,
        attach_on_apply: attachOnApply,
      },
      { onConflict: "user_id" },
    );

    if (upsertError) {
      setError(upsertError.message);
      setLoading(false);
      return;
    }

    setMessage("ポートフォリオを保存しました。");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="eldonia-card mt-8 space-y-4">
      <p className="eldonia-badge-nexus-prime w-fit">
        Lv.{level} · {titleBadge || "Novice"}
      </p>

      <div className="flex flex-col gap-1">
        <label htmlFor="headline" className="eldonia-label">
          見出し
        </label>
        <input
          id="headline"
          type="text"
          maxLength={120}
          value={headline}
          onChange={(event) => setHeadline(event.target.value)}
          className="eldonia-input"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="summary" className="eldonia-label">
          概要
        </label>
        <textarea
          id="summary"
          rows={4}
          maxLength={2000}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          className="eldonia-textarea"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="skills" className="eldonia-label">
          スキル（カンマ区切り）
        </label>
        <input
          id="skills"
          type="text"
          value={skillsText}
          onChange={(event) => setSkillsText(event.target.value)}
          className="eldonia-input"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="exp" className="eldonia-label">
            EXP
          </label>
          <input
            id="exp"
            type="number"
            min={0}
            value={expPoints}
            onChange={(event) => setExpPoints(Number(event.target.value))}
            className="eldonia-input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="title-badge" className="eldonia-label">
            称号
          </label>
          <input
            id="title-badge"
            type="text"
            maxLength={40}
            value={titleBadge}
            onChange={(event) => setTitleBadge(event.target.value)}
            className="eldonia-input"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="visibility" className="eldonia-label">
          公開範囲
        </label>
        <select
          id="visibility"
          value={visibility}
          onChange={(event) => setVisibility(event.target.value as PortfolioVisibility)}
          className="eldonia-input"
        >
          {PORTFOLIO_VISIBILITY.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-[var(--eldonia-text-muted)]">
        <input
          type="checkbox"
          checked={attachOnApply}
          onChange={(event) => setAttachOnApply(event.target.checked)}
          className="rounded border-[var(--eldonia-border)] accent-[var(--eldonia-gold)]"
        />
        応募時にポートフォリオを自動添付
      </label>

      {error && <p className="eldonia-alert-error">{error}</p>}
      {message && <p className="eldonia-alert-success">{message}</p>}

      <button type="submit" disabled={loading} className="eldonia-btn-primary w-fit">
        {loading ? "保存中..." : "保存する"}
      </button>
    </form>
  );
}
