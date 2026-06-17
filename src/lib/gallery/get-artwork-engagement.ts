import { createClient } from "@/lib/supabase/server";
import type {
  ArtworkCommentWithAuthor,
  ArtworkEngagementState,
} from "@/types/database";

export async function getArtworkComments(
  artworkId: string,
): Promise<ArtworkCommentWithAuthor[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artwork_comments")
    .select(
      `
      *,
      profiles:author_id (
        display_name,
        username,
        avatar_url
      )
    `,
    )
    .eq("artwork_id", artworkId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as ArtworkCommentWithAuthor[];
}

export async function getArtworkEngagement(
  artworkId: string,
  creatorId: string,
  userId: string | null,
): Promise<ArtworkEngagementState> {
  const supabase = await createClient();

  const likeCountPromise = supabase
    .from("artwork_likes")
    .select("*", { count: "exact", head: true })
    .eq("artwork_id", artworkId);

  const fanCountPromise = supabase
    .from("creator_fans")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", creatorId);

  if (!userId) {
    const [likeCountRes, fanCountRes] = await Promise.all([
      likeCountPromise,
      fanCountPromise,
    ]);
    return {
      fanCount: fanCountRes.count ?? 0,
      isFan: false,
      collabRequest: null,
      likeCount: likeCountRes.count ?? 0,
      isLiked: false,
    };
  }

  const [likeCountRes, fanCountRes, likeRes, fanRes, collabRes] = await Promise.all([
    likeCountPromise,
    fanCountPromise,
    supabase
      .from("artwork_likes")
      .select("user_id")
      .eq("artwork_id", artworkId)
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("creator_fans")
      .select("fan_id")
      .eq("creator_id", creatorId)
      .eq("fan_id", userId)
      .maybeSingle(),
    userId === creatorId
      ? Promise.resolve({ data: null })
      : supabase
          .from("collab_requests")
          .select("id, status, message")
          .eq("artwork_id", artworkId)
          .eq("requester_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
  ]);

  const collab = collabRes.data as ArtworkEngagementState["collabRequest"];

  return {
    fanCount: fanCountRes.count ?? 0,
    isFan: Boolean(fanRes.data),
    collabRequest: collab,
    likeCount: likeCountRes.count ?? 0,
    isLiked: Boolean(likeRes.data),
  };
}
