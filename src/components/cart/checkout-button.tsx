"use client";

import { useState } from "react";

export function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "チェックアウトに失敗しました。");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("チェックアウトに失敗しました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        className="eldonia-btn-primary w-full"
        disabled={loading}
        onClick={handleCheckout}
      >
        {loading ? "Stripe へ移動中..." : "Stripe で決済"}
      </button>
      {error && <p className="eldonia-alert-error text-sm">{error}</p>}
    </div>
  );
}
