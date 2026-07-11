"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HeaderLanguageSelect } from "@/components/layout/header-language-select";
import { BrandLogo } from "@/components/ui/brand-logo";
import type { UiLocale } from "@/lib/i18n/locale";
import { HEADER_LABELS } from "@/lib/i18n/header-chrome";
import { MODULE_NAV_LINKS } from "@/lib/layout/nav-links";
import { useIsClient } from "@/lib/react/use-is-client";

type MobileNavProps = {
  locale: UiLocale;
  user: {
    displayName: string;
  } | null;
  unreadCount?: number;
  cartCount?: number;
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

export function MobileNav({ locale, user, unreadCount = 0, cartCount = 0 }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const mounted = useIsClient();

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

  function closeMenu() {
    setOpen(false);
  }

  function navigateFromMenu(href: string) {
    closeMenu();
    window.setTimeout(() => {
      window.location.assign(href);
    }, 0);
  }

  const menuOverlay =
    open && mounted
      ? createPortal(
          <>
            <button
              type="button"
              className="eldonia-mobile-menu-backdrop lg:hidden"
              aria-label={HEADER_LABELS.menuClose}
              onClick={closeMenu}
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
                  <button
                    key={link.href}
                    type="button"
                    className="eldonia-mobile-menu-link text-left"
                    onClick={() => navigateFromMenu(link.href)}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>

              <div className="flex flex-col gap-1 border-t border-eldonia-border pt-3">
                <button
                  type="button"
                  className="eldonia-mobile-menu-link flex items-center justify-between text-left"
                  onClick={() => navigateFromMenu("/shop/cart")}
                >
                  <span>{HEADER_LABELS.cart}</span>
                  {cartCount > 0 ? (
                    <span className="rounded-full bg-eldonia-gold px-2 py-0.5 text-[0.65rem] font-semibold text-eldonia-bg">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  ) : null}
                </button>
                {user ? (
                  <>
                    <button
                      type="button"
                      className="eldonia-mobile-menu-link text-left"
                      onClick={() => navigateFromMenu("/settings")}
                    >
                      {HEADER_LABELS.settings}
                    </button>
                    <button
                      type="button"
                      className="eldonia-mobile-menu-link flex items-center justify-between text-left"
                      onClick={() => navigateFromMenu("/settings#notifications")}
                    >
                      <span>{HEADER_LABELS.notifications}</span>
                      {unreadCount > 0 ? (
                        <span className="rounded-full bg-eldonia-gold px-2 py-0.5 text-[0.65rem] font-semibold text-eldonia-bg">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      ) : null}
                    </button>
                  </>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-eldonia-border pt-3">
                <HeaderLanguageSelect locale={locale} />
                {user ? (
                  <>
                    <Link
                      href="/settings"
                      className="eldonia-btn-ghost text-xs"
                      onClick={closeMenu}
                    >
                      {user.displayName}
                    </Link>
                    <form action="/auth/sign-out" method="post">
                      <button type="submit" className="eldonia-btn-ghost text-xs">
                        {HEADER_LABELS.logout}
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="eldonia-btn-ghost text-xs"
                      onClick={() => navigateFromMenu("/auth/login?redirect_to=%2F")}
                    >
                      {HEADER_LABELS.login}
                    </button>
                    <button
                      type="button"
                      className="eldonia-btn-primary text-xs"
                      onClick={() => navigateFromMenu("/auth/signup?redirect_to=%2F")}
                    >
                      {HEADER_LABELS.signup}
                    </button>
                  </>
                )}
              </div>
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <>
      <div
        className="eldonia-header-mobile border-t border-eldonia-border px-4 py-3 sm:px-6 lg:hidden"
        style={{ ["--eldonia-mobile-header-h" as string]: "3.75rem" }}
      >
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

      {menuOverlay}
    </>
  );
}
