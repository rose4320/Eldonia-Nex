"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { awardUserExp } from "@/lib/exp/award-exp";
import { normalizeDigitalProductUrls } from "@/lib/shop/product-download";
import { createClient } from "@/lib/supabase/client";
import { shopRealmOptions } from "@/lib/i18n/taxonomy";

type ProductCreateInitialValues = {
  title?: string;
  description?: string;
  category?: string;
  productType?: "physical" | "digital";
  imageUrl?: string;
  downloadUrl?: string;
};

type ProductCreateFormProps = {
  userId: string;
  disabled?: boolean;
  initialValues?: ProductCreateInitialValues;
};

export function ProductCreateForm({
  userId,
  disabled = false,
  initialValues,
}: ProductCreateFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const { forms } = useContent();
  const product = forms.product;
  const realmOptions = shopRealmOptions(locale).filter((r) => r.value !== "all");
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "goods");
  const [productType, setProductType] = useState<"physical" | "digital">(
    initialValues?.productType ?? "physical",
  );
  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [stock, setStock] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState(initialValues?.imageUrl ?? "");
  const [downloadUrl, setDownloadUrl] = useState(initialValues?.downloadUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled) return;
    setError(null);
    setLoading(true);

    const priceNum = Number.parseInt(price, 10);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setError(product.errPrice);
      setLoading(false);
      return;
    }

    const normalized =
      productType === "digital"
        ? normalizeDigitalProductUrls({
            imageUrl: coverImageUrl,
            downloadUrl,
          })
        : { image_url: coverImageUrl.trim() || null, download_url: null };

    if (productType === "digital" && !normalized.download_url) {
      setError(product.errDownloadUrl);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("shop_products")
      .insert({
        seller_id: userId,
        title: title.trim(),
        description: description.trim() || null,
        category,
        product_type: productType,
        price: priceNum,
        stock_quantity: productType === "physical" ? Number.parseInt(stock, 10) || 0 : null,
        image_url: normalized.image_url,
        download_url: normalized.download_url,
        is_active: true,
      })
      .select("id")
      .single();

    if (insertError || !data) {
      setError(insertError?.message ?? product.errSave);
      setLoading(false);
      return;
    }

    await awardUserExp(supabase, "product.create", data.id);
    router.push(`/shop/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4" aria-disabled={disabled}>
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="eldonia-label">{product.title}</label>
        <input id="title" required maxLength={120} disabled={disabled} value={title} onChange={(e) => setTitle(e.target.value)} className="eldonia-input" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="eldonia-label">{product.description}</label>
        <textarea id="description" required rows={4} maxLength={4000} disabled={disabled} value={description} onChange={(e) => setDescription(e.target.value)} className="eldonia-textarea" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="eldonia-label">{product.category}</label>
          <select id="category" disabled={disabled} value={category} onChange={(e) => setCategory(e.target.value)} className="eldonia-input">
            {realmOptions.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="product_type" className="eldonia-label">{product.type}</label>
          <select id="product_type" disabled={disabled} value={productType} onChange={(e) => setProductType(e.target.value as "physical" | "digital")} className="eldonia-input">
            <option value="physical">{product.typePhysical}</option>
            <option value="digital">{product.typeDigital}</option>
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="price" className="eldonia-label">{product.price}</label>
          <input
            id="price"
            type="number"
            min={0}
            required
            disabled={disabled || isFree}
            value={isFree ? "0" : price}
            onChange={(e) => setPrice(e.target.value)}
            className="eldonia-input"
          />
        </div>
        {productType === "physical" && (
          <div className="flex flex-col gap-1">
            <label htmlFor="stock" className="eldonia-label">{product.stock}</label>
            <input id="stock" type="number" min={0} disabled={disabled} value={stock} onChange={(e) => setStock(e.target.value)} className="eldonia-input" />
          </div>
        )}
      </div>
      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          checked={isFree}
          disabled={disabled}
          onChange={(event) => {
            const checked = event.target.checked;
            setIsFree(checked);
            if (checked) {
              setPrice("0");
            } else if (price === "0") {
              setPrice("");
            }
          }}
        />
        <span>
          <span className="font-medium text-eldonia-gold-light">{product.freeDistribution}</span>
          <span className="eldonia-body mt-1 block text-xs text-eldonia-text-muted">
            {product.freeDistributionHint}
          </span>
        </span>
      </label>
      {productType === "digital" ? (
        <>
          <div className="flex flex-col gap-1">
            <label htmlFor="cover_image_url" className="eldonia-label">{product.coverImageUrl}</label>
            <input
              id="cover_image_url"
              type="url"
              disabled={disabled}
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="eldonia-input"
              placeholder="https://..."
            />
            <p className="eldonia-hint text-xs">{product.coverImageHint}</p>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="download_url" className="eldonia-label">{product.downloadUrl}</label>
            <input
              id="download_url"
              type="url"
              required
              disabled={disabled}
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              className="eldonia-input"
              placeholder="https://..."
            />
            <p className="eldonia-hint text-xs">{product.downloadUrlHint}</p>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-1">
          <label htmlFor="image_url" className="eldonia-label">{product.imageUrl}</label>
          <input id="image_url" type="url" disabled={disabled} value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} className="eldonia-input" placeholder="https://..." />
        </div>
      )}
      {error && <p className="eldonia-alert-error">{error}</p>}
      <button type="submit" disabled={disabled || loading} className="eldonia-btn-primary w-fit">
        {loading ? product.submitting : product.submit}
      </button>
    </form>
  );
}
