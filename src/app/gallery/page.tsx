import Link from "next/link";
import { ArtworkCard } from "@/components/gallery/artwork-card";
import { SiteHeader } from "@/components/layout/site-header";
import { createClient } from "@/lib/supabase/server";
import type { ArtworkWithCreator } from "@/types/database";

export default async function GalleryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: artworks } = await supabase
    .from("artworks")
    .select(
      `
      *,
      profiles:creator_id (
        display_name,
        username,
        avatar_url
      )
    `,
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(24);

  const items = (artworks ?? []) as ArtworkWithCreator[];

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main">
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eldonia-eyebrow">
              GALLEY
            </p>
            <h1 className="mt-1 eldonia-heading eldonia-heading-lg">作品ギャラリー</h1>
            <p className="mt-2 eldonia-body text-sm">
              クリエイターの作品を閲覧・共有できます。
            </p>
          </div>
          {user && (
            <Link
              href="/gallery/upload"
              className="eldonia-btn-primary"
            >
              作品を投稿
            </Link>
          )}
        </section>

        {items.length === 0 ? (
          <section className="eldonia-card eldonia-card-dashed px-8 py-16 text-center">
            <p className="text-eldonia-text-muted">まだ公開作品がありません。</p>
            {user ? (
              <Link
                href="/gallery/upload"
                className="mt-4 inline-block text-sm eldonia-link font-medium"
              >
                最初の作品を投稿する →
              </Link>
            ) : (
              <Link
                href="/auth/login?redirect_to=/gallery/upload"
                className="mt-4 inline-block text-sm eldonia-link font-medium"
              >
                ログインして投稿する →
              </Link>
            )}
          </section>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
