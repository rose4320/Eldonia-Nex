import type { LabDemoAsset, LabDemoFolder } from "@/lib/lab/lab-room-demo";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, LabAssetRow, LabFolderRow } from "@/types/database";

export const DEFAULT_LAB_FOLDERS: Array<{
  name: string;
  kind: LabDemoFolder["kind"];
  sort_order: number;
}> = [
  { name: "Audio", kind: "media", sort_order: 10 },
  { name: "Project", kind: "project", sort_order: 20 },
  { name: "Framework", kind: "framework", sort_order: 30 },
  { name: "Timeline", kind: "timeline", sort_order: 40 },
  { name: "Lore & Story", kind: "lore", sort_order: 50 },
  { name: "Character", kind: "media", sort_order: 60 },
  { name: "Concept Art", kind: "media", sort_order: 70 },
  { name: "Archive", kind: "archive", sort_order: 80 },
];

export function folderRowToDemo(row: LabFolderRow, itemCount = 0): LabDemoFolder {
  return {
    id: row.id,
    name: row.name,
    itemCount,
    kind: row.kind,
  };
}

export function assetRowToDemo(row: LabAssetRow): LabDemoAsset {
  return {
    id: row.id,
    name: row.name,
    ext: row.ext,
    kind: row.kind,
    folderId: row.folder_id,
    url: row.public_url,
    storagePath: row.storage_path,
  };
}

export async function listLabFolders(
  supabase: SupabaseClient<Database>,
  labId: string,
): Promise<LabFolderRow[]> {
  const { data, error } = await supabase
    .from("lab_folders")
    .select("*")
    .eq("lab_id", labId)
    .eq("archived", false)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[lab-folders] list failed", error.message);
    return [];
  }
  return (data ?? []) as LabFolderRow[];
}

export async function listLabAssets(
  supabase: SupabaseClient<Database>,
  labId: string,
): Promise<LabAssetRow[]> {
  const { data, error } = await supabase
    .from("lab_assets")
    .select("*")
    .eq("lab_id", labId)
    .eq("archived", false)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[lab-assets] list failed", error.message);
    return [];
  }
  return (data ?? []) as LabAssetRow[];
}

/** Seed default folders when Lab has none (first visit). */
export async function ensureDefaultLabFolders(
  supabase: SupabaseClient<Database>,
  labId: string,
  userId: string,
): Promise<LabFolderRow[]> {
  const existing = await listLabFolders(supabase, labId);
  if (existing.length > 0) return existing;

  const { data, error } = await supabase
    .from("lab_folders")
    .insert(
      DEFAULT_LAB_FOLDERS.map((folder) => ({
        lab_id: labId,
        name: folder.name,
        kind: folder.kind,
        sort_order: folder.sort_order,
        created_by: userId,
        archived: false,
      })),
    )
    .select("*");

  if (error) {
    console.error("[lab-folders] seed failed", error.message);
    return listLabFolders(supabase, labId);
  }
  return (data ?? []) as LabFolderRow[];
}

export async function insertLabAsset(
  supabase: SupabaseClient<Database>,
  input: {
    labId: string;
    folderId: string;
    userId: string;
    name: string;
    ext: string;
    kind: LabDemoAsset["kind"];
    storagePath?: string | null;
    publicUrl?: string | null;
  },
): Promise<LabDemoAsset | null> {
  const { data, error } = await supabase
    .from("lab_assets")
    .insert({
      lab_id: input.labId,
      folder_id: input.folderId,
      name: input.name.slice(0, 160),
      ext: input.ext.slice(0, 16) || "bin",
      kind: input.kind,
      storage_path: input.storagePath ?? null,
      public_url: input.publicUrl ?? null,
      created_by: input.userId,
      archived: false,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("[lab-assets] insert failed", error?.message);
    return null;
  }
  return assetRowToDemo(data as LabAssetRow);
}

export async function archiveLabAsset(
  supabase: SupabaseClient<Database>,
  assetId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("lab_assets")
    .update({
      archived: true,
      archived_at: new Date().toISOString(),
    })
    .eq("id", assetId);

  if (error) {
    console.error("[lab-assets] archive failed", error.message);
    return false;
  }
  return true;
}

export async function archiveLabFolder(
  supabase: SupabaseClient<Database>,
  folderId: string,
): Promise<boolean> {
  const now = new Date().toISOString();
  const { error: folderError } = await supabase
    .from("lab_folders")
    .update({ archived: true, archived_at: now })
    .eq("id", folderId);

  if (folderError) {
    console.error("[lab-folders] archive failed", folderError.message);
    return false;
  }

  await supabase
    .from("lab_assets")
    .update({ archived: true, archived_at: now })
    .eq("folder_id", folderId);

  return true;
}
