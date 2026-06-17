"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { CollabRespondButtons } from "@/components/gallery/collab-respond-buttons";
import { createClient } from "@/lib/supabase/client";
import { intlLocale } from "@/lib/i18n/content/messages";
import {
  matchesNotificationFilter,
  notificationFilterOptions,
  notificationKindLabel,
  type NotificationFilter,
} from "@/lib/notifications/notification-labels";
import type { UserNotification } from "@/types/database";

type SettingsNotificationsProps = {
  notifications: UserNotification[];
  userId: string;
};

export function SettingsNotifications({
  notifications: initialNotifications,
  userId,
}: SettingsNotificationsProps) {
  const router = useRouter();
  const locale = useLocale();
  const { forms } = useContent();
  const notif = forms.notifications;
  const filterOptions = notificationFilterOptions(locale);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(
    () => initialNotifications.filter((item) => matchesNotificationFilter(item.kind, filter)),
    [initialNotifications, filter],
  );

  async function markRead(id: string) {
    const supabase = createClient();
    await supabase.from("user_notifications").update({ is_read: true }).eq("id", id);
    router.refresh();
  }

  async function markAllRead() {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("user_notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);
    setLoading(false);
    router.refresh();
  }

  const unreadCount = initialNotifications.filter((n) => !n.is_read).length;
  const dateLocale = intlLocale(locale);

  return (
    <section id="notifications" className="scroll-mt-24 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="eldonia-eyebrow">{notif.heading}</h2>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            disabled={loading}
            className="eldonia-btn-ghost text-xs disabled:opacity-60"
          >
            {loading ? notif.processing : notif.markAll(unreadCount)}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              filter === option.value
                ? "border-eldonia-gold/60 bg-eldonia-gold/10 text-eldonia-gold"
                : "border-eldonia-border text-eldonia-text-muted hover:border-eldonia-gold/30"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="eldonia-card-dashed px-6 py-10 text-center">
          <p className="eldonia-body text-sm">
            {filter === "all" ? notif.emptyAll : notif.emptyFilter}
          </p>
          <Link href="/help/tickets" className="eldonia-link mt-3 inline-block text-sm">
            {notif.viewTickets}
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((item) => (
            <li
              key={item.id}
              className={`eldonia-card ${item.is_read ? "opacity-70" : "border-eldonia-gold/40"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-eldonia-text-muted">
                    {notificationKindLabel(item.kind, locale)} ·{" "}
                    {new Date(item.created_at).toLocaleDateString(dateLocale)}
                  </p>
                  <p className="mt-1 font-display text-sm font-semibold text-eldonia-gold-light">
                    {item.title}
                  </p>
                  {item.body && <p className="eldonia-body mt-2 text-sm">{item.body}</p>}

                  {item.kind === "collab_request" &&
                    item.collab_request_id &&
                    !item.is_read && (
                      <div className="mt-4">
                        <CollabRespondButtons requestId={item.collab_request_id} />
                      </div>
                    )}
                </div>
                <div className="flex gap-2">
                  {item.href && item.kind !== "collab_request" && (
                    <Link
                      href={item.href}
                      className={
                        item.kind === "collab_accepted"
                          ? "eldonia-btn-primary text-xs"
                          : "eldonia-btn-ghost text-xs"
                      }
                    >
                      {item.kind === "collab_accepted" ? notif.openLab : notif.open}
                    </Link>
                  )}
                  {!item.is_read && item.kind !== "collab_request" && (
                    <button
                      type="button"
                      onClick={() => markRead(item.id)}
                      className="eldonia-btn-secondary text-xs"
                    >
                      {forms.markRead}
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
