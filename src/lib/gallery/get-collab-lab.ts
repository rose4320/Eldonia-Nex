import {
  assetRowToDemo,
  ensureDefaultLabFolders,
  folderRowToDemo,
  listLabAssets,
} from "@/lib/lab/lab-assets";
import { listLabSnapshots } from "@/lib/lab/lab-snapshot-db";
import type { LabDemoAsset, LabDemoFolder } from "@/lib/lab/lab-room-demo";
import type { LabRoomSnapshot } from "@/lib/lab/lab-snapshot";
import { createClient } from "@/lib/supabase/server";
import type { CollabLab, CollabLabPostWithAuthor, ArtworkMediaType } from "@/types/database";

export type CollabLabArtwork = {
  id: string;
  title: string;
  media_type: ArtworkMediaType;
  media_url: string;
  thumbnail_url: string | null;
};

export type CollabLabData = {
  lab: CollabLab;
  artwork: CollabLabArtwork;
  members: Array<{
    user_id: string;
    role: string;
    profiles: {
      display_name: string | null;
      username: string | null;
      avatar_url: string | null;
    } | null;
  }>;
  posts: CollabLabPostWithAuthor[];
  folders: LabDemoFolder[];
  assets: LabDemoAsset[];
  snapshots: LabRoomSnapshot[];
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

  const [membersRes, postsRes, artworkRes, folderRows, assetRows, snapshots] =
    await Promise.all([
      supabase
        .from("collab_lab_members")
        .select(
          `
        user_id,
        role,
        profiles:user_id (display_name, username, avatar_url)
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
      supabase
        .from("artworks")
        .select("id, title, media_type, media_url, thumbnail_url")
        .eq("id", artworkId)
        .maybeSingle(),
      ensureDefaultLabFolders(supabase, lab.id, userId),
      listLabAssets(supabase, lab.id),
      listLabSnapshots(supabase, lab.id),
    ]);

  if (!artworkRes.data) {
    return null;
  }

  const countByFolder = new Map<string, number>();
  for (const asset of assetRows) {
    countByFolder.set(asset.folder_id, (countByFolder.get(asset.folder_id) ?? 0) + 1);
  }

  return {
    lab: lab as CollabLab,
    artwork: artworkRes.data as CollabLabArtwork,
    members: (membersRes.data ?? []) as CollabLabData["members"],
    posts: (postsRes.data ?? []) as CollabLabPostWithAuthor[],
    folders: folderRows.map((row) =>
      folderRowToDemo(row, countByFolder.get(row.id) ?? 0),
    ),
    assets: assetRows.map(assetRowToDemo),
    snapshots,
  };
}
