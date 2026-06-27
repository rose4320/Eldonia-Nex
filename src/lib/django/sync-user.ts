import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type DjangoSyncInput = {
  supabaseUserId: string;
  email: string;
  username?: string | null;
  displayName?: string | null;
  phone?: string | null;
  subscriptionPlan?: string | null;
  referralCodeUsed?: string | null;
  isEmailVerified?: boolean;
};

export type DjangoSyncResult = {
  ok: boolean;
  created?: boolean;
  djangoUserId?: number;
  username?: string;
};

function djangoApiBaseUrl(): string {
  return (
    process.env.DJANGO_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://127.0.0.1:8000/api/v1"
  ).replace(/\/$/, "");
}

export async function syncDjangoUser(input: DjangoSyncInput): Promise<DjangoSyncResult> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (process.env.INTERNAL_API_TOKEN) {
    headers["x-internal-api-token"] = process.env.INTERNAL_API_TOKEN;
  }

  try {
    const response = await fetch(`${djangoApiBaseUrl()}/users/sync/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        supabase_user_id: input.supabaseUserId,
        email: input.email,
        username: input.username ?? null,
        display_name: input.displayName ?? null,
        phone: input.phone ?? null,
        subscription_plan: input.subscriptionPlan ?? "free",
        referral_code_used: input.referralCodeUsed ?? null,
        is_email_verified: input.isEmailVerified ?? false,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return { ok: false };
    }

    const payload = (await response.json()) as DjangoSyncResult & { ok?: boolean };
    return {
      ok: Boolean(payload.ok),
      created: payload.created,
      djangoUserId: payload.djangoUserId ?? (payload as { django_user_id?: number }).django_user_id,
      username: payload.username,
    };
  } catch {
    return { ok: false };
  }
}

export async function syncDjangoUserFromSupabase(
  user: User,
  extras?: Partial<DjangoSyncInput>,
): Promise<DjangoSyncResult> {
  if (!user.email) {
    return { ok: false };
  }

  const supabase = await createClient();
  const [{ data: profile }, { data: settings }, { data: onboarding }] = await Promise.all([
    supabase.from("profiles").select("username, display_name").eq("id", user.id).maybeSingle(),
    supabase.from("user_settings").select("phone").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("user_onboarding")
      .select("selected_plan")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  const metadata = user.user_metadata ?? {};
  const referralFromMetadata =
    typeof metadata.referral_code === "string" ? metadata.referral_code : null;

  return syncDjangoUser({
    supabaseUserId: user.id,
    email: user.email,
    username: profile?.username ?? (metadata.username as string | undefined) ?? null,
    displayName:
      profile?.display_name ?? (metadata.display_name as string | undefined) ?? null,
    phone: settings?.phone ?? null,
    subscriptionPlan:
      extras?.subscriptionPlan ??
      onboarding?.selected_plan ??
      (metadata.subscription_plan as string | undefined) ??
      "free",
    referralCodeUsed: extras?.referralCodeUsed ?? referralFromMetadata,
    isEmailVerified: Boolean(user.email_confirmed_at),
    ...extras,
  });
}
