import type { ReactNode } from "react";
import type { ArtworkWithCreator } from "@/types/database";
import { artworkCoverUrl } from "@/lib/gallery/constants";
import { GalleryMediaGuard } from "@/components/gallery/gallery-media-guard";
import { ArtworkAmbientBgm } from "@/components/gallery/artwork-ambient-bgm";

type ArtworkMediaHeroProps = {
  artwork: ArtworkWithCreator;
  openPdfLabel: string;
  /** Gallery 公開閲覧ではダウンロードを抑止 */
  protectDownload?: boolean;
  downloadNotice?: string;
};

export function ArtworkMediaHero({
  artwork,
  openPdfLabel,
  protectDownload = false,
  downloadNotice,
}: ArtworkMediaHeroProps) {
  const cover = artworkCoverUrl(artwork);
  const bgmUrl = artwork.media_type !== "audio" ? artwork.bgm_url : null;

  function wrap(content: ReactNode) {
    if (!protectDownload) return content;
    return <GalleryMediaGuard notice={downloadNotice}>{content}</GalleryMediaGuard>;
  }

  if (artwork.media_type === "image") {
    return wrap(
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artwork.media_url}
          alt={artwork.title}
          draggable={false}
          className="eldonia-gallery-media-protected__asset max-h-[70vh] w-full object-contain"
        />
        {bgmUrl && (
          <ArtworkAmbientBgm url={bgmUrl} className="absolute right-3 top-3 z-10" />
        )}
      </div>,
    );
  }

  if (artwork.media_type === "video") {
    return wrap(
      <div className="relative">
        <video
          src={artwork.media_url}
          controls
          controlsList={protectDownload ? "nodownload noremoteplayback" : undefined}
          disablePictureInPicture={protectDownload}
          poster={cover ?? undefined}
          className="eldonia-gallery-media-protected__asset max-h-[70vh] w-full bg-black"
        />
        {bgmUrl && (
          <ArtworkAmbientBgm url={bgmUrl} className="absolute right-3 top-3 z-10" />
        )}
      </div>,
    );
  }

  if (artwork.media_type === "audio") {
    return wrap(
      <div className="eldonia-audio-hero">
        <div className="eldonia-audio-hero__stage">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={artwork.title}
              draggable={false}
              className="eldonia-audio-hero__cover"
            />
          ) : (
            <div className="eldonia-audio-hero__cover eldonia-audio-hero__cover--empty" aria-hidden>
              <span>♪</span>
            </div>
          )}
        </div>
        <div className="eldonia-audio-hero__player">
          <audio
            src={artwork.media_url}
            controls
            controlsList={protectDownload ? "nodownload" : undefined}
            preload="metadata"
            className="w-full"
          >
            {artwork.title}
          </audio>
        </div>
      </div>,
    );
  }

  if (artwork.media_type === "document") {
    if (protectDownload) {
      return wrap(
        <div className="eldonia-doc-hero">
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt={artwork.title} draggable={false} className="eldonia-doc-hero__cover" />
          )}
          <iframe
            src={`${artwork.media_url}#toolbar=0&navpanes=0`}
            title={artwork.title}
            className="h-[min(70vh,42rem)] w-full rounded-md border border-eldonia-border bg-eldonia-surface"
          />
        </div>,
      );
    }

    return (
      <div className="eldonia-doc-hero">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={artwork.title} className="eldonia-doc-hero__cover" />
        )}
        <a
          href={artwork.media_url}
          target="_blank"
          rel="noopener noreferrer"
          className="eldonia-btn-primary"
        >
          {openPdfLabel}
        </a>
      </div>
    );
  }

  return null;
}
