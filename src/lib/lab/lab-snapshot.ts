import type { LabDemoAsset, LabDemoFolder, LabTimelineTrack } from "@/lib/lab/lab-room-demo";

/** Serializable Lab room state for Snapshot / Publish Version. */
export type LabRoomSnapshotPayload = {
  schemaVersion: 1;
  tracks: LabTimelineTrack[];
  stagedFiles: Array<{
    id: string;
    label: string;
    kind: LabTimelineTrack["kind"];
    expanded: boolean;
    clipId: string | null;
    assetId: string;
    folderId: string;
    name: string;
    ext: string;
    assetKind: LabDemoAsset["kind"];
  }>;
  assetList: LabDemoAsset[];
  folderList: LabDemoFolder[];
  playheadPct: number;
  selectedFolderId: string;
  mixerLevels: Record<string, number>;
  mixerPans: Record<string, number>;
  mixerMutes: Record<string, boolean>;
  mixerSolos: Record<string, boolean>;
  mixerSends: Record<string, number>;
  eqByTrack: Record<string, number[]>;
  eqTargetId: string;
  eqQ: number;
  eqLowCut: boolean;
  eqHighCut: boolean;
  masterLimiter: number;
  nleHeight: number;
};

export type LabSnapshotKind = "snapshot" | "publish";

export type LabRoomSnapshot = {
  id: string;
  label: string;
  kind: LabSnapshotKind;
  createdAt: string;
  createdBy: string;
  /** Soft-delete / hide from default list (§23). */
  archived: boolean;
  payload: LabRoomSnapshotPayload;
};

export function cloneSnapshotPayload(
  payload: LabRoomSnapshotPayload,
): LabRoomSnapshotPayload {
  return structuredClone(payload);
}

export function formatSnapshotDefaultLabel(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `Snapshot ${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
