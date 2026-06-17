"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContent } from "@/components/providers/locale-provider";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

type ProfileFormProps = {
  profile: Profile;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const { forms } = useContent();
  const copy = forms.profile;
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [username, setUsername] = useState(profile.username ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [isCreator, setIsCreator] = useState(profile.is_creator);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        username: username.trim() || null,
        bio: bio.trim() || null,
        is_creator: isCreator,
      })
      .eq("id", profile.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setMessage(copy.saved);
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="display_name" className="eldonia-label">
          {copy.displayName}
        </label>
        <input
          id="display_name"
          type="text"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          className="eldonia-input"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="eldonia-label">
          {copy.username}
        </label>
        <input
          id="username"
          type="text"
          pattern="[a-z0-9_]{3,30}"
          title={copy.usernameTitle}
          value={username}
          onChange={(event) => setUsername(event.target.value.toLowerCase())}
          className="eldonia-input"
        />
        <p className="eldonia-hint">{copy.usernameHint}</p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="bio" className="eldonia-label">
          {copy.bio}
        </label>
        <textarea
          id="bio"
          rows={4}
          maxLength={500}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          className="eldonia-textarea"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-eldonia-text-muted">
        <input
          type="checkbox"
          checked={isCreator}
          onChange={(event) => setIsCreator(event.target.checked)}
          className="rounded border-eldonia-gold/40 bg-eldonia-surface accent-eldonia-gold"
        />
        {copy.creatorToggle}
      </label>

      {error && <p className="eldonia-alert-error">{error}</p>}
      {message && <p className="eldonia-alert-success">{message}</p>}

      <button type="submit" disabled={loading} className="eldonia-btn-primary w-fit">
        {loading ? copy.saving : copy.submit}
      </button>
    </form>
  );
}
