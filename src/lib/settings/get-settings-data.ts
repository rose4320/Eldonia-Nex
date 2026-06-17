import { createClient } from "@/lib/supabase/server";
import { getOrdersForUser } from "@/lib/commerce/get-orders";
import { getPortfolioForUser } from "@/lib/works/get-works";
import { buildRecommendations } from "@/lib/settings/recommendations";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import type { Profile, UserNotification, UserSettings } from "@/types/database";
export type SettingsFinanceSummary = {
  totalSpent: number;
  paidOrderCount: number;
  productCount: number;
  eventCount: number;
  estimatedEarnings: number;
};

export type SettingsHubData = {
  profile: Profile;
  userSettings: UserSettings | null;
  portfolio: Awaited<ReturnType<typeof getPortfolioForUser>>;
  recommendations: ReturnType<typeof buildRecommendations>;
  finance: SettingsFinanceSummary;
  notifications: UserNotification[];
  unreadCount: number;
  artworkCount: number;
  openTicketCount: number;
};

const EMPTY_SETTINGS: UserSettings = {
  user_id: "",
  legal_name: null,
  country: "JP",
  address_line1: null,
  address_line2: null,
  phone: null,
  bank_name: null,
  bank_branch: null,
  bank_account_type: null,
  bank_account_number: null,
  bank_account_holder: null,
  notify_fan: true,
  notify_like: true,
  notify_comment: true,
  notify_collab: true,
  notify_lab: true,
  notify_order: true,
  notify_support: true,
  notify_announcement: true,
  created_at: "",
  updated_at: "",
};

function isBasicsComplete(settings: UserSettings | null, profile: Profile): boolean {
  if (!settings) return false;
  return Boolean(
    settings.legal_name?.trim() &&
      settings.phone?.trim() &&
      settings.address_line1?.trim() &&
      settings.bank_account_holder?.trim(),
  ) && Boolean(profile.display_name?.trim());
}

export async function getSettingsHubData(
  userId: string,
  profile: Profile,
): Promise<SettingsHubData> {
  const supabase = await createClient();
  const locale = await getUiLocale();
  const { settingsUi } = getContent(locale);
  const [
    settingsRes,
    portfolio,
    orders,
    artworkRes,
    productRes,
    eventRes,
    ticketRes,
    notifRes,
  ] = await Promise.all([
    supabase.from("user_settings").select("*").eq("user_id", userId).maybeSingle(),
    getPortfolioForUser(userId, { useSampleFallback: false }),
    getOrdersForUser(userId),
    supabase
      .from("artworks")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", userId),
    supabase
      .from("shop_products")
      .select("*", { count: "exact", head: true })
      .eq("seller_id", userId),
    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("organizer_id", userId),
    supabase
      .from("support_tickets")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("status", ["open", "in_progress", "waiting_user"]),
    supabase
      .from("user_notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const userSettings = (settingsRes.data as UserSettings | null) ?? null;
  const notifications = notifRes.error ? [] : ((notifRes.data ?? []) as UserNotification[]);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const paidOrders = orders.filter((o) => o.status === "paid");
  const totalSpent = paidOrders.reduce((sum, o) => sum + (o.total_amount ?? 0), 0);
  const productCount = productRes.count ?? 0;
  const eventCount = eventRes.count ?? 0;

  const finance: SettingsFinanceSummary = {
    totalSpent,
    paidOrderCount: paidOrders.length,
    productCount,
    eventCount,
    estimatedEarnings: productCount * 1200 + eventCount * 800,
  };

  const recommendations = buildRecommendations(
    {
      artworkCount: artworkRes.count ?? 0,
      productCount,
      eventCount,
      hasPortfolio: Boolean(portfolio?.headline?.trim() || portfolio?.summary?.trim()),
      basicsComplete: isBasicsComplete(userSettings, profile),
      unreadNotifications: unreadCount,
      openTickets: ticketRes.count ?? 0,
      isCreator: profile.is_creator,
    },
    settingsUi.recommendations,
  );
  return {
    profile,
    userSettings,
    portfolio,
    recommendations,
    finance,
    notifications,
    unreadCount,
    artworkCount: artworkRes.count ?? 0,
    openTicketCount: ticketRes.count ?? 0,
  };
}

export function mergeUserSettings(
  userId: string,
  existing: UserSettings | null,
): UserSettings {
  if (existing) return existing;
  return { ...EMPTY_SETTINGS, user_id: userId };
}
