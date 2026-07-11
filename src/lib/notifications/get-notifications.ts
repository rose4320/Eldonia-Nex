import { createClient } from "@/lib/supabase/server";
import type { UserNotification } from "@/types/database";

export type CollabNotification = UserNotification & {
  collab_request_id: string | null;
};

export async function getHeaderNotifications(
  userId: string,
): Promise<CollabNotification[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_notifications")
    .select("*")
    .eq("user_id", userId)
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) {
    return [];
  }

  return data as CollabNotification[];
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("user_notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  return count ?? 0;
}

/** Latest undismissed critical announcement for modal display. */
export async function getCriticalAnnouncement(
  userId: string,
): Promise<UserNotification | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_notifications")
    .select("*")
    .eq("user_id", userId)
    .eq("kind", "announcement")
    .eq("priority", "critical")
    .is("dismissed_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as UserNotification;
}
