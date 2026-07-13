"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { ArtworkAmbientBgm } from "@/components/gallery/artwork-ambient-bgm";
import { formatBadgeLabel } from "@/lib/gallery/creator-taxonomy";
import type { ArtworkFormat } from "@/types/database";

export type PhotoSlide = {
  id: string;
  page_index: number;
  media_url: string;
  caption: string | null;
};

type PhotoAlbumSlideshowProps = {
  title: string;
  format: ArtworkFormat;
  category: string;
  pageCount: number;
  slides: PhotoSlide[];
  bgmUrl?: string | null;
};

const AUTO_INTERVAL_MS = 4500;

export function PhotoAlbumSlideshow({
  title,
  format,
  category,
  pageCount,
  slides,
  bgmUrl,
}: PhotoAlbumSlideshowProps) {
  const locale = useLocale();
  const { pages: pageCopy } = useContent();
  const gallery = pageCopy.gallery;
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const total = slides.length;
  const current = slides[index] ?? slides[0];
  const badge = formatBadgeLabel(format, category, pageCount, locale);
  const playing = autoPlay && (!hovering || isFullscreen);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (total <= 0) return;
      const wrapped =
        ((nextIndex % total) + total) % total;
      if (wrapped === index) return;
      setIndex(wrapped);
    },
    [index, total],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (!playing || total <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value >= total - 1 ? 0 : value + 1));
    }, AUTO_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [playing, total]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
      if (event.key === " ") {
        event.preventDefault();
        setAutoPlay((value) => !value);
      }
      if (event.key === "Escape" && document.fullscreenElement) {
        void document.exitFullscreen();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  useEffect(() => {
    function onFullscreenChange() {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      if (active) setHovering(false);
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  async function toggleFullscreen() {
    const node = stageRef.current;
    if (!node) return;
    if (!document.fullscreenElement) {
      setHovering(false);
      await node.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }

  function onTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: React.TouchEvent) {
    const start = touchStartX.current;
    const end = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start == null || end == null) return;
    const delta = end - start;
    if (delta > 48) goPrev();
    if (delta < -48) goNext();
  }

  if (!current) return null;

  return (
    <section className="photo-slideshow space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 sm:px-6">
        <p className="photo-slideshow__heading text-sm">
          {gallery.photoSlideshowHeading}
          {badge && (
            <span className="ml-2 text-eldonia-text-muted">({badge})</span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-xs text-eldonia-text-muted">
            {gallery.pageIndicator(index + 1, total)}
          </p>
          <button
            type="button"
            onClick={() => setAutoPlay((value) => !value)}
            className="eldonia-btn-secondary px-2 py-1 text-xs"
            aria-pressed={autoPlay}
          >
            {autoPlay ? gallery.slideshowPause : gallery.slideshowPlay}
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="eldonia-btn-secondary px-2 py-1 text-xs"
          >
            {isFullscreen ? gallery.slideshowExitFullscreen : gallery.slideshowFullscreen}
          </button>
          {bgmUrl && <ArtworkAmbientBgm url={bgmUrl} active={playing} />}
        </div>
      </div>

      <div
        ref={stageRef}
        className={`photo-slideshow__stage relative overflow-hidden bg-black ${
          isFullscreen ? "flex min-h-screen items-center justify-center" : ""
        }`}
        onMouseEnter={() => {
          if (!isFullscreen) setHovering(true);
        }}
        onMouseLeave={() => setHovering(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={`${current.id}-${index}`}
          src={current.media_url}
          alt={`${title} — ${index + 1}`}
          className={`photo-slideshow__image w-full ${
            isFullscreen
              ? "max-h-screen object-contain"
              : "aspect-video max-h-[78vh] object-cover object-center"
          }`}
        />

        <div className="photo-slideshow__shade pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />

        {current.caption && (
          <p className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] px-6 pb-5 pt-16 text-center font-display text-base text-eldonia-gold-light sm:text-lg">
            {current.caption}
          </p>
        )}

        {isFullscreen && (
          <div className="photo-slideshow__fs-controls absolute inset-x-0 top-0 z-[2] flex items-center justify-between gap-2 bg-gradient-to-b from-black/70 to-transparent px-4 py-3">
            <p className="text-xs text-eldonia-gold-light">
              {gallery.pageIndicator(index + 1, total)}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAutoPlay((value) => !value)}
                className="eldonia-btn-secondary px-2 py-1 text-xs"
              >
                {autoPlay ? gallery.slideshowPause : gallery.slideshowPlay}
              </button>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="eldonia-btn-secondary px-2 py-1 text-xs"
              >
                {gallery.slideshowExitFullscreen}
              </button>
              {bgmUrl && <ArtworkAmbientBgm url={bgmUrl} active={playing} />}
            </div>
          </div>
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label={gallery.prevPage}
              className="photo-slideshow__nav photo-slideshow__nav--prev"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label={gallery.nextPage}
              className="photo-slideshow__nav photo-slideshow__nav--next"
            >
              ›
            </button>
          </>
        )}

        {playing && total > 1 && (
          <div className="photo-slideshow__progress absolute inset-x-0 bottom-0 z-[2] h-0.5 bg-eldonia-gold/25">
            <div
              key={`${index}-${playing}`}
              className="photo-slideshow__progress-bar h-full bg-eldonia-gold"
            />
          </div>
        )}
      </div>

      {!isFullscreen && total > 1 && (
        <div
          className="flex gap-2 overflow-x-auto px-4 pb-1 sm:px-6"
          aria-label={gallery.photoThumbStripAria}
        >
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(slideIndex)}
              aria-current={slideIndex === index ? "true" : undefined}
              className={`h-14 w-24 shrink-0 overflow-hidden rounded-md border-2 transition ${
                slideIndex === index
                  ? "border-eldonia-gold"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.media_url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
