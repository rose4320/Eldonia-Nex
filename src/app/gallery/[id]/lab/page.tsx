import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CollabLabWorkspace } from "@/components/gallery/collab-lab-workspace";
import { GalleryToolbar } from "@/components/gallery/gallery-toolbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getCollabLabForArtwork } from "@/lib/gallery/get-collab-lab";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

type CollabLabPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CollabLabPage({ params }: CollabLabPageProps) {
  const { id: artworkId } = await params;
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
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
    <div className="eldonia-page">
      <SiteHeader />
      <GalleryToolbar />

      <main className="eldonia-main eldonia-main-narrow">
        <Link href={`/gallery/${artworkId}`} className="eldonia-link text-sm">
          {pages.gallery.labBack}
        </Link>
        <div className="mt-4">
          <CollabLabWorkspace labData={labData} userId={user.id} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
