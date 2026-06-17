"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { createClient } from "@/lib/supabase/client";
import { levelFromExp } from "@/lib/works/constants";
import { portfolioVisibilityOptions } from "@/lib/i18n/taxonomy";
import type { Portfolio, PortfolioVisibility } from "@/types/database";

type PortfolioFormProps = {
  userId: string;
  portfolio: Portfolio | null;
};

export function PortfolioForm({ userId, portfolio }: PortfolioFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const { forms } = useContent();
  const copy = forms.portfolio;
  const visibilityOptions = portfolioVisibilityOptions(locale);
  const [headline, setHeadline] = useState(portfolio?.headline ?? "");
  const [summary, setSummary] = useState(portfolio?.summary ?? "");
  const [skillsText, setSkillsText] = useState((portfolio?.skills ?? []).join(", "));
  const [visibility, setVisibility] = useState<PortfolioVisibility>(
    portfolio?.visibility ?? "public",
  );
  const [attachOnApply, setAttachOnApply] = useState(portfolio?.attach_on_apply ?? true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const expPoints = portfolio?.exp_points ?? 0;
  const level = portfolio?.level ?? levelFromExp(expPoints);
  const titleBadge = portfolio?.title_badge ?? copy.novice;

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

    setMessage(copy.saved);
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="eldonia-card mt-8 space-y-4">
      <p className="eldonia-badge-nexus-prime w-fit">
        Lv.{level} · {titleBadge || copy.novice}
      </p>

      <div className="flex flex-col gap-1">
        <label htmlFor="headline" className="eldonia-label">
          {copy.headline}
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
          {copy.summary}
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
          {copy.skills}
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
          <span className="eldonia-label">
            {copy.exp}
          </span>
          <p className="eldonia-input pointer-events-none opacity-80">
            {expPoints.toLocaleString()} EXP
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="eldonia-label">
            {copy.titleBadge}
          </span>
          <p className="eldonia-input pointer-events-none opacity-80">
            {titleBadge}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="visibility" className="eldonia-label">
          {copy.visibility}
        </label>
        <select
          id="visibility"
          value={visibility}
          onChange={(event) => setVisibility(event.target.value as PortfolioVisibility)}
          className="eldonia-input"
        >
          {visibilityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-eldonia-text-muted">
        <input
          type="checkbox"
          checked={attachOnApply}
          onChange={(event) => setAttachOnApply(event.target.checked)}
          className="rounded border-(--eldonia-border) accent-eldonia-gold"
        />
        {copy.attachOnApply}
      </label>

      {error && <p className="eldonia-alert-error">{error}</p>}
      {message && <p className="eldonia-alert-success">{message}</p>}

      <button type="submit" disabled={loading} className="eldonia-btn-primary w-fit">
        {loading ? copy.saving : copy.submit}
      </button>
    </form>
  );
}
