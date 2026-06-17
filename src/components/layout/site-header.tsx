import Link from "next/link";
import { HeaderLanguageSelect } from "@/components/layout/header-language-select";
import { HeaderSearch } from "@/components/layout/header-search";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NotificationBell } from "@/components/layout/notification-bell";
import { ExpBarCompact } from "@/components/settings/exp-bar-compact";
import { UserAvatarLink } from "@/components/settings/user-avatar-link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { HEADER_LABELS } from "@/lib/i18n/header-chrome";
import { MODULE_NAV_LINKS } from "@/lib/layout/nav-links";
import {
  getHeaderNotifications,
  getUnreadNotificationCount,
} from "@/lib/notifications/get-notifications";
import { getPortfolioForUser } from "@/lib/works/get-works";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = user?.email ?? null;
  let avatarUrl: string | null = null;
  let notifications: Awaited<ReturnType<typeof getHeaderNotifications>> = [];
  let unreadCount = 0;
  let expPoints = 0;
  let titleBadge: string | null = null;

  if (user) {
    const [profileRes, notificationList, count, portfolio] = await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, username, avatar_url")
        .eq("id", user.id)
        .single(),
      getHeaderNotifications(user.id),
      getUnreadNotificationCount(user.id),
      getPortfolioForUser(user.id, { useSampleFallback: false }),
    ]);

    displayName =
      profileRes.data?.display_name ??
      profileRes.data?.username ??
      user.email ??
      pages.userFallback;
    avatarUrl = profileRes.data?.avatar_url ?? null;
    notifications = notificationList;
    unreadCount = count;
    expPoints = portfolio?.exp_points ?? 0;
    titleBadge = portfolio?.title_badge ?? null;
  }

  return (
    <header className="eldonia-header relative">
      <div className="eldonia-header-desktop mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="eldonia-header-grid">
          {/* 左: ロゴ + タイトル + サブタイトル */}
          <div className="eldonia-header-col eldonia-header-col-left">
            <BrandLogo size="sm" showSubtitle />
          </div>

          {/* 中: モジュールナビ + 検索 */}
          <div className="eldonia-header-col eldonia-header-col-center">
            <nav className="eldonia-header-nav" aria-label="Main">
              {MODULE_NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="eldonia-nav-link">
                  {link.label}
                </Link>
              ))}
            </nav>
            <HeaderSearch />
          </div>

          {/* 右: 言語・通知・アバター・認証 + EXP */}
          <div className="eldonia-header-col eldonia-header-col-right">
            <div className="eldonia-header-actions">
              <HeaderLanguageSelect locale={locale} />
              {user ? (
                <>
                  <NotificationBell
                    key={`${user.id}-${unreadCount}-${notifications[0]?.id ?? "empty"}`}
                    userId={user.id}
                    notifications={notifications}
                    unreadCount={unreadCount}
                  />
                  <UserAvatarLink
                    displayName={displayName ?? pages.userFallback}
                    avatarUrl={avatarUrl}
                  />
                  <form action="/auth/sign-out" method="post">
                    <button type="submit" className="eldonia-btn-ghost text-xs">
                      {HEADER_LABELS.logout}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="eldonia-btn-ghost text-xs">
                    {HEADER_LABELS.login}
                  </Link>
                  <Link href="/auth/signup" className="eldonia-btn-primary text-xs">
                    {HEADER_LABELS.signup}
                  </Link>
                </>
              )}
            </div>
            {user && (
              <ExpBarCompact
                expPoints={expPoints}
                titleBadge={titleBadge}
                locale={locale}
              />
            )}
          </div>
        </div>
      </div>

      <MobileNav
        locale={locale}
        user={user ? { id: user.id, displayName: displayName ?? pages.userFallback, avatarUrl } : null}
        notifications={notifications}
        unreadCount={unreadCount}
        expPoints={expPoints}
        titleBadge={titleBadge}
      />
    </header>
  );
}
