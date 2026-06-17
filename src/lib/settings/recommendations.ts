import type { SettingsRecommendation } from "@/lib/settings/constants";
import type { SettingsUiContent } from "@/lib/i18n/content/settings-ui-messages";

type RecommendationInput = {
  artworkCount: number;
  productCount: number;
  eventCount: number;
  hasPortfolio: boolean;
  basicsComplete: boolean;
  unreadNotifications: number;
  openTickets: number;
  isCreator: boolean;
};

export function buildRecommendations(
  input: RecommendationInput,
  copy: SettingsUiContent["recommendations"],
): SettingsRecommendation[] {
  const items: SettingsRecommendation[] = [];

  if (!input.basicsComplete) {
    items.push({
      id: "basics",
      title: copy.basics.title,
      description: copy.basics.description,
      href: "/settings#basics",
      priority: 1,
    });
  }

  if (input.artworkCount === 0) {
    items.push({
      id: "artwork",
      title: copy.artwork.title,
      description: copy.artwork.description,
      href: "/settings/post/artwork",
      priority: 2,
    });
  }

  if (!input.hasPortfolio) {
    items.push({
      id: "portfolio",
      title: copy.portfolio.title,
      description: copy.portfolio.description,
      href: "/settings#portfolio",
      priority: 3,
    });
  }

  if (input.isCreator && input.productCount === 0) {
    items.push({
      id: "product",
      title: copy.product.title,
      description: copy.product.description,
      href: "/settings/post/product",
      priority: 4,
    });
  }

  if (input.eventCount === 0) {
    items.push({
      id: "event",
      title: copy.event.title,
      description: copy.event.description,
      href: "/settings/post/event",
      priority: 5,
    });
  }

  if (input.unreadNotifications > 0) {
    items.push({
      id: "notifications",
      title: copy.unread(input.unreadNotifications),
      description: copy.unreadDesc,
      href: "/settings#notifications",
      priority: 6,
    });
  }

  if (input.openTickets > 0) {
    items.push({
      id: "tickets",
      title: copy.tickets(input.openTickets),
      description: copy.ticketsDesc,
      href: "/help/tickets",
      priority: 7,
    });
  }

  if (items.length === 0) {
    items.push({
      id: "explore",
      title: copy.explore.title,
      description: copy.explore.description,
      href: "/community",
      priority: 99,
    });
  }

  return items.sort((a, b) => a.priority - b.priority).slice(0, 4);
}
