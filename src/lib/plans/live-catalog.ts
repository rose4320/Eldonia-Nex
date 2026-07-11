import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  PLAN_CATALOG,
  type CatalogPlanId,
  type PlanCatalogEntry,
  normalizePlanId,
} from "@/lib/plans/catalog";

type LivePlanRow = {
  slug: string;
  name: string;
  price_yen: number;
  shop_fee_percent: number | null;
  features: {
    bullets?: string[];
    flags?: Record<string, unknown>;
  } | null;
  is_active: boolean;
  sort_order: number;
};

function formatPrice(yen: number, locale: "ja" | "en"): string {
  const formatted = new Intl.NumberFormat(locale === "ja" ? "ja-JP" : "en-US").format(yen);
  return locale === "ja" ? `¥${formatted} / 月` : `¥${formatted} / mo`;
}

function fallbackEntry(id: CatalogPlanId): PlanCatalogEntry {
  return PLAN_CATALOG.find((p) => p.id === id) ?? PLAN_CATALOG[0];
}

function mergeLiveRow(row: LivePlanRow): PlanCatalogEntry {
  const id = normalizePlanId(row.slug);
  const base = fallbackEntry(id);
  const bullets = Array.isArray(row.features?.bullets)
    ? row.features.bullets.filter((b): b is string => typeof b === "string")
    : null;

  return {
    ...base,
    id,
    name: row.name || base.name,
    priceYen: Number.isFinite(row.price_yen) ? row.price_yen : base.priceYen,
    priceLabelJa: formatPrice(row.price_yen ?? base.priceYen, "ja"),
    priceLabelEn: formatPrice(row.price_yen ?? base.priceYen, "en"),
    featuresJa: bullets && bullets.length > 0 ? bullets : base.featuresJa,
    featuresEn: bullets && bullets.length > 0 ? bullets : base.featuresEn,
    shopFeePercent:
      row.shop_fee_percent === null || row.shop_fee_percent === undefined
        ? base.shopFeePercent
        : Number(row.shop_fee_percent),
    sortOrder: row.sort_order ?? base.sortOrder,
  };
}

/** Live plans from Supabase. Falls back to static PLAN_CATALOG if unavailable. */
export async function getLivePlanCatalog(): Promise<PlanCatalogEntry[]> {
  // Admin で料金変更した直後に LP / 登録画面へ即反映するためキャッシュしない
  noStore();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("slug,name,price_yen,shop_fee_percent,features,is_active,sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) {
      return PLAN_CATALOG;
    }

    const merged = (data as LivePlanRow[]).map(mergeLiveRow);
    // Ensure canonical order / missing slots filled from static catalog
    const byId = new Map(merged.map((p) => [p.id, p]));
    return PLAN_CATALOG.map((staticPlan) => byId.get(staticPlan.id) ?? staticPlan);
  } catch {
    return PLAN_CATALOG;
  }
}

export function toSignupPlans(
  catalog: PlanCatalogEntry[],
  locale: "ja" | "en",
) {
  return catalog.map((plan) => ({
    id: plan.id,
    name: plan.name,
    price: locale === "ja" ? plan.priceLabelJa : plan.priceLabelEn,
    lead: locale === "ja" ? plan.leadJa : plan.leadEn,
    features: locale === "ja" ? plan.featuresJa : plan.featuresEn,
    checkout: plan.checkout,
  }));
}

export function toLpPlans(catalog: PlanCatalogEntry[]) {
  return catalog.map((plan) => ({
    id: plan.id,
    name: plan.name,
    price: plan.priceYen === 0 ? "¥0" : `¥${plan.priceYen.toLocaleString("ja-JP")}`,
    period: plan.priceYen === 0 ? "ずっと無料" : "/ 月",
    featured: plan.id === "premium",
    badge: plan.id === "premium" ? "おすすめ" : undefined,
    features: plan.featuresJa,
    cta:
      plan.checkout === "contact"
        ? "お問い合わせ"
        : plan.id === "free"
          ? "無料で始める"
          : "このプランを選ぶ",
    href: plan.checkout === "contact" ? "/help/contact" : "/auth/signup",
  }));
}
