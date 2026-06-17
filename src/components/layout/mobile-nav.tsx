"use client";

import Link from "next/link";
import { useState } from "react";
import { HeaderLanguageSelect } from "@/components/layout/header-language-select";
import { HeaderSearch } from "@/components/layout/header-search";
import { NotificationBell } from "@/components/layout/notification-bell";
import { ExpBarCompact } from "@/components/settings/exp-bar-compact";
import { UserAvatarLink } from "@/components/settings/user-avatar-link";
import { BrandLogo } from "@/components/ui/brand-logo";
import type { UiLocale } from "@/lib/i18n/locale";
import { HEADER_LABELS } from "@/lib/i18n/header-chrome";
import { MODULE_NAV_LINKS } from "@/lib/layout/nav-links";
import type { CollabNotification } from "@/lib/notifications/get-notifications";

type MobileNavProps = {
  locale: UiLocale;
  user: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  } | null;
  notifications: CollabNotification[];
  unreadCount: number;
  expPoints: number;
  titleBadge: string | null;
};

export function MobileNav({
  locale,
  user,
  notifications,
  unreadCount,
  expPoints,
  titleBadge,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="eldonia-header-mobile border-t border-eldonia-border px-4 py-3 sm:px-6 lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <BrandLogo size="sm" showSubtitle />
        <button
          type="button"
          className="eldonia-btn-ghost text-xs"
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? HEADER_LABELS.menuClose : HEADER_LABELS.menu}
        </button>
      </div>

      {open && (
        <div id="mobile-nav-panel" className="mt-4 space-y-4 border-t border-eldonia-border pt-4">
          <nav className="flex flex-wrap gap-1">
            {MODULE_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="eldonia-nav-link"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <HeaderSearch />

          <div className="flex flex-wrap items-center gap-2">
            <HeaderLanguageSelect locale={locale} />
            {user ? (
              <>
                <NotificationBell
                  key={`mobile-${user.id}-${unreadCount}`}
                  userId={user.id}
                  notifications={notifications}
                  unreadCount={unreadCount}
                />
                <UserAvatarLink displayName={user.displayName} avatarUrl={user.avatarUrl} />
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
      )}
    </div>
  );
}
