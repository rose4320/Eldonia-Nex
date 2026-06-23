"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useContent } from "@/components/providers/locale-provider";

type AddToCartButtonProps = {
  kind: "shop" | "event";
  id: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  buyNow?: boolean;
};

export function AddToCartButton({
  kind,
  id,
  label,
  disabled,
  className = "eldonia-btn-primary w-full",
  buyNow = false,
}: AddToCartButtonProps) {
  const router = useRouter();
  const t = useContent().shop;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const buttonLabel = label ?? t.addToCart;

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", kind, id, quantity: 1 }),
      });
      if (!res.ok) {
        setError(t.addToCartFailed);
        return;
      }
      if (buyNow) {
        const checkout = await fetch("/api/checkout", { method: "POST" });
        const data = (await checkout.json()) as { url?: string; error?: string };
        if (!checkout.ok || !data.url) {
          setError(data.error ?? t.checkoutFailed);
          return;
        }
        window.location.href = data.url;
        return;
      }
      router.push("/shop/cart");
      router.refresh();
    } catch {
      setError(t.addToCartFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        className={className}
        disabled={disabled || loading}
        onClick={handleClick}
      >
        {loading ? t.adding : buttonLabel}
      </button>
      {error && <p className="eldonia-alert-error text-sm">{error}</p>}
    </div>
  );
}
