"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { JOB_TYPES } from "@/lib/works/constants";
import type { JobType } from "@/types/database";

export function JobCreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobType, setJobType] = useState<JobType>("freelance");
  const [location, setLocation] = useState("リモート");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/works/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        jobType,
        location,
        budgetMin: budgetMin ? Number(budgetMin) : null,
        budgetMax: budgetMax ? Number(budgetMax) : null,
        skills: skillsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    });

    const data = (await res.json()) as { ok?: boolean; error?: string; id?: string };
    if (!res.ok) {
      setError(data.error ?? "求人の作成に失敗しました。");
      setLoading(false);
      return;
    }

    router.refresh();
    setTitle("");
    setDescription("");
    setSkillsText("");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="eldonia-card space-y-4">
      <h2 className="eldonia-label">求人を掲載</h2>
      <input
        type="text"
        required
        maxLength={120}
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="eldonia-input"
      />
      <textarea
        required
        rows={4}
        placeholder="詳細"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="eldonia-textarea"
      />
      <select
        value={jobType}
        onChange={(e) => setJobType(e.target.value as JobType)}
        className="eldonia-input"
      >
        {JOB_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="場所"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="eldonia-input"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="number"
          min={0}
          placeholder="予算 min (円)"
          value={budgetMin}
          onChange={(e) => setBudgetMin(e.target.value)}
          className="eldonia-input"
        />
        <input
          type="number"
          min={0}
          placeholder="予算 max (円)"
          value={budgetMax}
          onChange={(e) => setBudgetMax(e.target.value)}
          className="eldonia-input"
        />
      </div>
      <input
        type="text"
        placeholder="スキル（カンマ区切り）"
        value={skillsText}
        onChange={(e) => setSkillsText(e.target.value)}
        className="eldonia-input"
      />
      {error && <p className="eldonia-alert-error">{error}</p>}
      <button type="submit" disabled={loading} className="eldonia-btn-primary w-fit">
        {loading ? "掲載中..." : "求人を掲載"}
      </button>
    </form>
  );
}
