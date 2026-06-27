import { createClient } from "@/lib/supabase/server";

export function isQuestAdminFromEnv(userId: string): boolean {
  const ids =
    process.env.QUEST_ADMIN_USER_IDS?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? [];
  return ids.includes(userId);
}

export async function isQuestAdmin(userId: string): Promise<boolean> {
  if (isQuestAdminFromEnv(userId)) return true;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("is_ops_admin")
      .eq("id", userId)
      .maybeSingle();

    return data?.is_ops_admin === true;
  } catch {
    return false;
  }
}
