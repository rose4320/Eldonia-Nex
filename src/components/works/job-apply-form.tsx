"use client";

import { useState } from "react";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { apiError, type ApiErrorKey } from "@/lib/i18n/api-errors";
import type { JobListingWithPoster, Portfolio } from "@/types/database";

type JobApplyFormProps = {
  job: JobListingWithPoster;
  portfolio: Portfolio | null;
  isLoggedIn: boolean;
};

export function JobApplyForm({ job, portfolio, isLoggedIn }: JobApplyFormProps) {
  const locale = useLocale();
  const { forms } = useContent();
  const apply = forms.apply;
  const [message, setMessage] = useState("");
  const [attachPortfolio, setAttachPortfolio] = useState(
    portfolio?.attach_on_apply ?? true,
  );
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn) {
    return (
      <a
        href={`/auth/login?redirect_to=/works/${job.id}`}
        className="eldonia-btn-primary inline-block text-center"
      >
        {apply.loginToApply}
      </a>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setStatusText(null);
    try {
      const res = await fetch("/api/works/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          coverMessage: message,
          attachPortfolio,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        errorKey?: ApiErrorKey;
      };
      if (!res.ok) {
        setStatus("error");
        setStatusText(
          data.errorKey
            ? apiError(data.errorKey, locale)
            : (data.error ?? apply.errSave),
        );
        return;
      }
      setStatus("success");
      setStatusText(apply.success);
    } catch {
      setStatus("error");
      setStatusText(apply.errSave);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="eldonia-buy-box space-y-4">
      <h2 className="eldonia-label">{apply.heading}</h2>
      {portfolio && attachPortfolio && (
        <div className="rounded border border-[var(--eldonia-border)] p-3 text-sm">
          <p className="eldonia-badge-nexus-prime w-fit">{apply.portfolioAttach}</p>
          <p className="mt-2 text-[var(--eldonia-gold-light)]">{portfolio.headline}</p>
          <p className="text-xs text-[var(--eldonia-text-dim)]">
            Lv.{portfolio.level} · {portfolio.title_badge} · EXP {portfolio.exp_points}
          </p>
        </div>
      )}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={attachPortfolio}
          onChange={(e) => setAttachPortfolio(e.target.checked)}
          disabled={!portfolio}
        />
        {apply.attachLabel}
      </label>
      <textarea
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={apply.messagePlaceholder}
        className="eldonia-textarea"
        required
      />
      <button type="submit" className="eldonia-btn-primary w-full" disabled={loading}>
        {loading ? apply.submitting : apply.submit}
      </button>
      {status && statusText && (
        <p className={status === "error" ? "eldonia-alert-error" : "eldonia-alert-success"}>
          {statusText}
        </p>
      )}
    </form>
  );
}
