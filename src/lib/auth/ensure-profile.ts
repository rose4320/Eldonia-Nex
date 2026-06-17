import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";
import type { User } from "@supabase/supabase-js";

function buildFallbackProfile(user: User): Profile {
  const now = new Date().toISOString();
  return {
    id: user.id,
    username: null,
    display_name:
      (user.user_metadata?.display_name as string | undefined) ??
      user.email?.split("@")[0] ??
      "ユーザー",
    avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    bio: null,
    locale: "ja",
    is_creator: false,
    created_at: now,
    updated_at: now,
  };
}

/** 管理 API 等で作成されたユーザー向けに profiles 行を保証する（失敗時はメモリ上のフォールバック） */
export async function ensureProfile(user: User): Promise<Profile> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) {
    return existing as Profile;
  }

  const displayName =
    (user.user_metadata?.display_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "ユーザー";

  const { data: created } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      display_name: displayName,
    })
    .select("*")
    .single();

  if (created) {
    return created as Profile;
  }

  // 競合や RLS エラー時は再取得
  const { data: retry } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (retry) {
    return retry as Profile;
  }

  return buildFallbackProfile(user);
}
