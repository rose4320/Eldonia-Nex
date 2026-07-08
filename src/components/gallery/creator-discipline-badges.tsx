"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { disciplineLabel } from "@/lib/gallery/creator-taxonomy";

type CreatorDisciplineBadgesProps = {
  disciplines: string[] | null | undefined;
  max?: number;
  className?: string;
};

export function CreatorDisciplineBadges({
  disciplines,
  max = 2,
  className = "",
}: CreatorDisciplineBadgesProps) {
  const locale = useLocale();
  const values = (disciplines ?? []).slice(0, max);
  if (values.length === 0) return null;

  return (
    <span className={`inline-flex flex-wrap gap-1 ${className}`}>
      {values.map((value) => (
        <span
          key={value}
          className="eldonia-badge border-eldonia-gold/25 px-2 py-0.5 text-[0.65rem] text-eldonia-gold-light"
        >
          {disciplineLabel(value, locale)}
        </span>
      ))}
    </span>
  );
}
