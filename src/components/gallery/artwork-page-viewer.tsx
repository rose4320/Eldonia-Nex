"use client";

import { useCallback, useEffect, useState } from "react";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { PhotoAlbumSlideshow, type PhotoSlide } from "@/components/gallery/photo-album-slideshow";
import { ArtworkAmbientBgm } from "@/components/gallery/artwork-ambient-bgm";
import { formatBadgeLabel } from "@/lib/gallery/creator-taxonomy";
import type { ArtworkFormat, ArtworkPage } from "@/types/database";

type ArtworkPageViewerProps = {
  title: string;
  category: string;
  format: ArtworkFormat;
  pageCount: number;
  coverUrl: string | null;
  pages: ArtworkPage[];
  bgmUrl?: string | null;
};

function buildSlides(coverUrl: string | null, pages: ArtworkPage[]): PhotoSlide[] {
  const ordered: PhotoSlide[] = [];
  if (coverUrl) {
    ordered.push({
      id: "cover",
      page_index: 1,
      media_url: coverUrl,
      caption: null,
    });
  }
  for (const page of pages) {
    ordered.push({
      id: page.id,
      page_index: page.page_index,
      media_url: page.media_url,
      caption: page.caption,
    });
  }
  return ordered.sort((a, b) => a.page_index - b.page_index);
}

export function ArtworkPageViewer({
  title,
  category,
  format,
  pageCount,
  coverUrl,
  pages,
  bgmUrl,
}: ArtworkPageViewerProps) {
  const locale = useLocale();
  const { pages: pageCopy } = useContent();
  const gallery = pageCopy.gallery;
  const [index, setIndex] = useState(0);

  const ordered = buildSlides(coverUrl, pages);

  const goPrev = useCallback(() => {
    setIndex((value) => Math.max(0, value - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((value) => Math.min(ordered.length - 1, value + 1));
  }, [ordered.length]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  if (ordered.length === 0) return null;

  const isManga = category === "manga";
  const isPhotoAlbum = category === "photo" && ordered.length > 1;

  if (isPhotoAlbum) {
    return (
      <PhotoAlbumSlideshow
        title={title}
        format={format}
        category={category}
        pageCount={pageCount}
        slides={ordered}
        bgmUrl={bgmUrl}
      />
    );
  }

  const current = ordered[index] ?? ordered[0];
  const badge = formatBadgeLabel(format, category, pageCount, locale);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 sm:px-6">
        <p className="eldonia-label text-sm">
          {isManga ? gallery.mangaReaderHeading : gallery.pageViewerHeading}
          {badge && (
            <span className="ml-2 text-eldonia-text-muted">({badge})</span>
          )}
        </p>
        {ordered.length > 1 && (
          <p className="text-xs text-eldonia-text-muted">
            {gallery.pageIndicator(index + 1, ordered.length)}
          </p>
        )}
        {bgmUrl && <ArtworkAmbientBgm url={bgmUrl} />}
      </div>

      <div
        className={`bg-eldonia-surface ${isManga ? "max-h-[80vh] overflow-y-auto" : "overflow-hidden"}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current.id}
          src={current.media_url}
          alt={`${title} — ${index + 1}`}
          className={`w-full ${isManga ? "h-auto" : "max-h-[70vh] object-contain"}`}
        />
      </div>

      {current.caption && (
        <p className="px-4 text-sm text-eldonia-text-muted sm:px-6">{current.caption}</p>
      )}

      {ordered.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 px-4 pb-4 sm:px-6">
          <button
            type="button"
            onClick={goPrev}
            disabled={index === 0}
            className="eldonia-btn-secondary text-sm disabled:opacity-50"
          >
            {gallery.prevPage}
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={index >= ordered.length - 1}
            className="eldonia-btn-secondary text-sm disabled:opacity-50"
          >
            {gallery.nextPage}
          </button>
        </div>
      )}
    </section>
  );
}
