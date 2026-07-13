"use client";

import { useState } from "react";
import { useContent } from "@/components/providers/locale-provider";
import type { StreamAccessPhase } from "@/lib/events/stream-access";

type EventWatchPanelProps = {
  eventId: string;
  phase: StreamAccessPhase;
  opensAtLabel: string | null;
};

export function EventWatchPanel({ eventId, phase, opensAtLabel }: EventWatchPanelProps) {
  const { pages } = useContent();
  const t = pages.events;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${eventId}/join`, { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? t.watchJoinError);
        return;
      }
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch {
      setError(t.watchJoinError);
    } finally {
      setLoading(false);
    }
  }

  if (phase === "before_window") {
    return (
      <div className="space-y-2 text-center">
        <p className="eldonia-body text-sm">{t.watchNotYet}</p>
        {opensAtLabel && (
          <p className="eldonia-hint text-xs">{t.watchOpensAt(opensAtLabel)}</p>
        )}
      </div>
    );
  }

  if (phase === "ended" || phase === "no_url") {
    return <p className="eldonia-hint text-center text-sm">{t.watchEnded}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={() => void handleJoin()}
        className="eldonia-btn-primary w-full text-center"
      >
        {loading ? t.watchJoining : t.watchJoin}
      </button>
      {error && <p className="eldonia-alert-error text-center text-xs">{error}</p>}
    </div>
  );
}
