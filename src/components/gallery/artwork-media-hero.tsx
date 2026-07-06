import type { ArtworkWithCreator } from "@/types/database";
import { artworkCoverUrl } from "@/lib/gallery/constants";

type ArtworkMediaHeroProps = {
  artwork: ArtworkWithCreator;
  openPdfLabel: string;
};

export function ArtworkMediaHero({ artwork, openPdfLabel }: ArtworkMediaHeroProps) {
  const cover = artworkCoverUrl(artwork);

  if (artwork.media_type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={artwork.media_url}
        alt={artwork.title}
        className="max-h-[70vh] w-full object-contain"
      />
    );
  }

  if (artwork.media_type === "video") {
    return (
      <video
        src={artwork.media_url}
        controls
        poster={cover ?? undefined}
        className="max-h-[70vh] w-full bg-black"
      />
    );
  }

  if (artwork.media_type === "audio") {
    return (
      <div className="eldonia-audio-hero">
        <div className="eldonia-audio-hero__stage">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={artwork.title}
              className="eldonia-audio-hero__cover"
            />
          ) : (
            <div className="eldonia-audio-hero__cover eldonia-audio-hero__cover--empty" aria-hidden>
              <span>♪</span>
            </div>
          )}
        </div>
        <div className="eldonia-audio-hero__player">
          <audio src={artwork.media_url} controls preload="metadata" className="w-full">
            {artwork.title}
          </audio>
        </div>
      </div>
    );
  }

  if (artwork.media_type === "document") {
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
