import { createClient } from "@/lib/supabase/server";

export type TopUser = {
  userId: string;
  displayName: string;
  username: string | null;
  avatarUrl: string | null;
  expPoints: number;
  titleBadge: string | null;
};

/** EXP の高い順に優秀ユーザーを取得する。取得失敗時は空配列。 */
export async function getTopUsers(limit = 6): Promise<TopUser[]> {
  try {
    const supabase = await createClient();

    const { data: portfolios, error } = await supabase
      .from("portfolios")
      .select("user_id, exp_points, title_badge")
      .order("exp_points", { ascending: false })
      .limit(limit);

    if (error || !portfolios?.length) return [];

    const ids = portfolios.map((row) => row.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url")
      .in("id", ids);

    const profileMap = new Map(
      (profiles ?? []).map((profile) => [profile.id, profile]),
    );

    return portfolios.map((row) => {
      const profile = profileMap.get(row.user_id);
      return {
        userId: row.user_id,
        displayName: profile?.display_name ?? profile?.username ?? "Creator",
        username: profile?.username ?? null,
        avatarUrl: profile?.avatar_url ?? null,
        expPoints: row.exp_points ?? 0,
        titleBadge: row.title_badge ?? null,
      };
    });
  } catch {
    return [];
  }
}
