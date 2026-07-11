"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { categoryLabel, formatDate } from "@/lib/gallery/constants";
import type { UserArtworkSummary } from "@/lib/gallery/get-user-artworks";
import type { ArtworkMediaType } from "@/types/database";
import type { SettingsUiContent } from "@/lib/i18n/content/settings-ui-messages";

type SettingsArtworkManagementProps = {
  artworks: UserArtworkSummary[];
  isCreator: boolean;
};

function sellProductHref(artworkId: string) {
  return `/settings/post/product?from_artwork=${encodeURIComponent(artworkId)}`;
}

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

export function SettingsArtworkManagement({ artworks, isCreator }: SettingsArtworkManagementProps) {
  const router = useRouter();
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
      router.refresh();
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
          const thumb = artwork.thumbnail_url ?? artwork.media_url;
          const isPending = pendingId === artwork.id;

          return (
            <li key={artwork.id} className="eldonia-card flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href={`/gallery/${artwork.id}`}
                className="flex min-w-0 flex-1 items-center gap-4 transition hover:opacity-90"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-eldonia-border bg-eldonia-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm text-eldonia-gold-light">
                    {artwork.title}
                  </p>
                  <p className="mt-1 text-xs text-eldonia-text-muted">
                    {categoryLabel(artwork.category, locale)} · {formatDate(artwork.created_at, locale)}
                  </p>
                </div>
              </Link>

              <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                {isCreator && (
                  <Link
                    href={sellProductHref(artwork.id)}
                    className="eldonia-btn-primary text-sm"
                  >
                    {copy.sellOnShop}
                  </Link>
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
