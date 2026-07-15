import type { LabRoomSnapshot, LabRoomSnapshotPayload, LabSnapshotKind } from "@/lib/lab/lab-snapshot";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, LabSnapshotRow } from "@/types/database";

function rowToSnapshot(row: LabSnapshotRow): LabRoomSnapshot {
  return {
    id: row.id,
    label: row.label,
    kind: row.kind,
    createdAt: row.created_at,
    createdBy: row.created_by,
    archived: row.archived,
    payload: row.payload as LabRoomSnapshotPayload,
  };
}

export async function listLabSnapshots(
  supabase: SupabaseClient<Database>,
  labId: string,
): Promise<LabRoomSnapshot[]> {
  const { data, error } = await supabase
    .from("lab_snapshots")
    .select("*")
    .eq("lab_id", labId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[lab-snapshots] list failed", error.message);
    return [];
  }
  return (data ?? []).map((row) => rowToSnapshot(row as LabSnapshotRow));
}

export async function insertLabSnapshot(
  supabase: SupabaseClient<Database>,
  input: {
    labId: string;
    userId: string;
    label: string;
    kind: LabSnapshotKind;
    payload: LabRoomSnapshotPayload;
  },
): Promise<LabRoomSnapshot | null> {
  const { data, error } = await supabase
    .from("lab_snapshots")
    .insert({
      lab_id: input.labId,
      created_by: input.userId,
      label: input.label.slice(0, 120),
      kind: input.kind,
      schema_version: 1,
      payload: input.payload as LabSnapshotRow["payload"],
      archived: false,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("[lab-snapshots] insert failed", error?.message);
    return null;
  }
  return rowToSnapshot(data as LabSnapshotRow);
}

export async function archiveLabSnapshot(
  supabase: SupabaseClient<Database>,
  snapshotId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("lab_snapshots")
    .update({
      archived: true,
      archived_at: new Date().toISOString(),
    })
    .eq("id", snapshotId);

  if (error) {
    console.error("[lab-snapshots] archive failed", error.message);
    return false;
  }
  return true;
}
