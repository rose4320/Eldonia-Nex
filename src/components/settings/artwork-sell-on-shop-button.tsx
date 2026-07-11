"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useContent } from "@/components/providers/locale-provider";
import type { SettingsUiContent } from "@/lib/i18n/content/settings-ui-messages";

type ArtworkSellOnShopButtonProps = {
  artworkId: string;
  shopProductId: string | null;
  onListed: (productId: string) => void;
};

function sellProductHref(artworkId: string) {
  return `/settings/post/product?from_artwork=${encodeURIComponent(artworkId)}`;
}

export function ArtworkSellOnShopButton({
  artworkId,
  shopProductId,
  onListed,
}: ArtworkSellOnShopButtonProps) {
  const router = useRouter();
  const { settingsUi } = useContent();
  const copy = settingsUi.artworkManagement;
  const [open, setOpen] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState("0");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (shopProductId) {
    return (
      <Link href={`/shop/${shopProductId}`} className="eldonia-btn-primary text-sm">
        {copy.viewOnShop}
      </Link>
    );
  }

  async function handleList() {
    setError(null);
    setPending(true);

    const numericPrice = isFree ? 0 : Number(price);
    if (!isFree && (!Number.isFinite(numericPrice) || numericPrice < 0)) {
      setError(copy.sellPriceInvalid);
      setPending(false);
      return;
    }

    try {
      const response = await fetch("/api/shop/products/from-artwork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artworkId,
          isFree,
          price: numericPrice,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        productId?: string;
        redirect?: string;
      };

      if (!response.ok) {
        setError(payload.error ?? copy.sellFailed);
        setPending(false);
        return;
      }

      if (payload.productId) {
        onListed(payload.productId);
      }

      setOpen(false);

      if (payload.redirect) {
        router.push(payload.redirect);
      }
    } catch {
      setError(copy.sellFailed);
    }

    setPending(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="eldonia-btn-primary text-sm"
        aria-expanded={open}
      >
        {copy.sellOnShop}
      </button>

      {open && (
        <div className="w-full basis-full pt-3">
          <SellPanel
            copy={copy}
            isFree={isFree}
            price={price}
            pending={pending}
            error={error}
            artworkId={artworkId}
            onFreeChange={setIsFree}
            onPriceChange={setPrice}
            onCancel={() => setOpen(false)}
            onSubmit={handleList}
          />
        </div>
      )}
    </>
  );
}

function SellPanel({
  copy,
  isFree,
  price,
  pending,
  error,
  artworkId,
  onFreeChange,
  onPriceChange,
  onCancel,
  onSubmit,
}: {
  copy: SettingsUiContent["artworkManagement"];
  isFree: boolean;
  price: string;
  pending: boolean;
  error: string | null;
  artworkId: string;
  onFreeChange: (value: boolean) => void;
  onPriceChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="rounded-md border border-eldonia-border bg-eldonia-surface/80 p-4">
      <p className="text-xs text-eldonia-text-muted">{copy.sellPanelLead}</p>

      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isFree}
          onChange={(event) => onFreeChange(event.target.checked)}
          disabled={pending}
        />
        {copy.sellFreeLabel}
      </label>

      {!isFree && (
        <label className="mt-3 block text-sm">
          <span className="text-eldonia-text-muted">{copy.sellPriceLabel}</span>
          <input
            type="number"
            min={0}
            step={1}
            value={price}
            onChange={(event) => onPriceChange(event.target.value)}
            disabled={pending}
            className="eldonia-input mt-1 w-full"
          />
        </label>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={pending}
          className="eldonia-btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? copy.processing : copy.sellSubmit}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="eldonia-btn-secondary text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {copy.sellCancel}
        </button>
      </div>

      <Link
        href={sellProductHref(artworkId)}
        className="eldonia-link mt-3 inline-block text-xs"
      >
        {copy.sellEditDetails}
      </Link>

      {error && <p className="eldonia-alert-error mt-2 text-xs">{error}</p>}
    </div>
  );
}
