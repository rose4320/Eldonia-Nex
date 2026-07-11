"use client";

import { useState } from "react";
import { useContent } from "@/components/providers/locale-provider";
import type { ShippingAddressInput } from "@/lib/cart/shipping";

type CartCheckoutPanelProps = {
  canFreeCheckout: boolean;
  requiresShippingAddress: boolean;
  requiresShippingPayment: boolean;
  hasPaidMerchandise: boolean;
  shippingFee: number;
  initialShipping: ShippingAddressInput | null;
};

export function CartCheckoutPanel({
  canFreeCheckout,
  requiresShippingAddress,
  requiresShippingPayment,
  hasPaidMerchandise,
  shippingFee,
  initialShipping,
}: CartCheckoutPanelProps) {
  const t = useContent().shop;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shipping, setShipping] = useState<ShippingAddressInput>({
    legal_name: initialShipping?.legal_name ?? "",
    country: initialShipping?.country ?? "JP",
    address_line1: initialShipping?.address_line1 ?? "",
    address_line2: initialShipping?.address_line2 ?? "",
    phone: initialShipping?.phone ?? "",
  });

  async function handleFreeClaim() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/free", { method: "POST" });
      const data = (await res.json()) as { redirect?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? t.freeClaimFailed);
        return;
      }
      window.location.href = data.redirect ?? "/checkout/success?free=1";
    } catch {
      setError(t.freeClaimFailed);
    } finally {
      setLoading(false);
    }
  }

  async function handlePaidCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requiresShippingAddress ? { shipping } : {}),
      });
      const data = (await res.json()) as { url?: string; error?: string; code?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? t.checkoutFailed);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(t.checkoutFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 space-y-4">
      {requiresShippingAddress && (
        <fieldset className="space-y-3 border-t border-[var(--eldonia-border)] pt-4">
          <legend className="eldonia-label">{t.shippingHeading}</legend>
          <p className="eldonia-body text-xs text-eldonia-text-muted">{t.shippingLead}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="eldonia-label text-xs">{t.shippingName}</span>
              <input
                required
                value={shipping.legal_name}
                onChange={(e) => setShipping((s) => ({ ...s, legal_name: e.target.value }))}
                className="eldonia-input"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="eldonia-label text-xs">{t.shippingCountry}</span>
              <input
                required
                value={shipping.country}
                onChange={(e) => setShipping((s) => ({ ...s, country: e.target.value }))}
                className="eldonia-input"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="eldonia-label text-xs">{t.shippingPhone}</span>
              <input
                required
                value={shipping.phone}
                onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                className="eldonia-input"
              />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="eldonia-label text-xs">{t.shippingAddress}</span>
              <input
                required
                value={shipping.address_line1}
                onChange={(e) => setShipping((s) => ({ ...s, address_line1: e.target.value }))}
                className="eldonia-input"
              />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="eldonia-label text-xs">{t.shippingAddress2}</span>
              <input
                value={shipping.address_line2 ?? ""}
                onChange={(e) => setShipping((s) => ({ ...s, address_line2: e.target.value }))}
                className="eldonia-input"
              />
            </label>
          </div>
          {shippingFee > 0 && (
            <p className="eldonia-body text-sm">
              {t.shippingFeeLabel}: ¥{shippingFee.toLocaleString("ja-JP")}
            </p>
          )}
        </fieldset>
      )}

      {canFreeCheckout ? (
        <button
          type="button"
          className="eldonia-btn-primary w-full"
          disabled={loading}
          onClick={handleFreeClaim}
        >
          {loading ? t.freeClaimLoading : t.claimFree}
        </button>
      ) : (
        <button
          type="button"
          className="eldonia-btn-primary w-full"
          disabled={loading}
          onClick={handlePaidCheckout}
        >
          {loading
            ? t.checkoutLoading
            : requiresShippingPayment && !hasPaidMerchandise
              ? t.checkoutShippingOnly
              : t.checkoutStripe}
        </button>
      )}

      {error && <p className="eldonia-alert-error text-sm">{error}</p>}
    </div>
  );
}
