"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useContent } from "@/components/providers/locale-provider";
import type { QuestKind } from "@/types/database";

export function QuestCreateForm() {
  const router = useRouter();
  const { pages } = useContent();
  const copy = pages.works;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState<QuestKind>("brand");
  const [expReward, setExpReward] = useState(25);
  const [prizeSummary, setPrizeSummary] = useState("");
  const [submissionHint, setSubmissionHint] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/quests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        kind,
        status: "open",
        expReward,
        prizeSummary,
        submissionHint,
        isFeatured,
      }),
    });

    const payload = (await response.json()) as { error?: string };
    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? copy.questCreateFailed);
      return;
    }

    setTitle("");
    setDescription("");
    setPrizeSummary("");
    setSubmissionHint("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="eldonia-card space-y-3">
      <h2 className="font-display text-lg text-[var(--eldonia-gold-light)]">{copy.questCreateTitle}</h2>
      <label className="block space-y-1 text-sm">
        <span>{copy.questFieldTitle}</span>
        <input
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="eldonia-input w-full"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>{copy.questFieldDescription}</span>
        <textarea
          required
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="eldonia-input min-h-28 w-full"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>{copy.questFieldKind}</span>
        <select
          value={kind}
          onChange={(event) => setKind(event.target.value as QuestKind)}
          className="eldonia-input w-full"
        >
          <option value="brand">{copy.questKindBrand}</option>
          <option value="community">{copy.questKindCommunity}</option>
          <option value="daily">{copy.questKindDaily}</option>
        </select>
      </label>
      <label className="block space-y-1 text-sm">
        <span>{copy.questFieldExp}</span>
        <input
          type="number"
          min={0}
          value={expReward}
          onChange={(event) => setExpReward(Number(event.target.value))}
          className="eldonia-input w-full"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>{copy.questFieldPrize}</span>
        <input
          value={prizeSummary}
          onChange={(event) => setPrizeSummary(event.target.value)}
          className="eldonia-input w-full"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>{copy.questFieldSubmissionHint}</span>
        <input
          value={submissionHint}
          onChange={(event) => setSubmissionHint(event.target.value)}
          className="eldonia-input w-full"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isFeatured}
          onChange={(event) => setIsFeatured(event.target.checked)}
        />
        {copy.questFieldFeatured}
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={loading} className="eldonia-btn-primary w-full">
        {loading ? copy.questCreating : copy.questCreateCta}
      </button>
    </form>
  );
}
