"use client";

import { useContent, useLocale } from "@/components/providers/locale-provider";
import { intlLocale } from "@/lib/i18n/content/messages";
import { expProgress } from "@/lib/settings/constants";

type ExpBarProps = {
  expPoints: number;
  titleBadge?: string | null;
};

export function ExpBar({ expPoints, titleBadge }: ExpBarProps) {
  const locale = useLocale();
  const { settingsUi } = useContent();
  const { level, current, needed, percent } = expProgress(expPoints);
  const numberLocale = intlLocale(locale);

  return (
    <div className="eldonia-exp-bar">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="eldonia-eyebrow text-[0.65rem]">Nexus Level</p>
          <p className="font-display text-2xl font-bold text-eldonia-gold-light">
            Lv.{level}
            {titleBadge && (
              <span className="ml-2 text-sm font-normal text-eldonia-text-muted">
                {titleBadge}
              </span>
            )}
          </p>
        </div>
        <p className="eldonia-hint text-xs">
          EXP {expPoints.toLocaleString(numberLocale)} / {settingsUi.expNext}{" "}
          {needed - current}
        </p>
      </div>
      <div className="eldonia-exp-track mt-3">
        <div className="eldonia-exp-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
