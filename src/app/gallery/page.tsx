import { GalleryRealmFilters } from "@/components/gallery/gallery-realm-filters";
import { GalleryToolbar } from "@/components/gallery/gallery-toolbar";
import { PublicGalleryFeed } from "@/components/gallery/public-gallery-feed";
import { PageIntro } from "@/components/layout/page-intro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getGalleryFeedEngagement } from "@/lib/gallery/get-gallery-feed-engagement";
import { getPublicArtworks } from "@/lib/gallery/get-public-artworks";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { MODULE_ICONS } from "@/lib/layout/module-icons";
import { createClient } from "@/lib/supabase/server";

type GalleryPageProps = {
  searchParams: Promise<{ q?: string; realm?: string }>;
};

export const dynamic = "force-dynamic";

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const { q, realm } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const term = q?.trim();
  const heading = term ? t.common.searchResults(term) : t.gallery.heading;
  const items = await getPublicArtworks(q, realm);
  const engagementMap = await getGalleryFeedEngagement(items, user?.id ?? null);
  const engagementByArtwork = Object.fromEntries(engagementMap);

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />
      <GalleryToolbar query={q} />
      <GalleryRealmFilters active={realm} query={q} />

      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="GALLERY"
          title={heading}
          lead={t.gallery.lead}
          iconSrc={MODULE_ICONS.gallery}
        />

        <PublicGalleryFeed
          items={items}
          query={q}
          engagementByArtwork={engagementByArtwork}
          userId={user?.id ?? null}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
