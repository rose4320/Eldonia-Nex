import Image from "next/image";
import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  hint?: string;
  action?: ReactNode;
  iconSrc?: string;
  iconAlt?: string;
};

/**
 * メインコンテンツ各ページ共通の見出し帯。
 * LP / Home と統一したブランド見出し（Cinzel の金グラデーション）を提供する。
 */
export function PageIntro({
  eyebrow,
  title,
  lead,
  hint,
  action,
  iconSrc,
  iconAlt = "",
}: PageIntroProps) {
  const iconRows = lead ? 3 : 2;

  return (
    <section className="flex flex-wrap items-end justify-between gap-4">
      {iconSrc ? (
        <div className="page-intro grid min-w-0 grid-cols-[auto_1fr] gap-x-4">
          <div
            className={`page-intro__icon-square page-intro__icon-square--rows-${iconRows}`}
            style={{ gridRow: `span ${iconRows}` }}
          >
            <Image
              src={iconSrc}
              alt={iconAlt}
              fill
              sizes="(max-width: 640px) 72px, 98px"
              className="object-contain"
            />
          </div>
          <p className="eldonia-eyebrow">{eyebrow}</p>
          <h1 className="eldonia-heading eldonia-heading-lg mt-1">{title}</h1>
          {lead && <p className="eldonia-body mt-2 text-sm">{lead}</p>}
          {hint && (
            <p className="eldonia-hint col-start-2 mt-2 text-xs">{hint}</p>
          )}
        </div>
      ) : (
        <div className="min-w-0">
          <p className="eldonia-eyebrow">{eyebrow}</p>
          <h1 className="eldonia-heading eldonia-heading-lg mt-1">{title}</h1>
          {lead && <p className="eldonia-body mt-2 text-sm">{lead}</p>}
          {hint && <p className="eldonia-hint mt-2 text-xs">{hint}</p>}
        </div>
      )}
      {action && <div className="shrink-0">{action}</div>}
    </section>
  );
}
