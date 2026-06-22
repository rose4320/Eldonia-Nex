export type UserPlanId = "free" | "standard" | "pro";

export type PlanPaymentStatus = "not_required" | "pending" | "completed" | "failed";

export function isUserPlanId(value: string): value is UserPlanId {
  return value === "free" || value === "standard" || value === "pro";
}

export function isPaidPlan(planId: UserPlanId): boolean {
  return planId === "standard" || planId === "pro";
}
