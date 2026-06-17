"use client";

import Link from "next/link";
import { useContent } from "@/components/providers/locale-provider";

const POST_ICONS = ["🖼", "⚱", "📜"] as const;

export function SettingsPostHub() {
  const { settingsUi } = useContent();
  const items = [
    { href: "/settings/post/artwork", ...settingsUi.postArtwork, icon: POST_ICONS[0] },
    { href: "/settings/post/product", ...settingsUi.postProduct, icon: POST_ICONS[1] },
    { href: "/settings/post/event", ...settingsUi.postEvent, icon: POST_ICONS[2] },
  ];

  return (
    <section id="posts" className="scroll-mt-24 space-y-4">
      <h2 className="eldonia-eyebrow">{settingsUi.postHubHeading}</h2>
      <p className="eldonia-body text-sm">{settingsUi.postHubLead}</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="eldonia-card group block transition hover:border-eldonia-gold/50"
          >
            <span className="text-2xl">{item.icon}</span>
            <p className="mt-3 font-display text-sm font-semibold text-eldonia-gold-light">
              {item.label}
            </p>
            <p className="eldonia-body mt-2 text-sm">{item.description}</p>
            <span className="eldonia-link mt-4 inline-block text-xs">{settingsUi.postHubGo}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
