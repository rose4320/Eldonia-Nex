"use client";

import Link from "next/link";
import { useContent } from "@/components/providers/locale-provider";
import { SETTINGS_SECTIONS } from "@/lib/settings/constants";
import { settingsSectionLabel } from "@/lib/settings/section-label";

export function SettingsMobileNav() {
  const { pages, settingsUi } = useContent();

  return (
    <nav className="eldonia-settings-mobile-nav lg:hidden" aria-label={pages.settings.menuTitle}>
      <div className="eldonia-settings-mobile-nav__scroll">
        {SETTINGS_SECTIONS.map((section) => (
          <Link
            key={section.id}
            href={`#${section.id}`}
            className={`eldonia-settings-mobile-nav__chip${section.id === "referral" ? " eldonia-settings-mobile-nav__chip--accent" : ""}`}
          >
            {settingsSectionLabel(section.id, pages.settings, settingsUi, section.label)}
          </Link>
        ))}
      </div>
    </nav>
  );
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
              {settingsSectionLabel(section.id, pages.settings, settingsUi, section.label)}
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
