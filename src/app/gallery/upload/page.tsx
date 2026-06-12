import Link from "next/link";
import { redirect } from "next/navigation";
import { UploadForm } from "@/components/gallery/upload-form";
import { SiteHeader } from "@/components/layout/site-header";
import { createClient } from "@/lib/supabase/server";

export default async function GalleryUploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect_to=/gallery/upload");
  }

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main eldonia-main-narrow">
        <div>
          <Link
            href="/gallery"
            className="eldonia-link text-sm"
          >
            ← ギャラリー一覧
          </Link>
          <h1 className="mt-2 eldonia-heading eldonia-heading-sm">作品を投稿</h1>
          <p className="mt-1 eldonia-body text-sm">
            画像・動画・音声・PDF をアップロードして公開できます。
          </p>
        </div>

        <section className="eldonia-card">
          <UploadForm userId={user.id} />
        </section>
      </main>
    </div>
  );
}
