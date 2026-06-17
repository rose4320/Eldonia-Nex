import type { UiLocale } from "@/lib/i18n/locale";
import { intlDateTag } from "@/lib/i18n/taxonomy";

type StarRatingProps = {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  locale?: UiLocale;
  ratingAria?: (rating: number) => string;
};

function Star({ filled }: { filled: boolean }) {
  return (
    <span className={filled ? "eldonia-star" : "eldonia-star-empty"} aria-hidden>
      ★
    </span>
  );
}

export function StarRating({
  rating,
  reviewCount,
  size = "sm",
  locale = "ja",
  ratingAria,
}: StarRatingProps) {
  const full = Math.floor(rating);
  const textSize = size === "md" ? "text-base" : "text-sm";
  const ariaLabel = ratingAria?.(rating) ?? `Rating ${rating} / 5`;
  const countLocale = intlDateTag(locale);

  return (
    <div className={`flex flex-wrap items-center gap-1 ${textSize}`}>
      <span className="flex" aria-label={ariaLabel}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} filled={i <= full} />
        ))}
      </span>
      <span className="eldonia-link text-xs">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-xs text-[var(--eldonia-text-dim)]">
          ({reviewCount.toLocaleString(countLocale)})
        </span>
      )}
    </div>
  );
}
