import Link from "next/link";
import { ArtworkCard } from "@/components/gallery/artwork-card";
import { GalleryToolbar } from "@/components/gallery/gallery-toolbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";
import type { ArtworkWithCreator } from "@/types/database";

type GalleryPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const { q } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dbQuery = supabase
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

  const term = q?.trim();
  if (term) {
    dbQuery = dbQuery.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const { data: artworks } = await dbQuery;

  const items = (artworks ?? []) as ArtworkWithCreator[];
  const heading = term ? t.common.searchResults(term) : t.gallery.heading;

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <GalleryToolbar query={q} />

      <main className="eldonia-main">
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eldonia-eyebrow">GALLEY</p>
            <h1 className="eldonia-heading eldonia-heading-lg mt-1">{heading}</h1>
            <p className="eldonia-body mt-2 text-sm">{t.gallery.lead}</p>
          </div>
          {user && (
            <Link href="/settings/post/artwork" className="eldonia-btn-primary">
              {t.gallery.upload}
            </Link>
          )}
        </section>

        {items.length === 0 ? (
          <section className="eldonia-card eldonia-card-dashed px-8 py-16 text-center">
            <p className="text-eldonia-text-muted">
              {term ? t.gallery.emptySearch : t.gallery.empty}
            </p>
            {user ? (
              <Link
                href="/settings/post/artwork"
                className="eldonia-link mt-4 inline-block text-sm font-medium"
              >
                {t.common.firstPost}
              </Link>
            ) : (
              <Link
                href="/auth/login?redirect_to=/settings/post/artwork"
                className="eldonia-link mt-4 inline-block text-sm font-medium"
              >
                {t.common.loginToPost}
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

      <SiteFooter />
    </div>
  );
}
