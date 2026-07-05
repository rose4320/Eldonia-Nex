"use client";

import Link from "next/link";
import { useContent } from "@/components/providers/locale-provider";

type UserAvatarLinkProps = {
  displayName: string;
  avatarUrl: string | null;
};

export function UserAvatarLink({ displayName, avatarUrl }: UserAvatarLinkProps) {
  const { pages, settingsUi } = useContent();
  const initials = displayName.slice(0, 1).toUpperCase();

  return (
    <Link
      href="/settings"
      className="group relative flex items-center gap-2 transition"
      aria-label={settingsUi.avatarSettings(displayName)}
      title={pages.settings.avatarSettings}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden bg-eldonia-surface">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-sm font-bold text-eldonia-gold-light">
            {initials}
          </span>
        )}
      </span>
      <span className="hidden max-w-28 truncate text-sm text-eldonia-text-muted group-hover:text-eldonia-gold-light sm:inline">
        {displayName}
      </span>
    </Link>
  );
}
