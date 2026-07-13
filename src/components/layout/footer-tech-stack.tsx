"use client";

import {
  FOOTER_TECH_CATEGORIES,
  localizedTechCategoryLabel,
} from "@/lib/layout/footer-tech-stack";
import type { UiLocale } from "@/lib/i18n/locale";

type FooterTechStackProps = {
  locale: UiLocale;
};

/**
 * Frontend Manager — categorized tech stack.
 * Disclosure chevron is always on the LEFT of the category label.
 */
export function FooterTechStack({ locale }: FooterTechStackProps) {
  return (
    <div className="eldonia-footer-tech mt-4 space-y-1">
      {FOOTER_TECH_CATEGORIES.map((category) => (
        <details
          key={category.id}
          className="eldonia-footer-tech__group"
          open={category.id === "frontend" || category.id === "data"}
        >
          <summary className="eldonia-footer-tech__summary">
            <span className="eldonia-footer-tech__chevron" aria-hidden>
              ▾
            </span>
            <span className="eldonia-footer-tech__label">
              {localizedTechCategoryLabel(category.label, locale)}
            </span>
          </summary>
          <ul className="eldonia-footer-tech__list">
            {category.items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eldonia-link text-sm text-eldonia-text-muted hover:text-[#f0c978]"
                >
                  {item.name}
                  <span className="sr-only">
                    {locale === "ja"
                      ? "（新しいタブで開く）"
                      : locale === "ko"
                        ? " (새 탭에서 열림)"
                        : locale === "zh-CN"
                          ? "（在新标签页打开）"
                          : " (opens in a new tab)"}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
