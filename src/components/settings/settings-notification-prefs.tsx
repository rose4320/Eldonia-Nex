"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContent } from "@/components/providers/locale-provider";
import { createClient } from "@/lib/supabase/client";
import type { UserSettings } from "@/types/database";

type SettingsNotificationPrefsProps = {
  userId: string;
  settings: UserSettings;
};

type PrefKey =
  | "notify_fan"
  | "notify_like"
  | "notify_comment"
  | "notify_collab"
  | "notify_lab"
  | "notify_order"
  | "notify_support"
  | "notify_announcement";

export function SettingsNotificationPrefs({
  userId,
  settings,
}: SettingsNotificationPrefsProps) {
  const router = useRouter();
  const { settingsUi } = useContent();
  const copy = settingsUi.notificationPrefs;
  const prefs: { key: PrefKey; label: string; description: string }[] = [
    { key: "notify_fan", ...copy.fan },
    { key: "notify_like", ...copy.like },
    { key: "notify_comment", ...copy.comment },
    { key: "notify_collab", ...copy.collab },
    { key: "notify_lab", ...copy.lab },
    { key: "notify_order", ...copy.order },
    { key: "notify_support", ...copy.support },
    { key: "notify_announcement", ...copy.announcement },
  ];
  const [values, setValues] = useState<Record<PrefKey, boolean>>({
    notify_fan: settings.notify_fan ?? true,
    notify_like: settings.notify_like ?? true,
    notify_comment: settings.notify_comment ?? true,
    notify_collab: settings.notify_collab ?? true,
    notify_lab: settings.notify_lab ?? true,
    notify_order: settings.notify_order ?? true,
    notify_support: settings.notify_support ?? true,
    notify_announcement: settings.notify_announcement ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error: upsertError } = await supabase.from("user_settings").upsert({
      user_id: userId,
      ...values,
    });

    setLoading(false);
    if (upsertError) {
      setError(upsertError.message);
      return;
    }

    setMessage(copy.saved);
    router.refresh();
  }

  return (
    <section id="notification-prefs" className="scroll-mt-24 space-y-4">
      <h2 className="eldonia-eyebrow">{copy.heading}</h2>
      <form onSubmit={handleSave} className="eldonia-card space-y-4">
        <p className="eldonia-body text-sm text-eldonia-text-muted">{copy.lead}</p>
        <ul className="space-y-3">
          {prefs.map((pref) => (
            <li
              key={pref.key}
              className="flex items-start gap-3 rounded-lg border border-eldonia-border px-4 py-3"
            >
              <input
                id={pref.key}
                type="checkbox"
                checked={values[pref.key]}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [pref.key]: event.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 accent-eldonia-gold"
              />
              <label htmlFor={pref.key} className="min-w-0 flex-1 cursor-pointer">
                <span className="block text-sm font-medium text-eldonia-gold-light">
                  {pref.label}
                </span>
                <span className="eldonia-body mt-0.5 block text-xs text-eldonia-text-muted">
                  {pref.description}
                </span>
              </label>
            </li>
          ))}
        </ul>
        {error && <p className="eldonia-alert-error text-sm">{error}</p>}
        {message && <p className="text-sm text-eldonia-gold">{message}</p>}
        <button type="submit" disabled={loading} className="eldonia-btn-primary disabled:opacity-60">
          {loading ? copy.saving : copy.submit}
        </button>
      </form>
    </section>
  );
}
