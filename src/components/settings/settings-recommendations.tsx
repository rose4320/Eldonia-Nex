"use client";

import Link from "next/link";
import { useContent } from "@/components/providers/locale-provider";
import type { SettingsRecommendation } from "@/lib/settings/constants";

type SettingsRecommendationsProps = {
  items: SettingsRecommendation[];
};

export function SettingsRecommendations({ items }: SettingsRecommendationsProps) {
  const { settingsUi } = useContent();

  if (items.length === 0) return null;

  return (
    <section id="recommendations" className="scroll-mt-24">
      <h2 className="eldonia-eyebrow">{settingsUi.recommendationsHeading}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="eldonia-card group block transition hover:border-eldonia-gold/50"
          >
            <p className="font-display text-sm font-semibold text-eldonia-gold-light group-hover:text-eldonia-gold">
              {item.title}
            </p>
            <p className="eldonia-body mt-2 text-sm">{item.description}</p>
            <span className="eldonia-link mt-3 inline-block text-xs">
              {settingsUi.recommendationsGo}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
