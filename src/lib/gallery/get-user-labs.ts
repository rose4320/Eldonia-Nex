import { createClient } from "@/lib/supabase/server";

export type UserLabSummary = {
  id: string;
  title: string;
  artwork_id: string;
  created_at: string;
  artworkTitle: string;
  artworkThumb: string | null;
  memberCount: number;
};

export async function getUserLabs(userId: string): Promise<UserLabSummary[]> {
  const supabase = await createClient();

  const { data: memberships } = await supabase
    .from("collab_lab_members")
    .select("lab_id")
    .eq("user_id", userId);

  const labIds = (memberships ?? []).map((row) => row.lab_id);
  if (labIds.length === 0) {
    return [];
  }

  const { data: labs } = await supabase
    .from("collab_labs")
    .select("id, title, artwork_id, created_at")
    .in("id", labIds)
    .order("created_at", { ascending: false });

  if (!labs?.length) {
    return [];
  }

  const artworkIds = [...new Set(labs.map((lab) => lab.artwork_id))];

  const [artworksRes, memberCountsRes] = await Promise.all([
    supabase
      .from("artworks")
      .select("id, title, thumbnail_url, media_url")
      .in("id", artworkIds),
    supabase.from("collab_lab_members").select("lab_id").in("lab_id", labIds),
  ]);

  const artworkById = new Map(
    (artworksRes.data ?? []).map((artwork) => [artwork.id, artwork]),
  );

  const memberCountByLab = new Map<string, number>();
  for (const row of memberCountsRes.data ?? []) {
    memberCountByLab.set(row.lab_id, (memberCountByLab.get(row.lab_id) ?? 0) + 1);
  }

  return labs.map((lab) => {
    const artwork = artworkById.get(lab.artwork_id);
    return {
      id: lab.id,
      title: lab.title,
      artwork_id: lab.artwork_id,
      created_at: lab.created_at,
      artworkTitle: artwork?.title ?? lab.title,
      artworkThumb: artwork?.thumbnail_url ?? artwork?.media_url ?? null,
      memberCount: memberCountByLab.get(lab.id) ?? 0,
    };
  });
}
