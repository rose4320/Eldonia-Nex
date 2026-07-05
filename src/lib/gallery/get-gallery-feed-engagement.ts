import { levelFromExp } from "@/lib/works/constants";
import { createClient } from "@/lib/supabase/server";
import type { ArtworkWithCreator, CollabRequestStatus } from "@/types/database";

export type GalleryArtworkEngagement = {
  fanCount: number;
  likeCount: number;
  creatorExp: number;
  creatorLevel: number;
  isFan: boolean;
  isLiked: boolean;
  collabStatus: CollabRequestStatus | null;
  isOwner: boolean;
};

function countByKey(rows: { key: string }[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    counts.set(row.key, (counts.get(row.key) ?? 0) + 1);
  }
  return counts;
}

export async function getGalleryFeedEngagement(
  artworks: ArtworkWithCreator[],
  userId: string | null,
): Promise<Map<string, GalleryArtworkEngagement>> {
  const result = new Map<string, GalleryArtworkEngagement>();
  if (artworks.length === 0) return result;

  const supabase = await createClient();
  const artworkIds = artworks.map((artwork) => artwork.id);
  const creatorIds = [...new Set(artworks.map((artwork) => artwork.creator_id))];

  const [
    likesRes,
    fansRes,
    portfoliosRes,
    userLikesRes,
    userFansRes,
    collabRes,
  ] = await Promise.all([
    supabase.from("artwork_likes").select("artwork_id").in("artwork_id", artworkIds),
    supabase.from("creator_fans").select("creator_id").in("creator_id", creatorIds),
    supabase
      .from("portfolios")
      .select("user_id, exp_points, level")
      .in("user_id", creatorIds),
    userId
      ? supabase
          .from("artwork_likes")
          .select("artwork_id")
          .eq("user_id", userId)
          .in("artwork_id", artworkIds)
      : Promise.resolve({ data: null }),
    userId
      ? supabase
          .from("creator_fans")
          .select("creator_id")
          .eq("fan_id", userId)
          .in("creator_id", creatorIds)
      : Promise.resolve({ data: null }),
    userId
      ? supabase
          .from("collab_requests")
          .select("artwork_id, status, created_at")
          .eq("requester_id", userId)
          .in("artwork_id", artworkIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: null }),
  ]);

  const likeCounts = countByKey(
    (likesRes.data ?? []).map((row) => ({ key: row.artwork_id })),
  );
  const fanCounts = countByKey(
    (fansRes.data ?? []).map((row) => ({ key: row.creator_id })),
  );

  const portfolioMap = new Map(
    (portfoliosRes.data ?? []).map((row) => [
      row.user_id,
      {
        exp: row.exp_points ?? 0,
        level: row.level ?? levelFromExp(row.exp_points ?? 0),
      },
    ]),
  );

  const likedArtworkIds = new Set(
    (userLikesRes.data ?? []).map((row) => row.artwork_id),
  );
  const fanCreatorIds = new Set(
    (userFansRes.data ?? []).map((row) => row.creator_id),
  );

  const collabByArtwork = new Map<string, CollabRequestStatus>();
  for (const row of collabRes.data ?? []) {
    if (!collabByArtwork.has(row.artwork_id)) {
      collabByArtwork.set(row.artwork_id, row.status as CollabRequestStatus);
    }
  }

  for (const artwork of artworks) {
    const portfolio = portfolioMap.get(artwork.creator_id);
    const creatorExp = portfolio?.exp ?? 0;
    result.set(artwork.id, {
      fanCount: fanCounts.get(artwork.creator_id) ?? 0,
      likeCount: likeCounts.get(artwork.id) ?? 0,
      creatorExp,
      creatorLevel: portfolio?.level ?? levelFromExp(creatorExp),
      isFan: fanCreatorIds.has(artwork.creator_id),
      isLiked: likedArtworkIds.has(artwork.id),
      collabStatus: collabByArtwork.get(artwork.id) ?? null,
      isOwner: userId === artwork.creator_id,
    });
  }

  return result;
}
