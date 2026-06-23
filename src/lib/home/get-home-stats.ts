import type { UiLocale } from "@/lib/i18n/locale";
import { createClient } from "@/lib/supabase/server";

export type HomePlatformStats = {
  creatorCount: number;
  questCount: number;
  creatorReturns: number;
};

export async function getHomePlatformStats(): Promise<HomePlatformStats> {
  try {
    const supabase = await createClient();
    const [creatorsRes, questsRes, ordersRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_creator", true),
      supabase
        .from("job_listings")
        .select("*", { count: "exact", head: true })
        .eq("status", "open"),
      supabase.from("orders").select("total_amount").eq("status", "paid"),
    ]);

    const creatorReturns =
      ordersRes.data?.reduce((sum, row) => sum + (row.total_amount ?? 0), 0) ?? 0;

    return {
      creatorCount: creatorsRes.count ?? 0,
      questCount: questsRes.count ?? 0,
      creatorReturns,
    };
  } catch {
    return { creatorCount: 0, questCount: 0, creatorReturns: 0 };
  }
}

export function formatHomeStatValue(
  key: "creators" | "quests" | "returns",
  stats: HomePlatformStats,
  locale: UiLocale,
): string {
  const localeTag =
    locale === "ja" ? "ja-JP" : locale === "ko" ? "ko-KR" : locale === "zh-CN" ? "zh-CN" : "en-US";

  switch (key) {
    case "creators":
      return stats.creatorCount.toLocaleString(localeTag);
    case "quests":
      return stats.questCount.toLocaleString(localeTag);
    case "returns":
      return new Intl.NumberFormat(localeTag, {
        style: "currency",
        currency: "JPY",
        maximumFractionDigits: 0,
      }).format(stats.creatorReturns);
  }
}
