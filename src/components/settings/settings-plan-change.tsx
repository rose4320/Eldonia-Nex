"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useContent } from "@/components/providers/locale-provider";
import { SKIP_PLAN_PAYMENTS } from "@/lib/plans/constants";
import type { PlanPaymentStatus, UserPlanId } from "@/lib/plans/types";

type SettingsPlanChangeProps = {
  currentPlan: UserPlanId;
  paymentStatus: PlanPaymentStatus;
  plans?: Array<{
    id: UserPlanId;
    name: string;
    price: string;
    lead: string;
    features: string[];
    checkout?: "free" | "stripe" | "contact";
  }>;
};

export function SettingsPlanChange({
  currentPlan,
  paymentStatus,
  plans,
}: SettingsPlanChangeProps) {
  const router = useRouter();
  const { signup, settingsUi } = useContent();
  const copy = settingsUi.plan;
  const planOptions = plans ?? signup.plans;
  const [selectedPlan, setSelectedPlan] = useState<UserPlanId>(currentPlan);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentPlanInfo = useMemo(
    () => planOptions.find((plan) => plan.id === currentPlan) ?? planOptions[0],
    [planOptions, currentPlan],
  );

  async function handleApplyPlan() {
    setError(null);

    if (selectedPlan === currentPlan && paymentStatus !== "pending") {
      router.refresh();
      router.push("/settings/plan");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/settings/plan", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlan }),
      });
      const payload = (await response.json()) as {
        error?: string;
        url?: string;
        ok?: boolean;
      };

      if (!response.ok) {
        setError(payload.error ?? copy.changeFailed);
        setLoading(false);
        return;
      }

      if (payload.url && !SKIP_PLAN_PAYMENTS) {
        window.location.assign(payload.url);
        return;
      }

      router.refresh();
      router.push("/settings/plan");
      setLoading(false);
    } catch {
      setError(copy.changeFailed);
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <p className="eldonia-eyebrow">{copy.eyebrow}</p>
        <h1 className="eldonia-heading eldonia-heading-sm mt-2">{copy.title}</h1>
        <p className="eldonia-body mt-2 text-sm">
          {SKIP_PLAN_PAYMENTS ? copy.testPhaseLead : copy.lead}
        </p>
        <p className="eldonia-hint mt-2 text-xs">
          {copy.currentLabel}: {currentPlanInfo.name} ({currentPlanInfo.price})
          {paymentStatus === "pending" ? ` — ${copy.pendingPayment}` : ""}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {planOptions.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => {
              if (plan.checkout === "contact") {
                window.location.assign("/help/contact");
                return;
              }
              setSelectedPlan(plan.id);
            }}
            className={`eldonia-card text-left transition ${
              selectedPlan === plan.id ? "ring-2 ring-eldonia-gold/60" : ""
            }`}
          >
            <p className="eldonia-eyebrow">{plan.name}</p>
            <p className="mt-2 text-xl font-semibold text-eldonia-gold-light">{plan.price}</p>
            <p className="eldonia-body mt-2 text-sm">{plan.lead}</p>
            <ul className="mt-4 space-y-2 text-sm text-eldonia-text-muted">
              {plan.features.map((feature) => (
                <li key={feature}>- {feature}</li>
              ))}
            </ul>
            {plan.checkout === "contact" ? (
              <p className="mt-3 text-xs text-eldonia-gold">お問い合わせ →</p>
            ) : null}
          </button>
        ))}
      </div>

      {error && <p className="eldonia-alert-error">{error}</p>}

      <button
        type="button"
        disabled={loading}
        onClick={() => void handleApplyPlan()}
        className="eldonia-btn-primary w-fit"
      >
        {loading ? copy.redirectingHome : copy.apply}
      </button>
    </section>
  );
}
