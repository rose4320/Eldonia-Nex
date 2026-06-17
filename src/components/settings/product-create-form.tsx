"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { awardUserExp } from "@/lib/exp/award-exp";
import { createClient } from "@/lib/supabase/client";
import { shopRealmOptions } from "@/lib/i18n/taxonomy";

type ProductCreateFormProps = {
  userId: string;
};

export function ProductCreateForm({ userId }: ProductCreateFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const { forms } = useContent();
  const product = forms.product;
  const realmOptions = shopRealmOptions(locale).filter((r) => r.value !== "all");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("goods");
  const [productType, setProductType] = useState<"physical" | "digital">("physical");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const priceNum = Number.parseInt(price, 10);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setError(product.errPrice);
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
        image_url: imageUrl.trim() || null,
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
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="eldonia-label">{product.title}</label>
        <input id="title" required maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} className="eldonia-input" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="eldonia-label">{product.description}</label>
        <textarea id="description" rows={4} maxLength={4000} value={description} onChange={(e) => setDescription(e.target.value)} className="eldonia-textarea" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="eldonia-label">{product.category}</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="eldonia-input">
            {realmOptions.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="product_type" className="eldonia-label">{product.type}</label>
          <select id="product_type" value={productType} onChange={(e) => setProductType(e.target.value as "physical" | "digital")} className="eldonia-input">
            <option value="physical">{product.typePhysical}</option>
            <option value="digital">{product.typeDigital}</option>
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="price" className="eldonia-label">{product.price}</label>
          <input id="price" type="number" min={0} required value={price} onChange={(e) => setPrice(e.target.value)} className="eldonia-input" />
        </div>
        {productType === "physical" && (
          <div className="flex flex-col gap-1">
            <label htmlFor="stock" className="eldonia-label">{product.stock}</label>
            <input id="stock" type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} className="eldonia-input" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="image_url" className="eldonia-label">{product.imageUrl}</label>
        <input id="image_url" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="eldonia-input" placeholder="https://..." />
      </div>
      {error && <p className="eldonia-alert-error">{error}</p>}
      <button type="submit" disabled={loading} className="eldonia-btn-primary w-fit">
        {loading ? product.submitting : product.submit}
      </button>
    </form>
  );
}
