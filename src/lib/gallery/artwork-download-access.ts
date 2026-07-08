import { isLabMemberForArtwork } from "@/lib/gallery/lab-access";

export type ArtworkDownloadActor = "owner" | "lab";

export async function resolveArtworkDownloadActor(
  userId: string,
  artworkId: string,
  creatorId: string,
): Promise<ArtworkDownloadActor | null> {
  if (userId === creatorId) return "owner";
  if (await isLabMemberForArtwork(artworkId, userId)) return "lab";
  return null;
}
