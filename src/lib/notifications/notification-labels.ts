import type { UserNotification } from "@/types/database";
import type { UiLocale } from "@/lib/i18n/locale";
import {
  notificationFilterLabel,
  notificationKindLabel as kindLabel,
} from "@/lib/i18n/taxonomy";

export type NotificationKind = UserNotification["kind"];

export function notificationKindLabel(
  kind: NotificationKind | string,
  locale: UiLocale = "ja",
): string {
  return kindLabel(kind, locale);
}

export const NOTIFICATION_FILTER_VALUES = [
  "all",
  "collab",
  "engagement",
  "announcement",
  "system",
] as const;

export type NotificationFilter = (typeof NOTIFICATION_FILTER_VALUES)[number];

export function notificationFilterOptions(locale: UiLocale) {
  return NOTIFICATION_FILTER_VALUES.map((value) => ({
    value,
    label: notificationFilterLabel(value, locale),
  }));
}

export function matchesNotificationFilter(
  kind: NotificationKind | string,
  filter: NotificationFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "collab") {
    return kind.startsWith("collab_");
  }
  if (filter === "engagement") {
    return (
      kind === "fan_registered" ||
      kind === "artwork_liked" ||
      kind === "artwork_commented" ||
      kind === "lab_post"
    );
  }
  if (filter === "announcement") {
    return kind === "announcement";
  }
  if (filter === "system") {
    return kind === "order_paid" || kind === "support_reply" || kind === "notification";
  }
  return true;
}
