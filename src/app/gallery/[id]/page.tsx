import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtworkCommentForm } from "@/components/gallery/artwork-comment-form";
import { ArtworkCommentsPanel } from "@/components/gallery/artwork-comments-panel";
import { ArtworkEngagementActions } from "@/components/gallery/artwork-engagement-actions";
import { ArtworkLikeButtons } from "@/components/gallery/artwork-like-buttons";
import { GalleryToolbar } from "@/components/gallery/gallery-toolbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ContentLine, TagWithHint } from "@/components/i18n/content-line";
import { categoryLabel, formatDate } from "@/lib/gallery/constants";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import {
  getArtworkComments,
  getArtworkEngagement,
} from "@/lib/gallery/get-artwork-engagement";
import { createClient } from "@/lib/supabase/server";
import type { ArtworkWithCreator } from "@/types/database";

type ArtworkDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  const { id } = await params;
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: artwork } = await supabase
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
    .eq("id", id)
    .single();

  if (!artwork) {
    notFound();
  }

  const item = artwork as ArtworkWithCreator;
  const creatorName =
    item.profiles?.display_name ?? item.profiles?.username ?? pages.creatorFallback;
  const isOwner = user?.id === item.creator_id;

  const [comments, engagement] = await Promise.all([
    getArtworkComments(id),
    getArtworkEngagement(id, item.creator_id, user?.id ?? null),
  ]);

  const loginRedirect = `/gallery/${id}`;

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <GalleryToolbar />

      <main className="eldonia-main pb-36 lg:pb-8">
        <Link href="/gallery" className="eldonia-link text-sm">
          {pages.gallery.backToList}
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="min-w-0 space-y-4">
            <article className="eldonia-card overflow-hidden p-0">
              <div className="bg-eldonia-surface">
                {item.media_type === "image" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.media_url}
                    alt={item.title}
                    className="max-h-[70vh] w-full object-contain"
                  />
                )}
                {item.media_type === "video" && (
                  <video
                    src={item.media_url}
                    controls
                    className="max-h-[70vh] w-full bg-black"
                  />
                )}
                {item.media_type === "audio" && (
                  <div className="flex items-center justify-center px-6 py-16">
                    <audio src={item.media_url} controls className="w-full max-w-lg" />
                  </div>
                )}
                {item.media_type === "document" && (
                  <div className="flex items-center justify-center px-6 py-16">
                    <a
                      href={item.media_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="eldonia-btn-primary"
                    >
                      {pages.gallery.openPdf}
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-4 p-6 lg:p-8">
                <div>
                  <p className="eldonia-eyebrow text-[0.65rem]">
                    {categoryLabel(item.category, locale)}
                  </p>
                  <ContentLine
                    text={item.title}
                    locale={locale}
                    as="h1"
                    className="eldonia-heading eldonia-heading-lg mt-1"
                    hintClassName="eldonia-localized-hint text-sm"
                  />
                  <p className="mt-2 text-sm text-eldonia-text-muted">
                    {creatorName} · {formatDate(item.created_at, locale)}
                  </p>
                </div>

                {item.description && (
                  <ContentLine
                    text={item.description}
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
                    userId={user?.id ?? null}
                    isOwner={isOwner}
                    engagement={engagement}
                    loginRedirect={loginRedirect}
                  />
                  <ArtworkEngagementActions
                    artworkId={id}
                    creatorId={item.creator_id}
                    creatorName={creatorName}
                    userId={user?.id ?? null}
                    isOwner={isOwner}
                    engagement={engagement}
                    loginRedirect={loginRedirect}
                  />
                </div>
              </div>
            </article>

            <div className="lg:hidden">
              <ArtworkCommentsPanel
                comments={comments}
                artworkId={id}
                userId={user?.id ?? null}
                loginRedirect={loginRedirect}
                showForm={false}
                className="max-h-80"
              />
            </div>
          </div>

          <ArtworkCommentsPanel
            comments={comments}
            artworkId={id}
            userId={user?.id ?? null}
            loginRedirect={loginRedirect}
            className="hidden lg:sticky lg:top-20 lg:flex lg:h-[calc(100dvh-6rem)]"
          />
        </div>

        {user ? (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-eldonia-border bg-eldonia-surface-elevated p-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden">
            <ArtworkCommentForm artworkId={id} userId={user.id} variant="fixed" />
          </div>
        ) : (
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
