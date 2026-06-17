import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const REQUIRED_CONSENT_TYPES = [
  "terms_of_service",
  "privacy_policy",
  "subscription_terms",
  "creator_guidelines",
  "commerce_terms",
] as const;

type PlanId = "free" | "standard" | "pro";

type ConsentPayload = {
  type?: string;
  title?: string;
  version?: string;
};

function isPlanId(value: unknown): value is PlanId {
  return value === "free" || value === "standard" || value === "pro";
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    planId?: unknown;
    paymentStatus?: unknown;
    consents?: ConsentPayload[];
  };

  if (!isPlanId(body.planId)) {
    return NextResponse.json({ error: "プラン選択が不正です。" }, { status: 400 });
  }

  if (!Array.isArray(body.consents)) {
    return NextResponse.json({ error: "規約承認データが不足しています。" }, { status: 400 });
  }

  const consentMap = new Map(body.consents.map((item) => [item.type, item]));
  const missingTypes = REQUIRED_CONSENT_TYPES.filter((type) => !consentMap.has(type));
  if (missingTypes.length > 0) {
    return NextResponse.json(
      { error: "すべての規約項目を承認してください。" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const consentRows = REQUIRED_CONSENT_TYPES.map((type) => {
    const item = consentMap.get(type);
    return {
      user_id: user.id,
      consent_type: type,
      document_title: item?.title ?? type,
      document_version: item?.version ?? "unknown",
      agreed_at: new Date().toISOString(),
    };
  });

  const { error: consentError } = await supabase.from("user_consents").upsert(
    consentRows,
    { onConflict: "user_id,consent_type,document_version" },
  );

  if (consentError) {
    return NextResponse.json({ error: consentError.message }, { status: 400 });
  }

  const { error: onboardingError } = await supabase.from("user_onboarding").upsert(
    {
      user_id: user.id,
      selected_plan: body.planId,
      payment_status:
        body.planId === "free"
          ? "not_required"
          : body.paymentStatus === "completed"
            ? "completed"
            : "pending",
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (onboardingError) {
    return NextResponse.json({ error: onboardingError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
