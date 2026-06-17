import { expProgress } from "@/lib/settings/constants";
import type { UiLocale } from "@/lib/i18n/locale";
import { uiMessage } from "@/lib/i18n/ui-messages";

type ExpBarCompactProps = {
  expPoints: number;
  titleBadge?: string | null;
  locale: UiLocale;
};

export function ExpBarCompact({ expPoints, titleBadge, locale }: ExpBarCompactProps) {
  const { level, current, needed, percent } = expProgress(expPoints);

  return (
    <div className="eldonia-exp-bar-compact">
      <div className="flex items-center justify-between gap-2 text-[0.65rem]">
        <span className="font-display font-semibold tracking-wide text-eldonia-gold-light">
          Lv.{level}
          {titleBadge && (
            <span className="ml-1 font-normal text-eldonia-text-muted">{titleBadge}</span>
          )}
        </span>
        <span className="text-eldonia-text-dim">
          EXP {expPoints.toLocaleString()} · {uiMessage(locale, "expNext")}{" "}
          {Math.max(0, needed - current)}
        </span>
      </div>
      <div className="eldonia-exp-track mt-1.5 h-1">
        <div className="eldonia-exp-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
