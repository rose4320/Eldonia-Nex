import Link from "next/link";
import { notFound } from "next/navigation";
import { CreatorDisciplineBadges } from "@/components/gallery/creator-discipline-badges";
import { GalleryArtworkCard } from "@/components/gallery/gallery-artwork-card";
import { GalleryToolbar } from "@/components/gallery/gallery-toolbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getGalleryFeedEngagement } from "@/lib/gallery/get-gallery-feed-engagement";
import { getCreatorByUsername } from "@/lib/gallery/get-creator-profile";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

type CreatorProfilePageProps = {
  params: Promise<{ username: string }>;
};

export default async function CreatorProfilePage({ params }: CreatorProfilePageProps) {
  const { username } = await params;
  const locale = await getUiLocale();
  const t = getContent(locale);
  const pages = t.pages;
  const data = await getCreatorByUsername(username);

  if (!data) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    data.profile.display_name ?? data.profile.username ?? pages.creatorFallback;
  const engagementMap = await getGalleryFeedEngagement(data.artworks, user?.id ?? null);
  const engagementByArtwork = Object.fromEntries(engagementMap);

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />
      <GalleryToolbar />

      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/gallery" className="eldonia-link text-sm">
          {pages.gallery.backToList}
        </Link>

        <header className="eldonia-card flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-eldonia-gold/40 bg-eldonia-surface">
            {data.profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.profile.avatar_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-display text-2xl text-eldonia-gold-light">
                {displayName.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <h1 className="eldonia-heading eldonia-heading-lg">{displayName}</h1>
            {data.profile.username && (
              <p className="text-sm text-eldonia-text-muted">@{data.profile.username}</p>
            )}
            <CreatorDisciplineBadges disciplines={data.profile.disciplines} max={4} />
            {data.portfolio?.headline && (
              <p className="font-display text-eldonia-gold-light">{data.portfolio.headline}</p>
            )}
            {data.profile.bio && (
              <p className="eldonia-body whitespace-pre-wrap text-sm">{data.profile.bio}</p>
            )}
            {data.portfolio && (
              <p className="text-xs text-eldonia-text-muted">
                EXP {data.portfolio.exp_points.toLocaleString()} · Lv.{data.portfolio.level}
                {data.portfolio.title_badge ? ` · ${data.portfolio.title_badge}` : ""}
              </p>
            )}
          </div>
        </header>

        {data.seriesAlbums.length > 0 && (
          <section className="space-y-4">
            <h2 className="eldonia-eyebrow">{pages.gallery.creatorSeriesHeading}</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.seriesAlbums.map((artwork) => (
                <GalleryArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  engagement={
                    engagementByArtwork[artwork.id] ?? {
                      fanCount: 0,
                      isFan: false,
                      collabStatus: null,
                      likeCount: 0,
                      isOwner: false,
                      creatorExp: data.portfolio?.exp_points ?? 0,
                      creatorLevel: data.portfolio?.level ?? 1,
                      labAvailable: false,
                    }
                  }
                  userId={user?.id ?? null}
                />
              ))}
            </ul>
          </section>
        )}

        <section className="space-y-4">
          <h2 className="eldonia-eyebrow">{pages.gallery.creatorWorksHeading}</h2>
          {data.artworks.length === 0 ? (
            <p className="eldonia-body text-sm text-eldonia-text-muted">
              {pages.gallery.creatorEmpty}
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.artworks.map((artwork) => (
                <li key={artwork.id}>
                  <GalleryArtworkCard
                    artwork={artwork}
                    engagement={
                      engagementByArtwork[artwork.id] ?? {
                        fanCount: 0,
                        isFan: false,
                        collabStatus: null,
                        likeCount: 0,
                        isOwner: user?.id === artwork.creator_id,
                        creatorExp: data.portfolio?.exp_points ?? 0,
                        creatorLevel: data.portfolio?.level ?? 1,
                        labAvailable: false,
                      }
                    }
                    userId={user?.id ?? null}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
