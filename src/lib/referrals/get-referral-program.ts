import crypto from "node:crypto";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
import type { UserReferralCode } from "@/types/database";

export type ReferralProgramData = {
  eligible: boolean;
  reason: string | null;
  code: UserReferralCode | null;
  qrSvg: string | null;
};

type DjangoReferralStatus = {
  eligible?: boolean;
  reason?: string;
  referral_code?: string | null;
  subscription_plan?: string;
};

const MAX_REFERRAL_CODE_ATTEMPTS = 8;

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function generateReferralCode(userId: string, email?: string | null, attempt = 0): string {
  const digest = crypto
    .createHash("sha256")
    .update(`${userId}:${email ?? ""}:eldonia-referral:${attempt}`)
    .digest("hex")
    .toUpperCase();
  return `ENX-${digest.slice(0, 8)}`;
}

async function qrSvgFor(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    margin: 1,
    width: 192,
    color: {
      dark: "#0b0b0b",
      light: "#f6e6a8",
    },
  });
}

async function getDjangoReferralStatus(
  email?: string | null,
  username?: string | null,
): Promise<DjangoReferralStatus | null> {
  if (!email && !username) return null;
  const baseUrl =
    process.env.DJANGO_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://127.0.0.1:8000/api/v1";
  const params = new URLSearchParams();
  if (email) params.set("email", email);
  if (username) params.set("username", username);
  const url = `${baseUrl.replace(/\/$/, "")}/referrals/status/?${params.toString()}`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: process.env.INTERNAL_API_TOKEN
        ? { "x-internal-api-token": process.env.INTERNAL_API_TOKEN }
        : undefined,
    });
    if (!response.ok) return null;
    return (await response.json()) as DjangoReferralStatus;
  } catch {
    return null;
  }
}

async function upsertReferralCode(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  referralCode: string,
): Promise<UserReferralCode | null> {
  const referralUrl = `${siteUrl()}/auth/signup?ref=${encodeURIComponent(referralCode)}`;
  const { data, error } = await supabase
    .from("user_referral_codes")
    .upsert(
      {
        user_id: userId,
        referral_code: referralCode,
        referral_url: referralUrl,
        status: "active",
      },
      { onConflict: "user_id" },
    )
    .select("*")
    .single();

  if (error) return null;
  return data as UserReferralCode | null;
}

async function createUniqueReferralCode(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  email?: string | null,
): Promise<UserReferralCode | null> {
  for (let attempt = 0; attempt < MAX_REFERRAL_CODE_ATTEMPTS; attempt += 1) {
    const referralCode = generateReferralCode(userId, email, attempt);
    const { data: duplicate } = await supabase
      .from("user_referral_codes")
      .select("user_id")
      .eq("referral_code", referralCode)
      .neq("user_id", userId)
      .maybeSingle();

    if (duplicate) continue;

    const created = await upsertReferralCode(supabase, userId, referralCode);
    if (created) return created;
  }
  return null;
}

export async function getReferralProgramData(
  userId: string,
  email?: string | null,
  username?: string | null,
): Promise<ReferralProgramData> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("user_referral_codes")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    return {
      eligible: true,
      reason: null,
      code: existing as UserReferralCode,
      qrSvg: await qrSvgFor(existing.referral_url),
    };
  }

  const { data: onboarding } = await supabase
    .from("user_onboarding")
    .select("selected_plan")
    .eq("user_id", userId)
    .maybeSingle();

  const djangoReferral = await getDjangoReferralStatus(email, username);
  const djangoEligible = djangoReferral?.eligible && djangoReferral.referral_code;
  const plan = djangoReferral?.subscription_plan ?? onboarding?.selected_plan ?? "free";
  const eligible = Boolean(djangoEligible) || plan.trim().toLowerCase() !== "free";

  if (!eligible) {
    return {
      eligible: false,
      reason:
        djangoReferral?.reason ??
        "紹介コードはサブスクプランが Free 以外の会員に付与されます。",
      code: null,
      qrSvg: null,
    };
  }

  const code = djangoReferral?.referral_code
    ? (await upsertReferralCode(supabase, userId, djangoReferral.referral_code)) ??
      ({
        user_id: userId,
        referral_code: djangoReferral.referral_code,
        referral_url: `${siteUrl()}/auth/signup?ref=${encodeURIComponent(djangoReferral.referral_code)}`,
        status: "active",
        created_at: "",
        updated_at: "",
      } satisfies UserReferralCode)
    : await createUniqueReferralCode(supabase, userId, email);

  if (!code) {
    return {
      eligible: false,
      reason: "紹介コードの発行に失敗しました。時間を置いて再度お試しください。",
      code: null,
      qrSvg: null,
    };
  }

  return {
    eligible: true,
    reason: null,
    code: code as UserReferralCode,
    qrSvg: await qrSvgFor(code.referral_url),
  };
}
