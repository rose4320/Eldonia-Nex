"use client";

import { useEffect } from "react";

type ArtworkModelViewerProps = {
  src: string;
  poster?: string | null;
  title: string;
  className?: string;
};

export function ArtworkModelViewer({
  src,
  poster,
  title,
  className = "",
}: ArtworkModelViewerProps) {
  useEffect(() => {
    void import("@google/model-viewer");
  }, []);

  return (
    <model-viewer
      src={src}
      poster={poster ?? undefined}
      alt={title}
      camera-controls
      auto-rotate
      shadow-intensity="1"
      exposure="1"
      loading="lazy"
      className={`eldonia-model-viewer ${className}`.trim()}
    />
  );
}
