import { createClient } from "@/lib/supabase/server";
import type { NexusEventWithOrganizer } from "@/types/database";
import { isPastEvent } from "./constants";
import { SAMPLE_EVENTS } from "./sample-events";

type EventFilters = {
  q?: string;
  category?: string;
  format?: string;
  when?: string;
};

function filterEvents(
  events: NexusEventWithOrganizer[],
  { q, category, format, when = "upcoming" }: EventFilters,
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

  if (format && format !== "all") {
    result = result.filter((e) => e.format === format);
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

const EVENT_SELECT = `
  *,
  profiles:organizer_id (
    display_name,
    username
  )
`;

export async function getPublishedEventFromDb(
  id: string,
): Promise<NexusEventWithOrganizer | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select(EVENT_SELECT)
      .eq("id", id)
      .eq("status", "published")
      .maybeSingle();

    if (!error && data) {
      return data as NexusEventWithOrganizer;
    }
  } catch {
    // fall through
  }

  return null;
}

export async function fetchPublishedEventsByIds(
  ids: string[],
): Promise<Map<string, NexusEventWithOrganizer>> {
  const uniqueIds = [...new Set(ids)];
  const map = new Map<string, NexusEventWithOrganizer>();
  if (uniqueIds.length === 0) return map;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select(EVENT_SELECT)
      .in("id", uniqueIds)
      .eq("status", "published");

    if (!error && data?.length) {
      for (const row of data as NexusEventWithOrganizer[]) {
        map.set(row.id, row);
      }
    }
  } catch {
    // fall through — sample fallback below
  }

  for (const id of uniqueIds) {
    if (!map.has(id)) {
      const sample = SAMPLE_EVENTS.find((event) => event.id === id);
      if (sample) map.set(id, sample);
    }
  }

  return map;
}

export async function getEvent(id: string): Promise<NexusEventWithOrganizer | null> {
  const fromDb = await getPublishedEventFromDb(id);
  if (fromDb) return fromDb;

  return SAMPLE_EVENTS.find((e) => e.id === id) ?? null;
}
