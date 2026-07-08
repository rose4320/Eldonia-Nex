import { isQuestAdmin } from "@/lib/quests/is-quest-admin";

export type ArtworkVisibilityActor = "owner" | "admin";

export async function resolveArtworkVisibilityActor(
  userId: string,
  creatorId: string,
): Promise<ArtworkVisibilityActor | null> {
  if (userId === creatorId) return "owner";
  if (await isQuestAdmin(userId)) return "admin";
  return null;
}
