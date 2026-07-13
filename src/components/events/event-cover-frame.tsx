import type { ReactNode } from "react";

type EventCoverFrameProps = {
  src?: string | null;
  alt?: string;
  placeholder?: ReactNode;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  variant?: "card" | "preview" | "hero";
};

/** 2:1 event cover frame — §5.1 */
export function EventCoverFrame({
  src,
  alt = "",
  placeholder,
  className = "",
  imgClassName = "",
  sizes,
  variant = "card",
}: EventCoverFrameProps) {
  const variantClass =
    variant === "hero"
      ? "eldonia-event-cover-hero"
      : variant === "preview"
        ? "eldonia-event-cover-preview"
        : "eldonia-event-cover-card";

  return (
    <div className={`eldonia-event-cover ${variantClass} ${className}`.trim()}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          className={`eldonia-event-cover__img ${imgClassName}`.trim()}
        />
      ) : (
        <div className="eldonia-event-cover__placeholder" aria-hidden>
          {placeholder ?? "◆"}
        </div>
      )}
    </div>
  );
}
