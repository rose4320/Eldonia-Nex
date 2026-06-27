import type { UiLocale } from "@/lib/i18n/locale";
import { createClient } from "@/lib/supabase/server";
import type { Quest, QuestParticipation, QuestParticipationWithQuest } from "@/types/database";
import { getSampleQuests } from "./sample-data";

type QuestFilters = { q?: string; kind?: string };

function filterQuests(quests: Quest[], filters: QuestFilters): Quest[] {
  let result = quests.filter((quest) => quest.status === "open");
  if (filters.kind && filters.kind !== "all") {
    result = result.filter((quest) => quest.kind === filters.kind);
  }
  const term = filters.q?.trim().toLowerCase();
  if (term) {
    result = result.filter(
      (quest) =>
        quest.title.toLowerCase().includes(term) ||
        quest.description.toLowerCase().includes(term) ||
        (quest.prize_summary?.toLowerCase().includes(term) ?? false),
    );
  }
  return result;
}

export async function getQuestListings(
  filters: QuestFilters = {},
  _locale: UiLocale = "ja",
): Promise<Quest[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("quests")
      .select("*")
      .eq("status", "open")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (!error && data?.length) {
      return filterQuests(data as Quest[], filters);
    }
  } catch {
    // fallback
  }
  return filterQuests(getSampleQuests(_locale), filters);
}

export async function getQuestById(id: string, locale: UiLocale = "ja"): Promise<Quest | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("quests").select("*").eq("id", id).single();

    if (!error && data) return data as Quest;
  } catch {
    // fallback
  }
  return getSampleQuests(locale).find((quest) => quest.id === id) ?? null;
}

export async function getQuestParticipation(
  questId: string,
  userId: string,
): Promise<QuestParticipation | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("quest_participations")
      .select("*")
      .eq("quest_id", questId)
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) return data as QuestParticipation;
  } catch {
    return null;
  }
  return null;
}

export async function getUserQuestHistory(userId: string): Promise<QuestParticipationWithQuest[]> {
  try {
    const supabase = await createClient();
    const { data: participations, error } = await supabase
      .from("quest_participations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !participations?.length) {
      return [];
    }

    const questIds = [...new Set(participations.map((row) => row.quest_id))];
    const { data: quests } = await supabase.from("quests").select("*").in("id", questIds);
    const questMap = new Map((quests as Quest[] | null)?.map((quest) => [quest.id, quest]) ?? []);

    return participations.map((row) => ({
      ...(row as QuestParticipation),
      quests: questMap.get(row.quest_id) ?? null,
    }));
  } catch {
    return [];
  }
}
