import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { awardUserExp } from "@/lib/exp/award-exp";

export async function tryDailyLoginExp(
  supabase: SupabaseClient<Database>,
): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  return awardUserExp(supabase, "auth.daily_login", today);
}
