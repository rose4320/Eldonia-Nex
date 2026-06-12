type StarRatingProps = {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
};

function Star({ filled }: { filled: boolean }) {
  return (
    <span className={filled ? "eldonia-star" : "eldonia-star-empty"} aria-hidden>
      ★
    </span>
  );
}

export function StarRating({ rating, reviewCount, size = "sm" }: StarRatingProps) {
  const full = Math.floor(rating);
  const textSize = size === "md" ? "text-base" : "text-sm";

  return (
    <div className={`flex flex-wrap items-center gap-1 ${textSize}`}>
      <span className="flex" aria-label={`評価 ${rating} / 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} filled={i <= full} />
        ))}
      </span>
      <span className="eldonia-link text-xs">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-xs text-[var(--eldonia-text-dim)]">
          ({reviewCount.toLocaleString("ja-JP")})
        </span>
      )}
    </div>
  );
}
