"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { jobTypeOptions } from "@/lib/i18n/taxonomy";
import type { JobType } from "@/types/database";

export function JobCreateForm() {
  const router = useRouter();
  const locale = useLocale();
  const { forms } = useContent();
  const job = forms.job;
  const jobTypes = jobTypeOptions(locale);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobType, setJobType] = useState<JobType>("freelance");
  const [location, setLocation] = useState(job.remoteDefault);
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
      setError(data.error ?? job.errSave);
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
      <h2 className="eldonia-label">{job.heading}</h2>
      <input
        type="text"
        required
        maxLength={120}
        placeholder={job.titlePh}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="eldonia-input"
      />
      <textarea
        required
        rows={4}
        placeholder={job.descPh}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="eldonia-textarea"
      />
      <select
        value={jobType}
        onChange={(e) => setJobType(e.target.value as JobType)}
        className="eldonia-input"
      >
        {jobTypes.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder={job.locationPh}
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="eldonia-input"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="number"
          min={0}
          placeholder={job.budgetMinPh}
          value={budgetMin}
          onChange={(e) => setBudgetMin(e.target.value)}
          className="eldonia-input"
        />
        <input
          type="number"
          min={0}
          placeholder={job.budgetMaxPh}
          value={budgetMax}
          onChange={(e) => setBudgetMax(e.target.value)}
          className="eldonia-input"
        />
      </div>
      <input
        type="text"
        placeholder={job.skillsPh}
        value={skillsText}
        onChange={(e) => setSkillsText(e.target.value)}
        className="eldonia-input"
      />
      {error && <p className="eldonia-alert-error">{error}</p>}
      <button type="submit" disabled={loading} className="eldonia-btn-primary w-fit">
        {loading ? job.submitting : job.submit}
      </button>
    </form>
  );
}
