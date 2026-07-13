import { formatLabel } from "@/lib/events/constants";
import type { EventFormat } from "@/types/database";
import type { UiLocale } from "@/lib/i18n/locale";

type EventFormatBadgeProps = {
  format: EventFormat;
  locale: UiLocale;
  className?: string;
};

export function EventFormatBadge({ format, locale, className = "" }: EventFormatBadgeProps) {
  const label = formatLabel(format, locale);
  const tone =
    format === "online"
      ? "border-[rgba(120,180,255,0.35)] bg-[rgba(80,140,220,0.12)] text-[#b8d4ff]"
      : format === "hybrid"
        ? "border-[rgba(201,168,76,0.35)] bg-[rgba(201,168,76,0.1)] text-[var(--eldonia-gold-light)]"
        : "border-[var(--eldonia-border)] bg-[var(--eldonia-surface)] text-[var(--eldonia-text-muted)]";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone} ${className}`}
    >
      {format === "online" && <span aria-hidden className="mr-1">📡</span>}
      {label}
    </span>
  );
}
