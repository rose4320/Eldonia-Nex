"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { CollabRespondButtons } from "@/components/gallery/collab-respond-buttons";
import { createClient, hasBrowserSupabaseConfig } from "@/lib/supabase/client";
import { notificationKindLabel } from "@/lib/notifications/notification-labels";
import type { CollabNotification } from "@/lib/notifications/get-notifications";
import type { UserNotification } from "@/types/database";

type NotificationBellProps = {
  userId: string;
  notifications: CollabNotification[];
  unreadCount: number;
};

export function NotificationBell({
  userId,
  notifications: initialNotifications,
  unreadCount: initialCount,
}: NotificationBellProps) {
  const router = useRouter();
  const locale = useLocale();
  const { pages, forms, chrome } = useContent();
  const notificationsCopy = pages.notifications;
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialCount);

  useEffect(() => {
    if (!hasBrowserSupabaseConfig()) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const row = payload.new as UserNotification;
          if (row.is_read) return;

          setNotifications((items) => {
            if (items.some((item) => item.id === row.id)) return items;
            return [row as CollabNotification, ...items].slice(0, 20);
          });
          setUnreadCount((count) => count + 1);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const row = payload.new as UserNotification;
          if (!row.is_read) return;

          setNotifications((items) => items.filter((item) => item.id !== row.id));
          setUnreadCount((count) => Math.max(0, count - 1));
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId]);

  function handleCollabDone(requestId: string) {
    setNotifications((items) =>
      items.filter((item) => item.collab_request_id !== requestId),
    );
    setUnreadCount((count) => Math.max(0, count - 1));
    setOpen(false);
    router.refresh();
  }

  async function markRead(id: string) {
    if (!hasBrowserSupabaseConfig()) return;

    const supabase = createClient();
    await supabase.from("user_notifications").update({ is_read: true }).eq("id", id);
    setNotifications((items) => items.filter((item) => item.id !== id));
    setUnreadCount((count) => Math.max(0, count - 1));
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="eldonia-btn-ghost relative px-2 text-base"
        aria-label={notificationsCopy.bellLabel}
        aria-expanded={open}
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-eldonia-gold px-1 text-[10px] font-bold text-black">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[100] cursor-default bg-transparent"
            aria-label={chrome.menuClose}
            onClick={() => setOpen(false)}
          />
          <div className="eldonia-notification-panel absolute right-0 z-[110] mt-2 w-[min(100vw-2rem,22rem)] rounded-lg border border-eldonia-border bg-eldonia-surface-elevated shadow-xl">
            <div className="border-b border-eldonia-border px-4 py-3">
              <p className="font-display text-sm font-semibold text-eldonia-gold-light">
                {notificationsCopy.bellLabel}
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="eldonia-body px-4 py-6 text-center text-sm text-eldonia-text-muted">
                  {notificationsCopy.empty}
                </p>
              ) : (
                <ul className="divide-y divide-eldonia-border">
                  {notifications.map((item) => (
                    <li key={item.id} className="px-4 py-3">
                      <p className="text-xs text-eldonia-text-muted">
                        {notificationKindLabel(item.kind, locale)}
                      </p>
                      <p className="mt-1 text-sm font-medium text-eldonia-gold-light">
                        {item.title}
                      </p>
                      {item.body && (
                        <p className="eldonia-body mt-1 text-xs">{item.body}</p>
                      )}

                      {item.kind === "collab_request" && item.collab_request_id && (
                        <div className="mt-3">
                          <CollabRespondButtons
                            requestId={item.collab_request_id}
                            size="xs"
                            onDone={() => handleCollabDone(item.collab_request_id!)}
                          />
                        </div>
                      )}

                      {item.kind !== "collab_request" && item.href && (
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="eldonia-link mt-2 inline-block text-xs"
                        >
                          {forms.open}
                        </Link>
                      )}

                      {item.kind !== "collab_request" && !item.href && (
                        <button
                          type="button"
                          onClick={() => markRead(item.id)}
                          className="eldonia-btn-ghost mt-2 text-xs"
                        >
                          {forms.markRead}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-eldonia-border px-4 py-2">
              <Link
                href="/settings#notifications"
                onClick={() => setOpen(false)}
                className="eldonia-link text-xs"
              >
                {notificationsCopy.viewAll}
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
