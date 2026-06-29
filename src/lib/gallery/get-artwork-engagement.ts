import { createClient } from "@/lib/supabase/server";
import type {
  ArtworkCommentWithAuthor,
  ArtworkEngagementState,
  PendingCollabRequest,
} from "@/types/database";

const EMPTY_ENGAGEMENT: Omit<ArtworkEngagementState, "fanCount" | "likeCount"> = {
  isFan: false,
  collabRequest: null,
  isLiked: false,
  labAvailable: false,
  pendingCollabRequests: [],
};

async function artworkHasLabForUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
  artworkId: string,
  userId: string,
): Promise<boolean> {
  const { data: memberships } = await supabase
    .from("collab_lab_members")
    .select("lab_id")
    .eq("user_id", userId);

  const labIds = memberships?.map((row) => row.lab_id) ?? [];
  if (labIds.length === 0) {
    return false;
  }

  const { data: lab } = await supabase
    .from("collab_labs")
    .select("id")
    .eq("artwork_id", artworkId)
    .in("id", labIds)
    .limit(1)
    .maybeSingle();

  return Boolean(lab);
}

async function getPendingCollabRequests(
  supabase: Awaited<ReturnType<typeof createClient>>,
  artworkId: string,
  creatorId: string,
): Promise<PendingCollabRequest[]> {
  const { data } = await supabase
    .from("collab_requests")
    .select(
      `
      id,
      message,
      created_at,
      profiles:requester_id (display_name, username)
    `,
    )
    .eq("artwork_id", artworkId)
    .eq("creator_id", creatorId)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (!data) {
    return [];
  }

  type PendingRow = {
    id: string;
    message: string | null;
    created_at: string;
    profiles: PendingCollabRequest["requester"] | null;
  };

  return (data as PendingRow[]).map((row) => ({
    id: row.id,
    message: row.message,
    created_at: row.created_at,
    requester: row.profiles ?? {
      display_name: null,
      username: null,
    },
  }));
}

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
      ...EMPTY_ENGAGEMENT,
      fanCount: fanCountRes.count ?? 0,
      likeCount: likeCountRes.count ?? 0,
    };
  }

  if (userId === creatorId) {
    const [likeCountRes, fanCountRes, pendingCollabRequests, labAvailable] =
      await Promise.all([
        likeCountPromise,
        fanCountPromise,
        getPendingCollabRequests(supabase, artworkId, creatorId),
        artworkHasLabForUser(supabase, artworkId, userId),
      ]);

    return {
      fanCount: fanCountRes.count ?? 0,
      isFan: false,
      collabRequest: null,
      likeCount: likeCountRes.count ?? 0,
      isLiked: false,
      labAvailable,
      pendingCollabRequests,
    };
  }

  const [likeCountRes, fanCountRes, likeRes, fanRes, collabRes, labAvailable] =
    await Promise.all([
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
      supabase
        .from("collab_requests")
        .select("id, status, message")
        .eq("artwork_id", artworkId)
        .eq("requester_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      artworkHasLabForUser(supabase, artworkId, userId),
    ]);

  const collab = collabRes.data as ArtworkEngagementState["collabRequest"];

  return {
    fanCount: fanCountRes.count ?? 0,
    isFan: Boolean(fanRes.data),
    collabRequest: collab,
    likeCount: likeCountRes.count ?? 0,
    isLiked: Boolean(likeRes.data),
    labAvailable,
    pendingCollabRequests: [],
  };
}
