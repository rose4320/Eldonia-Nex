/** Shared plan catalog — keep in sync with backend/users/plan_catalog.py and LP_PLANS. */

export const USER_PLAN_IDS = ["free", "standard", "premium", "business"] as const;

export type CatalogPlanId = (typeof USER_PLAN_IDS)[number];

export type PlanCatalogEntry = {
  id: CatalogPlanId;
  name: string;
  priceYen: number;
  priceLabelJa: string;
  priceLabelEn: string;
  leadJa: string;
  leadEn: string;
  featuresJa: string[];
  featuresEn: string[];
  shopFeePercent: number | null;
  /** Self-serve checkout vs contact sales */
  checkout: "free" | "stripe" | "contact";
  sortOrder: number;
};

export const PLAN_CATALOG: PlanCatalogEntry[] = [
  {
    id: "free",
    name: "Free",
    priceYen: 0,
    priceLabelJa: "¥0 / 月",
    priceLabelEn: "¥0 / mo",
    leadJa: "まずは無料で、作品公開と交流を試せます",
    leadEn: "Start free — try publishing and community",
    featuresJa: ["作品の公開（3点まで）", "コミュニティ参加", "基本プロフィール"],
    featuresEn: ["Publish up to 3 works", "Community access", "Basic profile"],
    shopFeePercent: null,
    checkout: "free",
    sortOrder: 1,
  },
  {
    id: "standard",
    name: "Standard",
    priceYen: 800,
    priceLabelJa: "¥800 / 月",
    priceLabelEn: "¥800 / mo",
    leadJa: "公開・販売・イベントを本格的に始める標準プラン",
    leadEn: "Publish, sell, and host events",
    featuresJa: [
      "作品の無制限公開",
      "ショップ機能（手数料5%）",
      "イベント参加・主催",
      "カスタムプロフィール",
    ],
    featuresEn: [
      "Unlimited publishing",
      "Shop (5% fee)",
      "Join & host events",
      "Custom profile",
    ],
    shopFeePercent: 5,
    checkout: "stripe",
    sortOrder: 2,
  },
  {
    id: "premium",
    name: "Premium",
    priceYen: 2980,
    priceLabelJa: "¥2,980 / 月",
    priceLabelEn: "¥2,980 / mo",
    leadJa: "仕事・分析・優先サポートまで含むおすすめプラン",
    leadEn: "Works, analytics, and priority support",
    featuresJa: [
      "Standard のすべて",
      "ショップ手数料 3%",
      "仕事の依頼・応募",
      "高度な分析・レポート",
      "優先サポート",
    ],
    featuresEn: [
      "Everything in Standard",
      "Shop fee 3%",
      "Job requests & applications",
      "Advanced analytics",
      "Priority support",
    ],
    shopFeePercent: 3,
    checkout: "stripe",
    sortOrder: 3,
  },
  {
    id: "business",
    name: "Business",
    priceYen: 10000,
    priceLabelJa: "¥10,000 / 月",
    priceLabelEn: "¥10,000 / mo",
    leadJa: "法人・チーム向け。導入はお問い合わせください",
    leadEn: "For teams & orgs — contact us to get started",
    featuresJa: ["法人向け機能", "チーム管理・権限設定", "専用サポート・SLA"],
    featuresEn: ["Business features", "Team roles & permissions", "Dedicated support / SLA"],
    shopFeePercent: 3,
    checkout: "contact",
    sortOrder: 4,
  },
];

/** Legacy slug still present in older rows / Stripe metadata */
export function normalizePlanId(value: string | null | undefined): CatalogPlanId {
  const raw = (value ?? "free").trim().toLowerCase();
  if (raw === "pro") return "premium";
  if (raw === "free" || raw === "standard" || raw === "premium" || raw === "business") {
    return raw;
  }
  return "free";
}

export function getPlanCatalogEntry(id: string): PlanCatalogEntry {
  const normalized = normalizePlanId(id);
  return PLAN_CATALOG.find((p) => p.id === normalized) ?? PLAN_CATALOG[0];
}
