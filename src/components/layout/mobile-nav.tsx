"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

function MobileMenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function MobileNav({
  locale,
  user,
  notifications,
  unreadCount,
  expPoints,
  titleBadge,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <div className="eldonia-header-mobile border-t border-eldonia-border px-4 py-3 sm:px-6 lg:hidden" style={{ ["--eldonia-mobile-header-h" as string]: "3.75rem" }}>
        <div className="flex items-center justify-between gap-3">
          <BrandLogo size="sm" showSubtitle />
          <button
            type="button"
            className="eldonia-mobile-menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            aria-label={open ? HEADER_LABELS.menuClose : HEADER_LABELS.menu}
            onClick={() => setOpen((value) => !value)}
          >
            <MobileMenuIcon open={open} />
          </button>
        </div>
      </div>

      {open && (
        <>
          <button
            type="button"
            className="eldonia-mobile-menu-backdrop lg:hidden"
            aria-label={HEADER_LABELS.menuClose}
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label={HEADER_LABELS.menu}
            className="eldonia-mobile-menu-panel lg:hidden"
          >
            <nav className="flex flex-col gap-1">
              {MODULE_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="eldonia-mobile-menu-link"
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
                  <Link
                    href="/auth/login?redirect_to=%2F"
                    className="eldonia-btn-ghost text-xs"
                    onClick={() => setOpen(false)}
                  >
                    {HEADER_LABELS.login}
                  </Link>
                  <Link
                    href="/auth/signup?redirect_to=%2F"
                    className="eldonia-btn-primary text-xs"
                    onClick={() => setOpen(false)}
                  >
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
        </>
      )}
    </>
  );
}
