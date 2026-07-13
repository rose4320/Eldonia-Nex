import { redirect } from "next/navigation";
import { LabRoomShell } from "@/components/lab/lab-room-shell";
import { buildLabPreviewData } from "@/lib/lab/lab-preview-data";
import { createClient } from "@/lib/supabase/server";

export default async function LabPreviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect_to=/lab/preview");
  }

  const labData = buildLabPreviewData(user.id);

  return (
    <div className="lp-page lab-immersive-page flex min-h-screen flex-col text-[#f8f1df]">
      <main className="lab-immersive-main flex w-full flex-1 flex-col">
        <div className="lab-immersive-shell flex min-h-0 flex-1 flex-col">
          <LabRoomShell labData={labData} userId={user.id} preview />
        </div>
      </main>
    </div>
  );
}
