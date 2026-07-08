"use client";

import { useContent } from "@/components/providers/locale-provider";
import type { ArtworkMediaType } from "@/types/database";

type LabArtworkDownloadsProps = {
  artworkId: string;
  title: string;
  mediaType: ArtworkMediaType;
  hasThumbnail: boolean;
};

export function LabArtworkDownloads({
  artworkId,
  title,
  mediaType,
  hasThumbnail,
}: LabArtworkDownloadsProps) {
  const { engagement } = useContent();
  const copy = engagement.lab;

  const mediaLabel =
    mediaType === "document"
      ? copy.downloadPdf
      : mediaType === "audio"
        ? copy.downloadAudio
        : mediaType === "video"
          ? copy.downloadVideo
          : copy.downloadImage;

  return (
    <section className="eldonia-card space-y-3">
      <div>
        <h2 className="eldonia-label">{copy.downloadHeading}</h2>
        <p className="eldonia-body mt-1 text-sm text-eldonia-text-muted">{copy.downloadLead}</p>
      </div>
      <ul className="flex flex-wrap gap-2">
        <li>
          <a
            href={`/api/gallery/artworks/${artworkId}/download?file=media`}
            className="eldonia-btn-primary text-sm"
            download
          >
            {mediaLabel}
          </a>
        </li>
        {hasThumbnail && (
          <li>
            <a
              href={`/api/gallery/artworks/${artworkId}/download?file=thumbnail`}
              className="eldonia-btn-secondary text-sm"
              download
            >
              {copy.downloadThumbnail}
            </a>
          </li>
        )}
      </ul>
      <p className="eldonia-hint text-xs">
        {copy.downloadArtworkTitle(title)}
      </p>
    </section>
  );
}
