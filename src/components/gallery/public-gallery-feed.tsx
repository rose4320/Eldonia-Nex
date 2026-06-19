"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ContentLine } from "@/components/i18n/content-line";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { categoryLabel, formatDate } from "@/lib/gallery/constants";
import { createClient } from "@/lib/supabase/client";
import type { ArtworkWithCreator } from "@/types/database";

type PublicGalleryFeedProps = {
  query?: string;
};

function previewUrl(artwork: ArtworkWithCreator): string | null {
  if (artwork.thumbnail_url) return artwork.thumbnail_url;
  if (artwork.media_type === "image") return artwork.media_url;
  return null;
}

export function PublicGalleryFeed({ query }: PublicGalleryFeedProps) {
  const locale = useLocale();
  const t = useContent();
  const [items, setItems] = useState<ArtworkWithCreator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadArtworks() {
      setLoading(true);
      const supabase = createClient();
      let dbQuery = supabase
        .from("artworks")
        .select(
          `
          *,
          profiles:creator_id (
            display_name,
            username,
            avatar_url
          )
        `,
        )
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(24);

      const term = query?.trim();
      if (term) {
        dbQuery = dbQuery.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
      }

      const { data } = await dbQuery;
      if (!cancelled) {
        setItems((data ?? []) as ArtworkWithCreator[]);
        setLoading(false);
      }
    }

    void loadArtworks();

    return () => {
      cancelled = true;
    };
  }, [query]);

  if (loading) {
    return (
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="eldonia-card animate-pulse p-0">
            <div className="aspect-4/3 bg-eldonia-surface-elevated" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-20 rounded bg-eldonia-gold/20" />
              <div className="h-4 w-3/4 rounded bg-eldonia-gold/10" />
              <div className="h-3 w-1/2 rounded bg-eldonia-gold/10" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="eldonia-card eldonia-card-dashed px-8 py-16 text-center">
        <p className="text-eldonia-text-muted">
          {query?.trim() ? t.gallery.emptySearch : t.gallery.empty}
        </p>
        <Link
          href="/auth/login?redirect_to=/settings/post/artwork"
          className="eldonia-link mt-4 inline-block text-sm font-medium"
        >
          {t.common.loginToPost}
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((artwork) => {
        const imageUrl = previewUrl(artwork);
        const creatorName =
          artwork.profiles?.display_name ??
          artwork.profiles?.username ??
          t.pages.creatorFallback;

        return (
          <Link
            key={artwork.id}
            href={`/gallery/${artwork.id}`}
            className="group eldonia-card overflow-hidden p-0 transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-4/3 bg-eldonia-surface">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={artwork.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-medium uppercase tracking-wider text-eldonia-text-dim">
                  {artwork.media_type}
                </div>
              )}
            </div>
            <div className="space-y-1 p-4">
              <p className="eldonia-eyebrow text-[0.65rem]">
                {categoryLabel(artwork.category, locale)}
              </p>
              <ContentLine
                text={artwork.title}
                locale={locale}
                as="h2"
                className="line-clamp-1 font-display font-semibold text-eldonia-gold-light"
                hintClassName="eldonia-localized-hint text-xs"
              />
              <p className="text-sm text-eldonia-text-muted">{creatorName}</p>
              <p className="text-xs text-eldonia-text-dim">
                {formatDate(artwork.created_at, locale)}
              </p>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
