"use client";

import dynamic from "next/dynamic";

const ArtworkModelViewerInner = dynamic(
  () =>
    import("@/components/gallery/artwork-model-viewer-inner").then(
      (mod) => mod.ArtworkModelViewerInner,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="eldonia-model-viewer flex items-center justify-center text-sm text-eldonia-muted"
        aria-busy="true"
        aria-label="Loading 3D model"
      />
    ),
  },
);

type ArtworkModelViewerProps = {
  src: string;
  poster?: string | null;
  title: string;
  className?: string;
};

export function ArtworkModelViewer(props: ArtworkModelViewerProps) {
  return <ArtworkModelViewerInner {...props} />;
}
