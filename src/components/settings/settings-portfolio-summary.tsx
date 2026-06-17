"use client";

import Link from "next/link";
import { useContent } from "@/components/providers/locale-provider";
import type { Portfolio } from "@/types/database";

type SettingsPortfolioSummaryProps = {
  portfolio: Portfolio | null;
};

export function SettingsPortfolioSummary({ portfolio }: SettingsPortfolioSummaryProps) {
  const { settingsUi } = useContent();
  const copy = settingsUi.portfolio;

  return (
    <section id="portfolio" className="scroll-mt-24 space-y-4">
      <h2 className="eldonia-eyebrow">{copy.heading}</h2>
      <div className="eldonia-card">
        {portfolio ? (
          <div className="space-y-3">
            <p className="font-display text-lg font-semibold text-eldonia-gold-light">
              {portfolio.headline || copy.headlineUnset}
            </p>
            <p className="eldonia-body text-sm">
              {portfolio.summary || copy.summaryEmpty}
            </p>
            {portfolio.skills.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {portfolio.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-eldonia-gold/20 px-3 py-1 text-xs text-eldonia-text-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            )}
            <p className="eldonia-hint text-xs">
              {copy.visibility(portfolio.visibility, portfolio.exp_points, portfolio.level)}
            </p>
          </div>
        ) : (
          <p className="eldonia-body text-sm">{copy.unset}</p>
        )}
        <Link href="/works/portfolio" className="eldonia-btn-secondary mt-4 inline-flex">
          {copy.edit}
        </Link>
      </div>
    </section>
  );
}
