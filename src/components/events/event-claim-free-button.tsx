"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContent } from "@/components/providers/locale-provider";

type EventClaimFreeButtonProps = {
  eventId: string;
  disabled?: boolean;
};

export function EventClaimFreeButton({ eventId, disabled }: EventClaimFreeButtonProps) {
  const router = useRouter();
  const { pages } = useContent();
  const t = pages.events;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClaim() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${eventId}/claim-free`, { method: "POST" });
      const data = (await res.json()) as { redirect?: string; error?: string; alreadyOwned?: boolean };
      if (!res.ok) {
        const message =
          data.error === "sold_out"
            ? t.soldOutFull
            : data.error === "login_required"
              ? t.ticketLogin
              : data.error === "not_found" || data.error === "event_not_found"
                ? t.ticketEventNotFound
                : data.error === "admin_unavailable"
                  ? t.ticketIssueUnavailable
                  : t.watchJoinError;
        setError(message);
        return;
      }
      router.push(data.redirect ?? `/events/${eventId}/watch`);
      router.refresh();
    } catch {
      setError(t.watchJoinError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => void handleClaim()}
        className="eldonia-btn-primary w-full text-center"
      >
        {loading ? t.ticketFreeClaiming : t.ticketFreeClaim}
      </button>
      {error && <p className="eldonia-alert-error text-center text-xs">{error}</p>}
    </div>
  );
}
