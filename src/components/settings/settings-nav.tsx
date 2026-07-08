"use client";

import Link from "next/link";
import { useContent } from "@/components/providers/locale-provider";
import { SETTINGS_SECTIONS } from "@/lib/settings/constants";

function sectionLabel(
  id: (typeof SETTINGS_SECTIONS)[number]["id"],
  settings: ReturnType<typeof useContent>["pages"]["settings"],
  settingsUi: ReturnType<typeof useContent>["settingsUi"],
  fallback: string,
): string {
  switch (id) {
    case "basics":
      return settings.sectionBasics;
    case "posts":
      return settings.sectionPost;
    case "artworks":
      return settings.sectionArtworks;
    case "portfolio":
      return settings.sectionPortfolio;
    case "finance":
      return settings.sectionFinance;
    case "notifications":
      return settings.sectionNotifications;
    case "recommendations":
      return settingsUi.sectionRecommendations;
    default:
      return fallback;
  }
}

export function SettingsNav() {
  const { pages, chrome, settingsUi } = useContent();

  return (
    <nav className="eldonia-settings-nav hidden lg:block">
      <p className="eldonia-eyebrow mb-3 text-[0.65rem]">{pages.settings.menuTitle}</p>
      <ul className="space-y-1">
        {SETTINGS_SECTIONS.map((section) => (
          <li key={section.id}>
            <Link href={`#${section.id}`} className="eldonia-settings-nav-link">
              {sectionLabel(section.id, pages.settings, settingsUi, section.label)}
            </Link>
          </li>
        ))}
        <li className="pt-2">
          <form action="/auth/sign-out" method="post">
            <button type="submit" className="eldonia-settings-nav-link w-full text-left">
              {chrome.logout}
            </button>
          </form>
        </li>
      </ul>
    </nav>
  );
}
