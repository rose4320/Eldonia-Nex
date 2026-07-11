"use client";

import "@google/model-viewer";

type ArtworkModelViewerInnerProps = {
  src: string;
  poster?: string | null;
  title: string;
  className?: string;
};

export function ArtworkModelViewerInner({
  src,
  poster,
  title,
  className = "",
}: ArtworkModelViewerInnerProps) {
  return (
    <model-viewer
      src={src}
      poster={poster ?? undefined}
      alt={title}
      crossorigin="anonymous"
      camera-controls
      auto-rotate
      shadow-intensity="1"
      exposure="1"
      loading="eager"
      className={`eldonia-model-viewer ${className}`.trim()}
    />
  );
}
