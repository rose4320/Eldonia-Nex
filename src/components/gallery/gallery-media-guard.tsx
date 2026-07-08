"use client";

import type { ReactNode } from "react";

type GalleryMediaGuardProps = {
  children: ReactNode;
  notice?: string;
};

/** Gallery 閲覧用 — 右クリック保存などを抑止（完全防止ではない） */
export function GalleryMediaGuard({ children, notice }: GalleryMediaGuardProps) {
  return (
    <div
      className="eldonia-gallery-media-protected"
      onContextMenu={(event) => event.preventDefault()}
      role="presentation"
    >
      {children}
      {notice && (
        <p className="eldonia-hint mt-2 text-center text-xs">{notice}</p>
      )}
    </div>
  );
}
