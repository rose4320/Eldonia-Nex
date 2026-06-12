"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AddToCartButtonProps = {
  kind: "shop" | "event";
  id: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  /** 追加後に Stripe チェックアウトへ進む */
  buyNow?: boolean;
};

export function AddToCartButton({
  kind,
  id,
  label = "カートに加える",
  disabled,
  className = "eldonia-btn-primary w-full",
  buyNow = false,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", kind, id, quantity: 1 }),
      });
      if (!res.ok) throw new Error("failed");
      if (buyNow) {
        const checkout = await fetch("/api/checkout", { method: "POST" });
        const data = (await checkout.json()) as { url?: string; error?: string };
        if (!checkout.ok || !data.url) {
          alert(data.error ?? "チェックアウトに失敗しました。");
          return;
        }
        window.location.href = data.url;
        return;
      }
      router.push("/shop/cart");
      router.refresh();
    } catch {
      alert("カートへの追加に失敗しました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className={className}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? "追加中..." : label}
    </button>
  );
}
