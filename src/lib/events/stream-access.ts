import type { NexusEvent } from "@/types/database";

/** Minutes before start when the watch room opens. */
export const STREAM_OPEN_MINUTES_BEFORE = 15;

/** Grace after end (or inferred end) when join stays available. */
export const STREAM_CLOSE_MINUTES_AFTER = 30;

export type StreamAccessPhase = "before_window" | "open" | "ended" | "no_url";

export type StreamAccessState = {
  phase: StreamAccessPhase;
  opensAt: Date | null;
  closesAt: Date | null;
  canJoin: boolean;
};

function eventEndTime(event: Pick<NexusEvent, "starts_at" | "ends_at">): Date {
  if (event.ends_at) return new Date(event.ends_at);
  return new Date(new Date(event.starts_at).getTime() + 4 * 60 * 60 * 1000);
}

export function getStreamAccessState(
  event: Pick<NexusEvent, "starts_at" | "ends_at" | "online_url" | "format">,
  now = new Date(),
): StreamAccessState {
  if (event.format === "offline" || !event.online_url?.trim()) {
    return { phase: "no_url", opensAt: null, closesAt: null, canJoin: false };
  }

  const startsAt = new Date(event.starts_at);
  const endsAt = eventEndTime(event);
  const opensAt = new Date(startsAt.getTime() - STREAM_OPEN_MINUTES_BEFORE * 60 * 1000);
  const closesAt = new Date(endsAt.getTime() + STREAM_CLOSE_MINUTES_AFTER * 60 * 1000);

  if (now < opensAt) {
    return { phase: "before_window", opensAt, closesAt, canJoin: false };
  }
  if (now > closesAt) {
    return { phase: "ended", opensAt, closesAt, canJoin: false };
  }
  return { phase: "open", opensAt, closesAt, canJoin: true };
}

export function eventHasStream(event: Pick<NexusEvent, "format" | "online_url">): boolean {
  return (
    (event.format === "online" || event.format === "hybrid") &&
    Boolean(event.online_url?.trim())
  );
}
