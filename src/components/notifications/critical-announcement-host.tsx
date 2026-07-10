import { createClient } from "@/lib/supabase/server";
import { getCriticalAnnouncement } from "@/lib/notifications/get-notifications";
import { CriticalAnnouncementModal } from "@/components/notifications/critical-announcement-modal";

/** Server wrapper: loads undismissed critical announcement for logged-in users. */
export async function CriticalAnnouncementHost() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const announcement = await getCriticalAnnouncement(user.id);
  return <CriticalAnnouncementModal initial={announcement} userId={user.id} />;
}
