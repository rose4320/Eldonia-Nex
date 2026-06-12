import { createClient } from "@/lib/supabase/server";
import type { NexusEventWithOrganizer } from "@/types/database";
import { isPastEvent } from "./constants";
import { SAMPLE_EVENTS } from "./sample-events";

type EventFilters = {
  q?: string;
  category?: string;
  when?: string;
};

function filterEvents(
  events: NexusEventWithOrganizer[],
  { q, category, when = "upcoming" }: EventFilters,
): NexusEventWithOrganizer[] {
  let result = events;

  if (when === "upcoming") {
    result = result.filter((e) => !isPastEvent(e.starts_at));
  } else if (when === "past") {
    result = result.filter((e) => isPastEvent(e.starts_at));
  }

  if (category && category !== "all") {
    result = result.filter((e) => e.category === category);
  }

  const term = q?.trim().toLowerCase();
  if (term) {
    result = result.filter(
      (e) =>
        e.title.toLowerCase().includes(term) ||
        e.description?.toLowerCase().includes(term) ||
        e.venue_name?.toLowerCase().includes(term) ||
        e.tags.some((tag) => tag.toLowerCase().includes(term)),
    );
  }

  return result.sort(
    (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
  );
}

export async function getEvents(
  filters: EventFilters = {},
): Promise<NexusEventWithOrganizer[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select(
        `
        *,
        profiles:organizer_id (
          display_name,
          username
        )
      `,
      )
      .eq("status", "published")
      .order("starts_at", { ascending: true });

    if (error || !data?.length) {
      return filterEvents(SAMPLE_EVENTS, filters);
    }

    return filterEvents(data as NexusEventWithOrganizer[], filters);
  } catch {
    return filterEvents(SAMPLE_EVENTS, filters);
  }
}

export async function getEvent(id: string): Promise<NexusEventWithOrganizer | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select(
        `
        *,
        profiles:organizer_id (
          display_name,
          username
        )
      `,
      )
      .eq("id", id)
      .eq("status", "published")
      .single();

    if (!error && data) {
      return data as NexusEventWithOrganizer;
    }
  } catch {
    // fall through
  }

  return SAMPLE_EVENTS.find((e) => e.id === id) ?? null;
}
