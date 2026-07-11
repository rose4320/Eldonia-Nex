"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { formatProductPrice } from "@/lib/shop/constants";
import { productHasDownloadFile } from "@/lib/shop/product-download";
import { ProductDownloadLink } from "@/components/shop/product-download-link";
import { shopRealmOptions } from "@/lib/i18n/taxonomy";
import type { ShopProduct } from "@/types/database";

type SettingsShopManagementProps = {
  products: ShopProduct[];
  isCreator: boolean;
};

function DigitalProductFilesEditor({
  product,
  copy,
  disabled,
  onSaved,
}: {
  product: ShopProduct;
  copy: import("@/lib/i18n/content/types").ContentCatalog["settingsUi"]["shopManagement"];
  disabled: boolean;
  onSaved: (productId: string, imageUrl: string | null, downloadUrl: string | null) => void;
}) {
  const [coverImageUrl, setCoverImageUrl] = useState(product.image_url ?? "");
  const [downloadUrl, setDownloadUrl] = useState(product.download_url ?? "");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (disabled) return;
    setPending(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/shop/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: coverImageUrl,
          download_url: downloadUrl,
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        image_url?: string | null;
        download_url?: string | null;
      };

      if (!response.ok) {
        setError(payload.error ?? copy.saveFilesFailed);
        return;
      }

      onSaved(
        product.id,
        (payload.image_url ?? coverImageUrl.trim()) || null,
        (payload.download_url ?? downloadUrl.trim()) || null,
      );
      setMessage(copy.filesSaved);
    } catch {
      setError(copy.saveFilesFailed);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-2 space-y-2 rounded-md border border-eldonia-border bg-black/20 p-3">
      <div className="flex flex-col gap-1">
        <label className="eldonia-label text-xs">{copy.coverImageUrl}</label>
        <input
          type="url"
          value={coverImageUrl}
          disabled={disabled || pending}
          onChange={(event) => setCoverImageUrl(event.target.value)}
          className="eldonia-input text-xs"
          placeholder="https://..."
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="eldonia-label text-xs">{copy.downloadUrl}</label>
        <input
          type="url"
          value={downloadUrl}
          disabled={disabled || pending}
          onChange={(event) => setDownloadUrl(event.target.value)}
          className="eldonia-input text-xs"
          placeholder="https://..."
        />
      </div>
      <button
        type="button"
        disabled={disabled || pending}
        onClick={handleSave}
        className="eldonia-btn-secondary text-xs disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? copy.processing : copy.saveFiles}
      </button>
      {message && <p className="eldonia-hint text-xs text-emerald-400">{message}</p>}
      {error && <p className="eldonia-alert-error text-xs">{error}</p>}
    </div>
  );
}

export function SettingsShopManagement({ products, isCreator }: SettingsShopManagementProps) {
  const router = useRouter();
  const locale = useLocale();
  const { settingsUi } = useContent();
  const copy = settingsUi.shopManagement;
  const [items, setItems] = useState(products);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const realmLabels = Object.fromEntries(
    shopRealmOptions(locale).map((option) => [option.value, option.label]),
  );

  async function setProductActive(product: ShopProduct, isActive: boolean) {
    if (!isCreator) return;

    if (!isActive) {
      const confirmed = window.confirm(copy.deleteConfirm(product.title));
      if (!confirmed) return;
    }

    setError(null);
    setPendingId(product.id);

    try {
      const response = await fetch(
        `/api/shop/products/${product.id}`,
        isActive
          ? {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ is_active: true }),
            }
          : { method: "DELETE" },
      );

      const payload = (await response.json()) as { error?: string; is_active?: boolean };

      if (!response.ok) {
        setError(payload.error ?? copy.deleteFailed);
        setPendingId(null);
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.id === product.id
            ? { ...item, is_active: payload.is_active ?? isActive }
            : item,
        ),
      );
      router.refresh();
    } catch {
      setError(copy.deleteFailed);
    }

    setPendingId(null);
  }

  function handleFilesSaved(
    productId: string,
    imageUrl: string | null,
    downloadUrl: string | null,
  ) {
    setItems((current) =>
      current.map((item) =>
        item.id === productId
          ? { ...item, image_url: imageUrl, download_url: downloadUrl }
          : item,
      ),
    );
    router.refresh();
  }

  return (
    <section id="shop" className="scroll-mt-24 space-y-4">
      <h2 className="eldonia-eyebrow">{copy.heading}</h2>
      <p className="eldonia-body text-sm">{copy.lead}</p>

      {!isCreator && (
        <p className="eldonia-alert-error text-sm">{copy.creatorRequired}</p>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/settings/post/product"
          className={`eldonia-btn-primary text-sm${!isCreator ? " pointer-events-none opacity-50" : ""}`}
          aria-disabled={!isCreator}
        >
          {copy.registerProduct}
        </Link>
        <Link href="/shop" className="eldonia-link text-sm">
          {copy.browseShop}
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="eldonia-card space-y-2">
          <p className="eldonia-body text-sm text-eldonia-text-muted">{copy.empty}</p>
          {isCreator && (
            <Link href="/settings/post/product" className="eldonia-link text-sm">
              {copy.registerLink}
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((product) => {
            const isPending = pendingId === product.id;

            return (
              <li
                key={product.id}
                className="eldonia-card flex flex-col gap-3"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <p className="font-display text-sm font-semibold text-eldonia-gold-light">
                      {product.title}
                    </p>
                    <p className="eldonia-hint text-xs">
                      {realmLabels[product.category] ?? product.category}
                      {" · "}
                      {product.product_type === "digital" ? copy.typeDigital : copy.typePhysical}
                      {" · "}
                      {formatProductPrice(product.price, locale)}
                      {product.product_type === "physical" && product.stock_quantity != null
                        ? ` · ${copy.stock(product.stock_quantity)}`
                        : null}
                    </p>
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs ${
                        product.is_active
                          ? "bg-emerald-950/60 text-emerald-300"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {product.is_active ? copy.activeBadge : copy.inactiveBadge}
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                    {product.product_type === "digital" && productHasDownloadFile(product) && (
                      <ProductDownloadLink
                        productId={product.id}
                        label={copy.downloadProduct}
                      />
                    )}
                    {product.product_type === "digital" && !productHasDownloadFile(product) && (
                      <span className="eldonia-hint text-xs">{copy.downloadUnavailable}</span>
                    )}
                    {product.is_active ? (
                      <Link href={`/shop/${product.id}`} className="eldonia-link shrink-0 text-sm">
                        {copy.viewProduct}
                      </Link>
                    ) : null}
                    {isCreator && (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => setProductActive(product, !product.is_active)}
                        className="eldonia-btn-secondary text-sm disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isPending
                          ? copy.processing
                          : product.is_active
                            ? copy.deleteProduct
                            : copy.republishProduct}
                      </button>
                    )}
                  </div>
                </div>
                {product.product_type === "digital" && isCreator && (
                  <DigitalProductFilesEditor
                    product={product}
                    copy={copy}
                    disabled={!isCreator}
                    onSaved={handleFilesSaved}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className="eldonia-alert-error text-sm">{error}</p>}
    </section>
  );
}
