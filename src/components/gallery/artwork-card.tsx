import Link from "next/link";
import type { ArtworkWithCreator } from "@/types/database";
import { ContentLine } from "@/components/i18n/content-line";
import { categoryLabel, formatDate } from "@/lib/gallery/constants";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";

type ArtworkCardProps = {
  artwork: ArtworkWithCreator;
};

function previewUrl(artwork: ArtworkWithCreator): string | null {
  if (artwork.thumbnail_url) return artwork.thumbnail_url;
  if (artwork.media_type === "image") return artwork.media_url;
  return null;
}

export async function ArtworkCard({ artwork }: ArtworkCardProps) {
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const imageUrl = previewUrl(artwork);
  const creatorName =
    artwork.profiles?.display_name ??
    artwork.profiles?.username ??
    pages.creatorFallback;

  return (
    <Link
      href={`/gallery/${artwork.id}`}
      className="group eldonia-card overflow-hidden p-0 transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-eldonia-surface">
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
}
