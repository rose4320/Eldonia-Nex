"use client";

import { useContent } from "@/components/providers/locale-provider";
import { GalleryArtworkCard } from "@/components/gallery/gallery-artwork-card";
import type { GalleryArtworkEngagement } from "@/lib/gallery/get-gallery-feed-engagement";
import type { ArtworkWithCreator } from "@/types/database";

type PublicGalleryFeedProps = {
  items: ArtworkWithCreator[];
  query?: string;
  engagementByArtwork: Record<string, GalleryArtworkEngagement>;
  userId: string | null;
};

export function PublicGalleryFeed({
  items,
  query,
  engagementByArtwork,
  userId,
}: PublicGalleryFeedProps) {
  const t = useContent();

  if (items.length === 0) {
    return (
      <section className="eldonia-card eldonia-card-dashed px-8 py-16 text-center">
        <p className="text-eldonia-text-muted">
          {query?.trim() ? t.gallery.emptySearch : t.gallery.empty}
        </p>
      </section>
    );
  }

  const defaultEngagement: GalleryArtworkEngagement = {
    fanCount: 0,
    likeCount: 0,
    creatorExp: 0,
    creatorLevel: 1,
    isFan: false,
    isLiked: false,
    collabStatus: null,
    isOwner: false,
    labAvailable: false,
  };

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((artwork) => (
        <GalleryArtworkCard
          key={artwork.id}
          artwork={artwork}
          engagement={engagementByArtwork[artwork.id] ?? defaultEngagement}
          userId={userId}
        />
      ))}
    </section>
  );
}
