"use client";

import { LabRoomShell } from "@/components/lab/lab-room-shell";
import type { CollabLabData } from "@/lib/gallery/get-collab-lab";

type CollabLabWorkspaceProps = {
  labData: CollabLabData;
  userId: string;
};

/** Lab room entry — Phase 1 shell (folders / workspace / chat / media). */
export function CollabLabWorkspace({ labData, userId }: CollabLabWorkspaceProps) {
  return <LabRoomShell labData={labData} userId={userId} />;
}
