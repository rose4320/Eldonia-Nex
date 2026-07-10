import {
  normalizePlanId,
  USER_PLAN_IDS,
  type CatalogPlanId,
} from "@/lib/plans/catalog";

export type UserPlanId = CatalogPlanId;

export type PlanPaymentStatus = "not_required" | "pending" | "completed" | "failed";

export function isUserPlanId(value: string): value is UserPlanId {
  return (USER_PLAN_IDS as readonly string[]).includes(value) || value === "pro";
}

/** Accept legacy `pro` and normalize to canonical ids. */
export function parseUserPlanId(value: string): UserPlanId | null {
  if (!isUserPlanId(value) && value !== "pro") return null;
  return normalizePlanId(value);
}

export function isPaidPlan(planId: UserPlanId): boolean {
  return planId === "standard" || planId === "premium" || planId === "business";
}

export function isSelfServePaidPlan(
  planId: UserPlanId,
): planId is "standard" | "premium" {
  return planId === "standard" || planId === "premium";
}
