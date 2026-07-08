import { createClient } from "@/lib/supabase/server";

/** Lab メンバー（作品の共同作業者）かどうか */
export async function isLabMemberForArtwork(
  artworkId: string,
  userId: string,
): Promise<boolean> {
  const supabase = await createClient();

  const { data: memberships } = await supabase
    .from("collab_lab_members")
    .select("lab_id")
    .eq("user_id", userId);

  const labIds = memberships?.map((row) => row.lab_id) ?? [];
  if (labIds.length === 0) return false;

  const { data: lab } = await supabase
    .from("collab_labs")
    .select("id")
    .eq("artwork_id", artworkId)
    .in("id", labIds)
    .limit(1)
    .maybeSingle();

  return Boolean(lab);
}
