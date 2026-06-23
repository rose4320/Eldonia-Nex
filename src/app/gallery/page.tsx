import Link from "next/link";
import { GalleryToolbar } from "@/components/gallery/gallery-toolbar";
import { PublicGalleryFeed } from "@/components/gallery/public-gallery-feed";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublicArtworks } from "@/lib/gallery/get-public-artworks";
import { galleryUploadHref } from "@/lib/gallery/upload-link";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

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
  const uploadHref = galleryUploadHref(Boolean(user));

  const term = q?.trim();
  const heading = term ? t.common.searchResults(term) : t.gallery.heading;
  const items = await getPublicArtworks(q);

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
          <Link href={uploadHref} className="eldonia-btn-primary">
            {t.gallery.upload}
          </Link>
        </section>

        <PublicGalleryFeed
          items={items}
          query={q}
          uploadHref={uploadHref}
          uploadLabel={user ? t.gallery.upload : t.common.loginToPost}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
