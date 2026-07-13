import { createAdminClient } from "@/lib/supabase/admin";

/** Ensures auth user has a profiles row (required by event_tickets FK). */
export async function ensureUserProfile(
  userId: string,
  displayName?: string | null,
): Promise<boolean> {
  const admin = createAdminClient();
  if (!admin) return false;

  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existing) return true;

  const { error } = await admin.from("profiles").insert({
    id: userId,
    display_name: displayName?.trim() || "Guest",
  });

  return !error;
}
