import { notFound, redirect } from "next/navigation";
import { CollabLabWorkspace } from "@/components/gallery/collab-lab-workspace";
import { getCollabLabForArtwork } from "@/lib/gallery/get-collab-lab";
import { createClient } from "@/lib/supabase/server";

type CollabLabPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CollabLabPage({ params }: CollabLabPageProps) {
  const { id: artworkId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect_to=/gallery/${artworkId}/lab`);
  }

  const labData = await getCollabLabForArtwork(artworkId, user.id);
  if (!labData) {
    notFound();
  }

  return (
    <div className="lp-page lab-immersive-page flex min-h-screen flex-col text-[#f8f1df]">
      <main className="lab-immersive-main flex w-full flex-1 flex-col">
        <div className="lab-immersive-shell flex min-h-0 flex-1 flex-col">
          <CollabLabWorkspace labData={labData} userId={user.id} />
        </div>
      </main>
    </div>
  );
}
