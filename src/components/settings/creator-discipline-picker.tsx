"use client";

import { useLocale } from "@/components/providers/locale-provider";
import {
  CREATOR_DISCIPLINE_VALUES,
  disciplineLabel,
  sanitizeDisciplines,
  type CreatorDiscipline,
} from "@/lib/gallery/creator-taxonomy";

type CreatorDisciplinePickerProps = {
  value: string[];
  onChange: (next: CreatorDiscipline[]) => void;
  label: string;
  hint: string;
};

export function CreatorDisciplinePicker({
  value,
  onChange,
  label,
  hint,
}: CreatorDisciplinePickerProps) {
  const locale = useLocale();
  const selected = new Set(sanitizeDisciplines(value));

  function toggle(discipline: CreatorDiscipline) {
    const next = new Set(selected);
    if (next.has(discipline)) {
      next.delete(discipline);
    } else if (next.size < 4) {
      next.add(discipline);
    }
    onChange(sanitizeDisciplines([...next]));
  }

  return (
    <fieldset className="space-y-2">
      <legend className="eldonia-label">{label}</legend>
      <p className="eldonia-hint text-xs">{hint}</p>
      <div className="flex flex-wrap gap-2">
        {CREATOR_DISCIPLINE_VALUES.map((discipline) => {
          const active = selected.has(discipline);
          return (
            <button
              key={discipline}
              type="button"
              onClick={() => toggle(discipline)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                active
                  ? "border-eldonia-gold/60 bg-eldonia-gold/15 text-eldonia-gold-light"
                  : "border-eldonia-border text-eldonia-text-muted hover:border-eldonia-gold/40"
              }`}
              aria-pressed={active}
            >
              {disciplineLabel(discipline, locale)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
