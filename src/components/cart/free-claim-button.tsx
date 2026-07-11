"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useContent } from "@/components/providers/locale-provider";

type FreeClaimButtonProps = {
  className?: string;
  direct?: { kind: "shop"; id: string; quantity: number };
};

export function FreeClaimButton({
  className = "eldonia-btn-primary w-full",
  direct,
}: FreeClaimButtonProps) {
  const router = useRouter();
  const t = useContent().shop;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClaim() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(direct ? { direct } : {}),
      });
      const data = (await res.json()) as { redirect?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? t.freeClaimFailed);
        return;
      }
      router.push(data.redirect ?? "/checkout/success?free=1");
      router.refresh();
    } catch {
      setError(t.freeClaimFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        className={className}
        disabled={loading}
        onClick={handleClaim}
      >
        {loading ? t.freeClaimLoading : t.claimFree}
      </button>
      {error && <p className="eldonia-alert-error text-sm">{error}</p>}
    </div>
  );
}
