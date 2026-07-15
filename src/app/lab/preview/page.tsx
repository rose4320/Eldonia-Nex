import { LabRoomShell } from "@/components/lab/lab-room-shell";
import { buildLabPreviewData } from "@/lib/lab/lab-preview-data";
import { createClient } from "@/lib/supabase/server";

/** Guest demo identity — local-only; never written to Supabase. */
const GUEST_PREVIEW_USER_ID = "00000000-0000-4000-8000-0000000000e1";

/**
 * Lab UI preview — operable by anyone (no login).
 * Real collaborative Labs remain members-only (`/gallery/[id]/lab`).
 */
export default async function LabPreviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id ?? GUEST_PREVIEW_USER_ID;
  const labData = buildLabPreviewData(userId);

  return (
    <div className="lp-page lab-immersive-page flex min-h-screen flex-col text-[#f8f1df]">
      <main className="lab-immersive-main flex w-full flex-1 flex-col">
        <div className="lab-immersive-shell flex min-h-0 flex-1 flex-col">
          <LabRoomShell labData={labData} userId={userId} preview />
        </div>
      </main>
    </div>
  );
}
