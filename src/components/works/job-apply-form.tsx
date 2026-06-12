"use client";

import { useState } from "react";
import type { JobListingWithPoster, Portfolio } from "@/types/database";

type JobApplyFormProps = {
  job: JobListingWithPoster;
  portfolio: Portfolio | null;
  isLoggedIn: boolean;
};

export function JobApplyForm({ job, portfolio, isLoggedIn }: JobApplyFormProps) {
  const [message, setMessage] = useState("");
  const [attachPortfolio, setAttachPortfolio] = useState(
    portfolio?.attach_on_apply ?? true,
  );
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn) {
    return (
      <a
        href={`/auth/login?redirect_to=/works/${job.id}`}
        className="eldonia-btn-primary inline-block text-center"
      >
        ログインして応募
      </a>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
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
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setStatus(data.error ?? "応募に失敗しました。");
        return;
      }
      setStatus("応募を送信しました。求人主からの連絡をお待ちください。");
    } catch {
      setStatus("応募に失敗しました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="eldonia-buy-box space-y-4">
      <h2 className="eldonia-label">応募</h2>
      {portfolio && attachPortfolio && (
        <div className="rounded border border-[var(--eldonia-border)] p-3 text-sm">
          <p className="eldonia-badge-nexus-prime w-fit">Portfolio 添付</p>
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
        ポートフォリオを添付（ダッシュボード設定に従う）
      </label>
      <textarea
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="志望動機・実績..."
        className="eldonia-textarea"
        required
      />
      <button type="submit" className="eldonia-btn-primary w-full" disabled={loading}>
        {loading ? "送信中..." : "応募する"}
      </button>
      {status && (
        <p className={status.includes("失敗") ? "eldonia-alert-error" : "eldonia-alert-success"}>
          {status}
        </p>
      )}
    </form>
  );
}
