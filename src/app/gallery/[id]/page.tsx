import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtworkMediaHero } from "@/components/gallery/artwork-media-hero";
import { ArtworkPageViewer } from "@/components/gallery/artwork-page-viewer";
import { StoryNarrativeReader } from "@/components/gallery/story-narrative-reader";
import { CreatorDisciplineBadges } from "@/components/gallery/creator-discipline-badges";
import { ArtworkCommentsPanel } from "@/components/gallery/artwork-comments-panel";
import { ArtworkEngagementActions } from "@/components/gallery/artwork-engagement-actions";
import { ArtworkLikeButtons } from "@/components/gallery/artwork-like-buttons";
import { GalleryToolbar } from "@/components/gallery/gallery-toolbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TagWithHint, TranslatedContentLine } from "@/components/i18n/content-line";
import { inferSourceLocale } from "@/lib/translation/infer-source-locale";
import { getArtworkDetailTranslations } from "@/lib/translation/list-translations";
import { categoryLabel, formatBadgeLabel, formatDate, artworkCoverUrl } from "@/lib/gallery/constants";
import { resolveCuratedPhotoCaptions } from "@/lib/gallery/artwork-localized-meta";
import {
  canShowStoryReader,
  resolveStoryReaderContent,
} from "@/lib/gallery/story-localized-content";
import { getArtworkPages } from "@/lib/gallery/get-artwork-pages";
import { getSeriesArtworks } from "@/lib/gallery/get-creator-profile";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import {
  getArtworkComments,
  getArtworkEngagement,
} from "@/lib/gallery/get-artwork-engagement";
import { getPublicArtworkById } from "@/lib/gallery/get-public-artworks";
import { createClient } from "@/lib/supabase/server";
import type { ArtworkWithCreator } from "@/types/database";

type ArtworkDetailPageProps = {
  params: Promise<{ id: string }>;
};

const GALLERY_DETAIL_TIMEOUT_MS = 1200;

export const dynamic = "force-dynamic";

async function withTimeout<T>(promise: PromiseLike<T>, fallback: T): Promise<T> {
  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) =>
        setTimeout(() => resolve(fallback), GALLERY_DETAIL_TIMEOUT_MS),
      ),
    ]);
  } catch {
    return fallback;
  }
}

export default async function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  const { id } = await params;
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id ?? null;

  const artwork = await getPublicArtworkById(id);

  if (!artwork) {
    notFound();
  }

  if (!artwork.is_public && artwork.creator_id !== userId) {
    notFound();
  }

  const item = artwork as ArtworkWithCreator;
  const contentTranslations = await getArtworkDetailTranslations(item, locale);
  const titleLocale = inferSourceLocale(item.title);
  const creatorName =
    item.profiles?.display_name ?? item.profiles?.username ?? pages.creatorFallback;
  const isOwner = userId === item.creator_id;

  const [comments, engagement, artworkPages, seriesItems] = await Promise.all([
    withTimeout(getArtworkComments(id), []),
    withTimeout(getArtworkEngagement(id, item.creator_id, userId), {
      fanCount: 0,
      isFan: false,
      collabRequest: null,
      likeCount: 0,
      isLiked: false,
      labAvailable: false,
      pendingCollabRequests: [],
    }),
    getArtworkPages(id),
    item.format === "series_album" ? getSeriesArtworks(id) : Promise.resolve([]),
  ]);

  const loginRedirect = `/gallery/${id}`;
  const creatorHref = item.profiles?.username
    ? `/gallery/creator/${item.profiles.username}`
    : null;
  const formatBadge = formatBadgeLabel(
    item.format ?? "single",
    item.category,
    item.page_count ?? 1,
    locale,
  );
  const showPageViewer =
    item.format === "multi_page" ||
    artworkPages.length > 0 ||
    (item.page_count ?? 1) > 1;
  const showStoryReader = canShowStoryReader(
    item.id,
    item.title,
    item.category,
    item.description,
    locale,
  );
  const storyContent = showStoryReader
    ? resolveStoryReaderContent(
        item.id,
        item.title,
        item.story_excerpt,
        item.description,
        locale,
      )
    : null;

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <GalleryToolbar />

      <main className={`eldonia-main ${!userId ? "pb-36" : "pb-8"} lg:pb-8`}>
        <Link href="/gallery" className="eldonia-link text-sm">
          {pages.gallery.backToList}
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="min-w-0 space-y-4">
            <article className="eldonia-card overflow-hidden p-0">
              <div className="bg-eldonia-surface">
                {showStoryReader && storyContent ? (
                  <StoryNarrativeReader
                    key={`${item.id}-${locale}`}
                    artworkId={item.id}
                    title={storyContent.title}
                    excerpt={storyContent.excerpt}
                    body={storyContent.body}
                  />
                ) : showPageViewer ? (
                  <ArtworkPageViewer
                    title={item.title}
                    artworkId={item.id}
                    category={item.category}
                    format={item.format ?? "single"}
                    pageCount={item.page_count ?? 1}
                    coverUrl={artworkCoverUrl(item)}
                    pages={artworkPages}
                    bgmUrl={item.bgm_url}
                    captionByPageIndex={resolveCuratedPhotoCaptions(
                      item.id,
                      item.title,
                      locale,
                    )}
                  />
                ) : (
                  <ArtworkMediaHero
                    artwork={item}
                    openPdfLabel={pages.gallery.openPdf}
                    protectDownload
                    downloadNotice={pages.gallery.downloadRestricted}
                  />
                )}
              </div>

              <div className="space-y-4 p-6 lg:p-8">
                <div>
                  <p className="eldonia-eyebrow text-[0.65rem]">
                    {categoryLabel(item.category, locale)}
                    {formatBadge && (
                      <span className="ml-2 text-eldonia-text-muted">· {formatBadge}</span>
                    )}
                  </p>
                  <TranslatedContentLine
                    text={item.title}
                    translatedText={contentTranslations.title}
                    sourceLocale={titleLocale}
                    locale={locale}
                    as="h1"
                    className="eldonia-heading eldonia-heading-lg mt-1"
                    hintClassName="eldonia-localized-hint text-sm"
                  />
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-eldonia-text-muted">
                    {creatorHref ? (
                      <Link href={creatorHref} className="eldonia-link">
                        {creatorName}
                      </Link>
                    ) : (
                      <span>{creatorName}</span>
                    )}
                    <CreatorDisciplineBadges disciplines={item.profiles?.disciplines} />
                    <span aria-hidden>·</span>
                    <span>{formatDate(item.created_at, locale)}</span>
                    {creatorHref && (
                      <Link href={creatorHref} className="eldonia-link text-xs">
                        {pages.gallery.viewCreator}
                      </Link>
                    )}
                  </div>
                </div>

                {item.story_excerpt && !showStoryReader && (
                  <div className="rounded-md border border-eldonia-border bg-eldonia-surface/60 p-4">
                    <p className="eldonia-label text-xs">{pages.gallery.storyExcerptHeading}</p>
                    <TranslatedContentLine
                      text={item.story_excerpt}
                      translatedText={contentTranslations.story_excerpt}
                      sourceLocale={inferSourceLocale(item.story_excerpt, titleLocale)}
                      locale={locale}
                      as="p"
                      className="eldonia-body mt-2 whitespace-pre-wrap text-sm"
                      hintClassName="eldonia-localized-hint text-xs"
                    />
                  </div>
                )}

                {showStoryReader && storyContent?.excerpt && (
                  <div className="rounded-md border border-eldonia-border bg-eldonia-surface/60 p-4 lg:hidden">
                    <p className="eldonia-label text-xs">{pages.gallery.storyExcerptHeading}</p>
                    <p className="eldonia-body mt-2 whitespace-pre-wrap text-sm">{storyContent.excerpt}</p>
                  </div>
                )}

                {item.description && !showStoryReader && (
                  <TranslatedContentLine
                    text={item.description}
                    translatedText={contentTranslations.description}
                    sourceLocale={inferSourceLocale(item.description, titleLocale)}
                    locale={locale}
                    as="p"
                    className="eldonia-body whitespace-pre-wrap text-sm"
                    hintClassName="eldonia-localized-hint text-xs"
                  />
                )}

                {item.tags.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-eldonia-gold/20 bg-eldonia-gold/5 px-3 py-1 text-xs text-eldonia-text-muted"
                      >
                        #<TagWithHint text={tag} locale={locale} />
                      </li>
                    ))}
                  </ul>
                )}

                <div className="space-y-3 border-t border-eldonia-border pt-4">
                  <ArtworkLikeButtons
                    artworkId={id}
                    userId={userId}
                    isOwner={isOwner}
                    engagement={engagement}
                    loginRedirect={loginRedirect}
                  />
                  <ArtworkEngagementActions
                    artworkId={id}
                    creatorId={item.creator_id}
                    creatorName={creatorName}
                    userId={userId}
                    isOwner={isOwner}
                    engagement={engagement}
                    loginRedirect={loginRedirect}
                    pendingCollabRequests={engagement.pendingCollabRequests}
                    labAvailable={engagement.labAvailable}
                  />
                </div>
              </div>
            </article>

            {seriesItems.length > 0 && (
              <section className="eldonia-card space-y-3 p-5">
                <h2 className="eldonia-label">{pages.gallery.seriesHeading}</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {seriesItems.map((entry) => (
                    <li key={entry.id}>
                      <Link
                        href={`/gallery/${entry.id}`}
                        className="flex items-center gap-3 rounded-md border border-eldonia-border p-3 transition hover:border-eldonia-gold/40"
                      >
                        {artworkCoverUrl(entry) && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={artworkCoverUrl(entry)!}
                            alt=""
                            className="h-14 w-14 rounded object-cover"
                          />
                        )}
                        <span className="line-clamp-2 text-sm text-eldonia-gold-light">
                          {entry.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="lg:hidden">
              <ArtworkCommentsPanel
                comments={comments}
                artworkId={id}
                userId={userId}
                loginRedirect={loginRedirect}
                className="max-h-80"
              />
            </div>
          </div>

          <ArtworkCommentsPanel
            comments={comments}
            artworkId={id}
            userId={userId}
            loginRedirect={loginRedirect}
            className="hidden lg:sticky lg:top-20 lg:flex lg:h-[calc(100dvh-6rem)]"
          />
        </div>

        {!userId && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-eldonia-border bg-eldonia-surface-elevated p-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden">
            <p className="eldonia-body text-center text-sm">
              <Link
                href={`/auth/login?redirect_to=${encodeURIComponent(loginRedirect)}`}
                className="eldonia-link"
              >
                {pages.gallery.loginToCommentFull}
              </Link>
            </p>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
