import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type ExpActionType =
  | "user.signup"
  | "profile.basics"
  | "artwork.upload"
  | "product.create"
  | "event.create"
  | "job.create"
  | "job.apply"
  | "auth.daily_login"
  | "quest.participate"
  | "community.thread"
  | "community.reply"
  | "comment.create"
  | "like.create"
  | "fan.create"
  | "collab.request"
  | "lab.post";

export async function awardUserExp(
  supabase: SupabaseClient<Database>,
  actionType: ExpActionType,
  referenceKey: string,
): Promise<number> {
  const { data, error } = await supabase.rpc("award_user_exp", {
    p_action_type: actionType,
    p_reference_key: referenceKey,
  });

  if (error) return 0;
  return typeof data === "number" ? data : 0;
}
