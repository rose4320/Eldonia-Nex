import { createClient } from "@/lib/supabase/server";
import type { CollabLab, CollabLabPostWithAuthor } from "@/types/database";

export type CollabLabData = {
  lab: CollabLab;
  members: Array<{
    user_id: string;
    role: string;
    profiles: { display_name: string | null; username: string | null } | null;
  }>;
  posts: CollabLabPostWithAuthor[];
};

export async function getCollabLabForArtwork(
  artworkId: string,
  userId: string,
): Promise<CollabLabData | null> {
  const supabase = await createClient();

  const { data: memberships } = await supabase
    .from("collab_lab_members")
    .select("lab_id")
    .eq("user_id", userId);

  const labIds = memberships?.map((row) => row.lab_id) ?? [];
  if (labIds.length === 0) {
    return null;
  }

  const { data: lab } = await supabase
    .from("collab_labs")
    .select("*")
    .eq("artwork_id", artworkId)
    .in("id", labIds)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!lab) {
    return null;
  }

  const [membersRes, postsRes] = await Promise.all([
    supabase
      .from("collab_lab_members")
      .select(
        `
        user_id,
        role,
        profiles:user_id (display_name, username)
      `,
      )
      .eq("lab_id", lab.id),
    supabase
      .from("collab_lab_posts")
      .select(
        `
        *,
        profiles:author_id (display_name, username, avatar_url)
      `,
      )
      .eq("lab_id", lab.id)
      .order("created_at", { ascending: true }),
  ]);

  return {
    lab: lab as CollabLab,
    members: (membersRes.data ?? []) as CollabLabData["members"],
    posts: (postsRes.data ?? []) as CollabLabPostWithAuthor[],
  };
}
