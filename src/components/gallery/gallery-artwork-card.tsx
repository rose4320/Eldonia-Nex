"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ContentLine } from "@/components/i18n/content-line";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { artworkCoverUrl, categoryLabel, formatDate } from "@/lib/gallery/constants";
import type { GalleryArtworkEngagement } from "@/lib/gallery/get-gallery-feed-engagement";
import { awardUserExp } from "@/lib/exp/award-exp";
import { createClient } from "@/lib/supabase/client";
import type { ArtworkWithCreator } from "@/types/database";

type GalleryArtworkCardProps = {
  artwork: ArtworkWithCreator;
  engagement: GalleryArtworkEngagement;
  userId: string | null;
};

export function GalleryArtworkCard({
  artwork,
  engagement,
  userId,
}: GalleryArtworkCardProps) {
  const locale = useLocale();
  const t = useContent();
  const { engagement: copy, pages } = t;
  const router = useRouter();
  const detailHref = `/gallery/${artwork.id}`;
  const loginRedirect = detailHref;

  const [isFan, setIsFan] = useState(engagement.isFan);
  const [fanCount, setFanCount] = useState(engagement.fanCount);
  const [collabStatus, setCollabStatus] = useState(engagement.collabStatus);
  const [showCollabForm, setShowCollabForm] = useState(false);
  const [collabMessage, setCollabMessage] = useState("");
  const [loading, setLoading] = useState<"fan" | "collab" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const imageUrl = artworkCoverUrl(artwork);
  const actionButtonClass =
    "eldonia-btn-secondary px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-45";
  const creatorName =
    artwork.profiles?.display_name ??
    artwork.profiles?.username ??
    t.pages.creatorFallback;

  const collabPending = collabStatus === "pending";
  const collabStatusLabel = (status: string) =>
    copy.collabStatus[status] ?? status;

  function stopCardNav(event: React.MouseEvent | React.FormEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  async function toggleFan(event: React.MouseEvent<HTMLButtonElement>) {
    stopCardNav(event);
    if (!userId || engagement.isOwner) return;

    setError(null);
    setLoading("fan");
    const supabase = createClient();

    if (isFan) {
      const { error: deleteError } = await supabase
        .from("creator_fans")
        .delete()
        .eq("fan_id", userId)
        .eq("creator_id", artwork.creator_id);

      if (deleteError) {
        setError(deleteError.message);
        setLoading(null);
        return;
      }

      setIsFan(false);
      setFanCount((count) => Math.max(0, count - 1));
    } else {
      const { error: insertError } = await supabase.from("creator_fans").insert({
        fan_id: userId,
        creator_id: artwork.creator_id,
      });

      if (insertError) {
        setError(insertError.message);
        setLoading(null);
        return;
      }

      await awardUserExp(supabase, "fan.create", artwork.creator_id);
      setIsFan(true);
      setFanCount((count) => count + 1);
    }

    setLoading(null);
    router.refresh();
  }

  async function submitCollabRequest(event: React.FormEvent<HTMLFormElement>) {
    stopCardNav(event);
    if (!userId || engagement.isOwner) return;

    setError(null);
    setLoading("collab");
    const supabase = createClient();

    const { data, error: insertError } = await supabase
      .from("collab_requests")
      .insert({
        artwork_id: artwork.id,
        requester_id: userId,
        creator_id: artwork.creator_id,
        message: collabMessage.trim() || null,
      })
      .select("id, status")
      .single();

    if (insertError || !data) {
      setError(insertError?.message ?? copy.errCollab);
      setLoading(null);
      return;
    }

    await awardUserExp(supabase, "collab.request", data.id);
    setCollabStatus(data.status);
    setShowCollabForm(false);
    setCollabMessage("");
    setLoading(null);
    router.refresh();
  }

  return (
    <article className="eldonia-card gallery-artwork-card overflow-hidden p-0">
      <Link href={detailHref} className="group block">
        <div className="relative aspect-4/3 bg-eldonia-surface">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={artwork.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-medium uppercase tracking-wider text-eldonia-text-dim">
              {artwork.media_type}
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div>
          <p className="eldonia-eyebrow text-[0.65rem]">
            {categoryLabel(artwork.category, locale)}
          </p>
          <Link href={detailHref} className="block">
            <ContentLine
              text={artwork.title}
              locale={locale}
              as="h2"
              className="line-clamp-1 font-display font-semibold text-eldonia-gold-light hover:text-eldonia-gold"
              hintClassName="eldonia-localized-hint text-xs"
            />
          </Link>
          <p className="mt-1 text-sm text-eldonia-text-muted">{creatorName}</p>
          <p className="text-xs text-eldonia-text-dim">
            {formatDate(artwork.created_at, locale)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-eldonia-text-muted">
          <span>
            {pages.gallery.like} {engagement.likeCount.toLocaleString()}
          </span>
          <span aria-hidden>·</span>
          <span>{copy.fanCount(fanCount)}</span>
          <span aria-hidden>·</span>
          <span>
            EXP {engagement.creatorExp.toLocaleString()} · Lv.{engagement.creatorLevel}
          </span>
        </div>

        <div
          className="gallery-artwork-card__actions flex min-h-[1.875rem] flex-wrap items-center gap-2"
          onClick={stopCardNav}
          onKeyDown={(event) => event.stopPropagation()}
        >
          {engagement.isOwner ? (
            <>
              <button type="button" disabled className={actionButtonClass}>
                {copy.fanRegister}
              </button>
              <button type="button" disabled className={actionButtonClass}>
                {copy.collabRequest}
              </button>
            </>
          ) : !userId ? (
            <>
              <Link
                href={`/auth/login?redirect_to=${encodeURIComponent(loginRedirect)}`}
                className={actionButtonClass}
              >
                {copy.fanRegister}
              </Link>
              <Link
                href={`/auth/login?redirect_to=${encodeURIComponent(loginRedirect)}`}
                className={actionButtonClass}
              >
                {copy.collabRequest}
              </Link>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleFan}
                disabled={loading === "fan"}
                className={`${actionButtonClass} disabled:opacity-60 ${
                  isFan ? "border-eldonia-gold/60 text-eldonia-gold" : ""
                }`}
              >
                {loading === "fan"
                  ? copy.processing
                  : isFan
                    ? copy.fanRegistered
                    : copy.fanRegister}
              </button>

              {collabPending ? (
                <span className="eldonia-badge eldonia-badge-ready px-2 py-1 text-[0.65rem]">
                  {collabStatusLabel("pending")}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={(event) => {
                    stopCardNav(event);
                    setShowCollabForm((open) => !open);
                  }}
                  disabled={loading === "collab"}
                  className={`${actionButtonClass} disabled:opacity-60`}
                >
                  {copy.collabRequest}
                </button>
              )}
            </>
          )}
        </div>

        {showCollabForm && !collabPending && userId && !engagement.isOwner && (
          <form
            onSubmit={submitCollabRequest}
            className="space-y-2 border-t border-eldonia-gold/10 pt-3"
            onClick={stopCardNav}
          >
            <textarea
              rows={2}
              maxLength={1000}
              value={collabMessage}
              onChange={(event) => setCollabMessage(event.target.value)}
              placeholder={copy.collabMessagePlaceholder}
              className="eldonia-textarea text-xs"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={loading === "collab"}
                className="eldonia-btn-primary px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading === "collab" ? copy.collabSending : copy.collabSubmit}
              </button>
              <button
                type="button"
                onClick={(event) => {
                  stopCardNav(event);
                  setShowCollabForm(false);
                }}
                className="eldonia-btn-ghost px-3 py-1.5 text-xs"
              >
                {copy.cancel}
              </button>
            </div>
          </form>
        )}

        {collabStatus && !collabPending && !engagement.isOwner && (
          <p className="text-xs text-eldonia-text-muted">
            {copy.collabLabel(collabStatusLabel(collabStatus))}
          </p>
        )}

        {error && <p className="eldonia-alert-error text-xs">{error}</p>}
      </div>
    </article>
  );
}
