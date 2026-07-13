import { localizedHint } from "@/lib/i18n/localized-hint";
import type { UiLocale } from "@/lib/i18n/locale";
import { normalizeNexusLocale } from "@/lib/nexus-translate/translate";

type ContentLineProps = {
  text: string;
  locale: UiLocale;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  hintClassName?: string;
  lineClamp?: 1 | 2 | 3;
};

function lineClampClass(lineClamp?: 1 | 2 | 3): string {
  if (lineClamp === 1) return "line-clamp-1";
  if (lineClamp === 2) return "line-clamp-2";
  if (lineClamp === 3) return "line-clamp-3";
  return "";
}

export function ContentLine({
  text,
  locale,
  as: Tag = "p",
  className,
  hintClassName = "eldonia-localized-hint",
  lineClamp,
}: ContentLineProps) {
  const translation = localizedHint(text, locale);
  const clampClass = lineClampClass(lineClamp);

  if (translation) {
    return (
      <div className="min-w-0">
        <Tag className={[className, clampClass].filter(Boolean).join(" ")}>
          {translation}
        </Tag>
        <p className={hintClassName}>({text})</p>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <Tag className={[className, clampClass].filter(Boolean).join(" ")}>
        {text}
      </Tag>
    </div>
  );
}

type TranslatedContentLineProps = ContentLineProps & {
  translatedText?: string | null;
  sourceLocale: string;
};

/** Cached Google translation first; original as hint. Falls back to ContentLine demo hint. */
export function TranslatedContentLine({
  text,
  translatedText,
  sourceLocale,
  locale,
  as: Tag = "p",
  className,
  hintClassName = "eldonia-localized-hint",
  lineClamp,
}: TranslatedContentLineProps) {
  const source = normalizeNexusLocale(sourceLocale);
  const ui = normalizeNexusLocale(locale);
  const clampClass = lineClampClass(lineClamp);

  // Prefer provided translation even when source locale equals UI
  // (e.g. curated EN→JA title while inferSourceLocale guessed wrong).
  const cached = translatedText?.trim();
  if (cached && cached !== text.trim()) {
    return (
      <div className="min-w-0">
        <Tag className={[className, clampClass].filter(Boolean).join(" ")}>
          {cached}
        </Tag>
        <p className={hintClassName}>({text})</p>
      </div>
    );
  }

  if (source === ui) {
    return (
      <div className="min-w-0">
        <Tag className={[className, clampClass].filter(Boolean).join(" ")}>
          {text}
        </Tag>
      </div>
    );
  }

  return (
    <ContentLine
      text={text}
      locale={locale}
      as={Tag}
      className={className}
      hintClassName={hintClassName}
      lineClamp={lineClamp}
    />
  );
}

type TagHintProps = {
  text: string;
  locale: UiLocale;
  className?: string;
};

/** タグ・スキル等のインライン表示: 訳 (原文) */
export function TagWithHint({ text, locale, className }: TagHintProps) {
  const translation = localizedHint(text, locale);
  if (translation) {
    return (
      <span className={className}>
        {translation}
        <span className="eldonia-localized-hint-inline"> ({text})</span>
      </span>
    );
  }
  return <span className={className}>{text}</span>;
}
