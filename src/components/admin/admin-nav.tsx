"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/support", label: "Support" },
  { href: "/works/manage", label: "Quests" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {ADMIN_LINKS.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === link.href
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-[var(--eldonia-gold)]/15 font-medium text-[var(--eldonia-gold-light)]"
                : "text-[var(--eldonia-text-muted)] hover:bg-[var(--eldonia-surface-elevated)] hover:text-[var(--eldonia-text)]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
