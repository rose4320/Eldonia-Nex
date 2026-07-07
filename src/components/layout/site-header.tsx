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
import type { User } from "@supabase/supabase-js";

const HEADER_AUTH_FALLBACK_TIMEOUT_MS = 2500;
const HEADER_DATA_TIMEOUT_MS = 1000;

type HeaderProfile = {
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

async function withTimeout<T>(
  promise: PromiseLike<T>,
  fallback: T,
  timeoutMs: number,
): Promise<T> {
  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs)),
    ]);
  } catch {
    return fallback;
  }
}

export async function SiteHeader() {
  try {
    return await renderSiteHeader();
  } catch (error) {
    console.error("[SiteHeader] render failed:", error);
    const locale = await getUiLocale();
    return (
      <header className="eldonia-header relative">
        <MobileNav locale={locale} user={null} />
      </header>
    );
  }
}

async function renderSiteHeader() {
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  let user: User | null = session?.user ?? null;

  if (!user) {
    user = await withTimeout<User | null>(
      supabase.auth.getUser().then((result) => result.data.user),
      null,
      HEADER_AUTH_FALLBACK_TIMEOUT_MS,
    );
  }

  let displayName = user?.email ?? null;
  let avatarUrl: string | null = null;
  let notifications: Awaited<ReturnType<typeof getHeaderNotifications>> = [];
  let unreadCount = 0;
  let expPoints = 0;
  let titleBadge: string | null = null;

  if (user) {
    const [profileRes, notificationList, count, portfolio] = await Promise.all([
      withTimeout(
        supabase
          .from("profiles")
          .select("display_name, username, avatar_url")
          .eq("id", user.id)
          .single()
          .then((result) => result.data as HeaderProfile | null),
        null,
        HEADER_DATA_TIMEOUT_MS,
      ),
      withTimeout(getHeaderNotifications(user.id), [], HEADER_DATA_TIMEOUT_MS),
      withTimeout(getUnreadNotificationCount(user.id), 0, HEADER_DATA_TIMEOUT_MS),
      withTimeout(
        getPortfolioForUser(user.id, { useSampleFallback: false }),
        null,
        HEADER_DATA_TIMEOUT_MS,
      ),
    ]);

    displayName =
      profileRes?.display_name ??
      profileRes?.username ??
      user.email ??
      pages.userFallback;
    avatarUrl = profileRes?.avatar_url ?? null;
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
            <BrandLogo size="xl" showSubtitle />
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
              <Link
                href="/shop/cart"
                aria-label={HEADER_LABELS.cart}
                title={HEADER_LABELS.cart}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-eldonia-text-muted transition hover:text-eldonia-gold-light"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="9" cy="20" r="1.4" />
                  <circle cx="18" cy="20" r="1.4" />
                  <path d="M2.5 3h2.2l2.1 11.2a1.6 1.6 0 0 0 1.6 1.3h8.3a1.6 1.6 0 0 0 1.6-1.25L21.5 7H6.2" />
                </svg>
              </Link>
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
                  <Link href="/auth/login?redirect_to=%2F" className="eldonia-btn-ghost text-xs">
                    {HEADER_LABELS.login}
                  </Link>
                  <Link href="/auth/signup?redirect_to=%2F" className="eldonia-btn-primary text-xs">
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
        user={user ? { displayName: displayName ?? pages.userFallback } : null}
        unreadCount={unreadCount}
      />
    </header>
  );
}
