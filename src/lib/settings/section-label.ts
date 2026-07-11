import type { SETTINGS_SECTIONS } from "@/lib/settings/constants";
import type { SettingsUiContent } from "@/lib/i18n/content/settings-ui-messages";
import type { PageMessages } from "@/lib/i18n/content/page-messages";

export function settingsSectionLabel(
  id: (typeof SETTINGS_SECTIONS)[number]["id"],
  settings: PageMessages["settings"],
  settingsUi: SettingsUiContent,
  fallback: string,
): string {
  switch (id) {
    case "basics":
      return settings.sectionBasics;
    case "posts":
      return settings.sectionPost;
    case "shop":
      return settingsUi.sectionShop;
    case "artworks":
      return settings.sectionArtworks;
    case "referral":
      return settingsUi.sectionReferral;
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
