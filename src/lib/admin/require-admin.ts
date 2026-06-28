import { redirect } from "next/navigation";
import { isQuestAdmin } from "@/lib/quests/is-quest-admin";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export async function requireAdmin(path = "/admin"): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect_to=${encodeURIComponent(path)}`);
  }

  if (!(await isQuestAdmin(user.id))) {
    redirect("/?error=admin_forbidden");
  }

  return user;
}
