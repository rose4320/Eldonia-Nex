"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { createClient, hasBrowserSupabaseConfig } from "@/lib/supabase/client";
import type { UserNotification } from "@/types/database";

function subscribe() {
  return () => {};
}

type CriticalAnnouncementModalProps = {
  initial: UserNotification | null;
  userId: string;
};

export function CriticalAnnouncementModal({
  initial,
  userId,
}: CriticalAnnouncementModalProps) {
  const portalReady = useSyncExternalStore(subscribe, () => true, () => false);
  const [live, setLive] = useState<UserNotification | null>(null);
  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  const candidate = live ?? initial;
  const visible =
    candidate &&
    !candidate.dismissed_at &&
    candidate.id !== dismissedId
      ? candidate
      : null;

  useEffect(() => {
    if (!hasBrowserSupabaseConfig() || !userId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`critical-announcement:${userId}`)
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
          if (row.kind !== "announcement") return;
          if (row.priority !== "critical") return;
          if (row.dismissed_at) return;
          setLive(row);
          setDismissedId(null);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId]);

  const dismiss = useCallback(async () => {
    if (!visible || closing) return;
    setClosing(true);
    const id = visible.id;
    try {
      if (hasBrowserSupabaseConfig()) {
        const supabase = createClient();
        const now = new Date().toISOString();
        await supabase
          .from("user_notifications")
          .update({ dismissed_at: now, is_read: true })
          .eq("id", id)
          .eq("user_id", userId);
      }
      setDismissedId(id);
    } finally {
      setClosing(false);
    }
  }, [visible, closing, userId]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") void dismiss();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [visible, dismiss]);

  if (!portalReady || !visible) return null;

  return createPortal(
    <div
      className="eldonia-critical-overlay"
      role="presentation"
      onClick={() => void dismiss()}
    >
      <div
        className="eldonia-critical-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="eldonia-critical-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="eldonia-critical-eyebrow">Important Announcement</p>
        <h2 id="eldonia-critical-title" className="eldonia-heading eldonia-heading-sm">
          {visible.title}
        </h2>
        {visible.body ? (
          <p className="eldonia-critical-body">{visible.body}</p>
        ) : null}
        <div className="eldonia-critical-actions">
          {visible.href ? (
            <Link
              href={visible.href}
              className="eldonia-btn-primary"
              onClick={() => void dismiss()}
            >
              詳細を見る
            </Link>
          ) : null}
          <button
            type="button"
            className="eldonia-btn-ghost"
            onClick={() => void dismiss()}
            disabled={closing}
          >
            {closing ? "閉じています…" : "閉じる"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
