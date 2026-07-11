"use client";

import Link from "next/link";
import { useState } from "react";
import { ArtworkSellOnShopButton } from "@/components/settings/artwork-sell-on-shop-button";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { getPublicSiteUrl } from "@/lib/auth/site-url";
import { categoryLabel, formatDate } from "@/lib/gallery/constants";
import type { UserArtworkSummary } from "@/lib/gallery/get-user-artworks";
import type { ArtworkMediaType } from "@/types/database";
import type { SettingsUiContent } from "@/lib/i18n/content/settings-ui-messages";

type SettingsArtworkManagementProps = {
  artworks: UserArtworkSummary[];
  isCreator: boolean;
  siteUrl: string;
};

function mediaDownloadLabel(
  mediaType: ArtworkMediaType,
  copy: SettingsUiContent["artworkManagement"],
) {
  if (mediaType === "document") return copy.downloadPdf;
  if (mediaType === "model") return copy.downloadModel;
  if (mediaType === "audio") return copy.downloadAudio;
  if (mediaType === "video") return copy.downloadVideo;
  return copy.downloadImage;
}

function artworkPublicUrl(artworkId: string, siteOrigin: string) {
  return `${getPublicSiteUrl(siteOrigin)}/gallery/${artworkId}`;
}

function ArtworkPublicUrl({
  artworkId,
  copy,
  siteOrigin,
}: {
  artworkId: string;
  copy: SettingsUiContent["artworkManagement"];
  siteOrigin: string;
}) {
  const [copied, setCopied] = useState(false);
  const url = artworkPublicUrl(artworkId, siteOrigin);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
      <span className="text-[10px] uppercase tracking-wide text-eldonia-text-muted">
        {copy.urlLabel}
      </span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="min-w-0 truncate font-mono text-xs text-eldonia-gold-light/80 hover:underline"
        title={url}
      >
        {url}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="eldonia-link shrink-0 text-xs"
      >
        {copied ? copy.urlCopied : copy.copyUrl}
      </button>
    </div>
  );
}

function artworkListThumb(artwork: UserArtworkSummary): string | null {
  if (artwork.thumbnail_url) return artwork.thumbnail_url;
  if (artwork.media_type === "image") return artwork.media_url;
  return null;
}

export function SettingsArtworkManagement({
  artworks,
  isCreator,
  siteUrl,
}: SettingsArtworkManagementProps) {
  const locale = useLocale();
  const { settingsUi } = useContent();
  const copy = settingsUi.artworkManagement;
  const [items, setItems] = useState(artworks);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggleVisibility(artwork: UserArtworkSummary) {
    setError(null);
    setPendingId(artwork.id);

    const nextIsPublic = !artwork.is_public;

    try {
      const response = await fetch(`/api/gallery/artworks/${artwork.id}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_public: nextIsPublic }),
      });

      const payload = (await response.json()) as { error?: string; is_public?: boolean };

      if (!response.ok) {
        setError(payload.error ?? copy.err);
        setPendingId(null);
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.id === artwork.id
            ? { ...item, is_public: payload.is_public ?? nextIsPublic }
            : item,
        ),
      );
    } catch {
      setError(copy.err);
    }

    setPendingId(null);
  }

  if (items.length === 0) {
    return (
      <section id="artworks" className="scroll-mt-24 space-y-4">
        <h2 className="eldonia-eyebrow">{copy.heading}</h2>
        <p className="eldonia-body text-sm">{copy.lead}</p>
        <div className="eldonia-card space-y-3">
          <p className="eldonia-body text-sm text-eldonia-text-muted">{copy.empty}</p>
          <Link href="/settings/post/artwork" className="eldonia-link text-sm">
            {copy.postLink}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section id="artworks" className="scroll-mt-24 space-y-4">
      <h2 className="eldonia-eyebrow">{copy.heading}</h2>
      <p className="eldonia-body text-sm">{copy.lead}</p>

      <ul className="space-y-3">
        {items.map((artwork) => {
          const thumb = artworkListThumb(artwork);
          const isPending = pendingId === artwork.id;

          return (
            <li key={artwork.id} className="eldonia-card flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <Link
                  href={`/gallery/${artwork.id}`}
                  className="shrink-0 transition hover:opacity-90"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-md border border-eldonia-border bg-eldonia-surface">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center px-1 text-center text-[10px] text-eldonia-text-muted">
                        {categoryLabel(artwork.category, locale)}
                      </div>
                    )}
                  </div>
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/gallery/${artwork.id}`}
                    className="block transition hover:opacity-90"
                  >
                    <p className="truncate font-display text-sm text-eldonia-gold-light">
                      {artwork.title}
                    </p>
                    <p className="mt-1 text-xs text-eldonia-text-muted">
                      {categoryLabel(artwork.category, locale)} · {formatDate(artwork.created_at, locale)}
                    </p>
                  </Link>
                  <ArtworkPublicUrl
                    artworkId={artwork.id}
                    copy={copy}
                    siteOrigin={siteUrl}
                  />
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end sm:pt-1">
                {isCreator && (
                  <ArtworkSellOnShopButton
                    artworkId={artwork.id}
                    shopProductId={artwork.shop_product_id}
                    onListed={(productId) => {
                      setItems((current) =>
                        current.map((item) =>
                          item.id === artwork.id
                            ? { ...item, shop_product_id: productId }
                            : item,
                        ),
                      );
                    }}
                  />
                )}
                <a
                  href={`/api/gallery/artworks/${artwork.id}/download?file=media`}
                  className="eldonia-btn-secondary text-sm"
                  download
                >
                  {mediaDownloadLabel(artwork.media_type, copy)}
                </a>
                {artwork.thumbnail_url && (
                  <a
                    href={`/api/gallery/artworks/${artwork.id}/download?file=thumbnail`}
                    className="eldonia-btn-secondary text-sm"
                    download
                  >
                    {copy.downloadThumbnail}
                  </a>
                )}
                <span
                  className={`eldonia-badge px-3 py-1 text-xs ${
                    artwork.is_public
                      ? "eldonia-badge-ready"
                      : "border-eldonia-border text-eldonia-text-muted"
                  }`}
                >
                  {artwork.is_public ? copy.publicBadge : copy.privateBadge}
                </span>
                <button
                  type="button"
                  onClick={() => toggleVisibility(artwork)}
                  disabled={isPending}
                  className="eldonia-btn-secondary text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending
                    ? copy.processing
                    : artwork.is_public
                      ? copy.unpublish
                      : copy.republish}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {error && <p className="eldonia-alert-error text-sm">{error}</p>}
    </section>
  );
}
