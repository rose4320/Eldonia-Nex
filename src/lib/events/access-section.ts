import type { EventFormat } from "@/types/database";

type AccessSectionLabels = {
  venueSection: string;
  streamAccessSection: string;
  hybridAccessSection: string;
};

export function eventAccessSectionTitle(
  format: EventFormat,
  labels: AccessSectionLabels,
): string {
  switch (format) {
    case "online":
      return labels.streamAccessSection;
    case "hybrid":
      return labels.hybridAccessSection;
    default:
      return labels.venueSection;
  }
}
