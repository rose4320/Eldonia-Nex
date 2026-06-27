"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useContent } from "@/components/providers/locale-provider";
import type { Quest, QuestParticipation } from "@/types/database";

type QuestParticipateFormProps = {
  quest: Quest;
  participation: QuestParticipation | null;
  isLoggedIn: boolean;
};

export function QuestParticipateForm({
  quest,
  participation,
  isLoggedIn,
}: QuestParticipateFormProps) {
  const router = useRouter();
  const { pages } = useContent();
  const copy = pages.works;
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionNote, setSubmissionNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expAwarded, setExpAwarded] = useState(participation?.exp_awarded ?? 0);
  const [joined, setJoined] = useState(!!participation);

  if (quest.kind === "daily") {
    return (
      <aside className="eldonia-card space-y-3">
        <h2 className="font-display text-lg text-[var(--eldonia-gold-light)]">
          {copy.questDailyTitle}
        </h2>
        <p className="eldonia-body text-sm">{copy.questDailyLead}</p>
        <p className="text-sm text-[var(--eldonia-gold)]">+{quest.exp_reward} EXP / {copy.questDailyPerDay}</p>
      </aside>
    );
  }

  if (!isLoggedIn) {
    return (
      <aside className="eldonia-card space-y-3">
        <h2 className="font-display text-lg text-[var(--eldonia-gold-light)]">
          {copy.questParticipateTitle}
        </h2>
        <p className="eldonia-body text-sm">{copy.questLoginRequired}</p>
        <a href={`/auth/login?redirect_to=/works/${quest.id}`} className="eldonia-btn-primary inline-flex">
          {copy.questLoginCta}
        </a>
      </aside>
    );
  }

  if (joined) {
    return (
      <aside className="eldonia-card space-y-3">
        <h2 className="font-display text-lg text-[var(--eldonia-gold-light)]">
          {copy.questJoinedTitle}
        </h2>
        <p className="eldonia-body text-sm">{copy.questJoinedLead}</p>
        {expAwarded > 0 && (
          <p className="text-sm text-[var(--eldonia-gold)]">
            {copy.questExpGained}: +{expAwarded} EXP
          </p>
        )}
        <Link href="/works/portfolio" className="eldonia-link text-sm">
          {copy.questViewPortfolio}
        </Link>
      </aside>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch(`/api/quests/${quest.id}/participate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionUrl: submissionUrl.trim() || undefined,
        submissionNote: submissionNote.trim() || undefined,
      }),
    });

    const payload = (await response.json()) as {
      error?: string;
      expAwarded?: number;
    };

    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? copy.questParticipateFailed);
      return;
    }

    setJoined(true);
    setExpAwarded(payload.expAwarded ?? 0);
    router.refresh();
  }

  return (
    <aside className="eldonia-card space-y-4">
      <h2 className="font-display text-lg text-[var(--eldonia-gold-light)]">
        {copy.questParticipateTitle}
      </h2>
      <p className="eldonia-body text-sm">{copy.questParticipateLead}</p>
      {quest.prize_summary && (
        <p className="text-sm text-[var(--eldonia-text-muted)]">
          🎁 {copy.questPrizeLabel}: {quest.prize_summary}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        {quest.submission_hint && (
          <p className="text-xs text-[var(--eldonia-text-dim)]">{quest.submission_hint}</p>
        )}
        <label className="block space-y-1 text-sm">
          <span>{copy.questSubmissionUrl}</span>
          <input
            type="url"
            value={submissionUrl}
            onChange={(event) => setSubmissionUrl(event.target.value)}
            className="eldonia-input w-full"
            placeholder="https://"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>{copy.questSubmissionNote}</span>
          <textarea
            value={submissionNote}
            onChange={(event) => setSubmissionNote(event.target.value)}
            className="eldonia-input min-h-24 w-full"
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="eldonia-btn-primary w-full">
          {loading ? copy.questParticipating : copy.questParticipateCta}
        </button>
      </form>
    </aside>
  );
}
