import { localizedHint } from "@/lib/i18n/localized-hint";
import type { UiLocale } from "@/lib/i18n/locale";

type ContentLineProps = {
  text: string;
  locale: UiLocale;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  hintClassName?: string;
  lineClamp?: 1 | 2 | 3;
};

export function ContentLine({
  text,
  locale,
  as: Tag = "p",
  className,
  hintClassName = "eldonia-localized-hint",
  lineClamp,
}: ContentLineProps) {
  const hint = localizedHint(text, locale);
  const clampClass =
    lineClamp === 1
      ? "line-clamp-1"
      : lineClamp === 2
        ? "line-clamp-2"
        : lineClamp === 3
          ? "line-clamp-3"
          : "";

  return (
    <div className="min-w-0">
      <Tag className={[className, clampClass].filter(Boolean).join(" ")}>
        {text}
      </Tag>
      {hint && <p className={hintClassName}>({hint})</p>}
    </div>
  );
}

type TagHintProps = {
  text: string;
  locale: UiLocale;
  className?: string;
};

/** タグ・スキル等のインライン表示: 原文 (訳) */
export function TagWithHint({ text, locale, className }: TagHintProps) {
  const hint = localizedHint(text, locale);
  return (
    <span className={className}>
      {text}
      {hint && (
        <span className="eldonia-localized-hint-inline"> ({hint})</span>
      )}
    </span>
  );
}
