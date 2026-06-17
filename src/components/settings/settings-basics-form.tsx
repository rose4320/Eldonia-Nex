"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useContent } from "@/components/providers/locale-provider";
import { awardUserExp } from "@/lib/exp/award-exp";
import { createClient } from "@/lib/supabase/client";
import type { Profile, UserSettings } from "@/types/database";

const AVATAR_BUCKET = "avatars";
const AVATAR_FALLBACK_BUCKET = "artworks";
const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
const AVATAR_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

function isBasicsComplete(values: {
  displayName: string | null;
  legalName: string | null;
  phone: string | null;
  address1: string | null;
  bankHolder: string | null;
}): boolean {
  return Boolean(
    values.displayName?.trim() &&
      values.legalName?.trim() &&
      values.phone?.trim() &&
      values.address1?.trim() &&
      values.bankHolder?.trim(),
  );
}

type SettingsBasicsFormProps = {
  userId: string;
  email: string | null;
  profile: Profile;
  settings: UserSettings;
};

export function SettingsBasicsForm({
  userId,
  email,
  profile,
  settings,
}: SettingsBasicsFormProps) {
  const router = useRouter();
  const { settingsUi } = useContent();
  const copy = settingsUi.basics;
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [username, setUsername] = useState(profile.username ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [isCreator, setIsCreator] = useState(profile.is_creator);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [legalName, setLegalName] = useState(settings.legal_name ?? "");
  const [country, setCountry] = useState(settings.country ?? "JP");
  const [address1, setAddress1] = useState(settings.address_line1 ?? "");
  const [address2, setAddress2] = useState(settings.address_line2 ?? "");
  const [phone, setPhone] = useState(settings.phone ?? "");
  const [bankName, setBankName] = useState(settings.bank_name ?? "");
  const [bankBranch, setBankBranch] = useState(settings.bank_branch ?? "");
  const [bankType, setBankType] = useState(settings.bank_account_type ?? copy.bankTypeSavings);
  const [bankNumber, setBankNumber] = useState(settings.bank_account_number ?? "");
  const [bankHolder, setBankHolder] = useState(settings.bank_account_holder ?? "");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [basicsExpAwarded, setBasicsExpAwarded] = useState(false);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  function handleAvatarChange(file: File | null) {
    setError(null);
    setMessage(null);

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }

    if (!file) {
      setAvatarFile(null);
      return;
    }

    if (!AVATAR_MIME_TYPES.includes(file.type)) {
      setAvatarFile(null);
      setError(copy.avatarErrFormat);
      return;
    }

    if (file.size > AVATAR_MAX_BYTES) {
      setAvatarFile(null);
      setError(copy.avatarErrSize);
      return;
    }

    setRemoveAvatar(false);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function uploadAvatar(
    supabase: ReturnType<typeof createClient>,
    file: File,
  ): Promise<{ publicUrl: string | null; skipped: boolean }> {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const buckets = [
      { name: AVATAR_BUCKET, path: `${userId}/${crypto.randomUUID()}.${extension}` },
      {
        name: AVATAR_FALLBACK_BUCKET,
        path: `${userId}/avatars/${crypto.randomUUID()}.${extension}`,
      },
    ];

    for (const bucket of buckets) {
      const { error: uploadError } = await supabase.storage
        .from(bucket.name)
        .upload(bucket.path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket.name).getPublicUrl(bucket.path);
        return { publicUrl, skipped: false };
      }
    }

    return { publicUrl: null, skipped: true };
  }

  async function awardBasicsExpIfNeeded(supabase: ReturnType<typeof createClient>) {
    const nextBasicsComplete = isBasicsComplete({
      displayName,
      legalName,
      phone,
      address1,
      bankHolder,
    });

    if (!nextBasicsComplete || basicsExpAwarded) return false;

    const gained = await awardUserExp(supabase, "profile.basics", "profile.basics");
    if (gained <= 0) return false;
    setBasicsExpAwarded(true);
    return gained;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const supabase = createClient();
    let nextAvatarUrl = removeAvatar ? null : avatarUrl;
    let avatarSkipped = false;

    if (avatarFile) {
      const upload = await uploadAvatar(supabase, avatarFile);
      avatarSkipped = upload.skipped;
      if (upload.publicUrl) nextAvatarUrl = upload.publicUrl;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        username: username.trim() || null,
        avatar_url: nextAvatarUrl,
        bio: bio.trim() || null,
        is_creator: isCreator,
      })
      .eq("id", userId);

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    const { error: settingsError } = await supabase.from("user_settings").upsert(
      {
        user_id: userId,
        legal_name: legalName.trim() || null,
        country: country.trim() || "JP",
        address_line1: address1.trim() || null,
        address_line2: address2.trim() || null,
        phone: phone.trim() || null,
        bank_name: bankName.trim() || null,
        bank_branch: bankBranch.trim() || null,
        bank_account_type: bankType.trim() || null,
        bank_account_number: bankNumber.trim() || null,
        bank_account_holder: bankHolder.trim() || null,
      },
      { onConflict: "user_id" },
    );

    if (settingsError) {
      setError(settingsError.message);
      setLoading(false);
      return;
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }
    setAvatarUrl(nextAvatarUrl);
    setAvatarFile(null);
    setRemoveAvatar(false);
    const expGranted = await awardBasicsExpIfNeeded(supabase);
    const messages = [copy.saved];
    if (expGranted) messages.push(copy.basicsExpGranted(expGranted));
    if (avatarSkipped) messages.push(copy.avatarUploadSkipped);
    setMessage(messages.join(" "));
    setLoading(false);
    router.refresh();
  }

  const visibleAvatar = removeAvatar ? null : (avatarPreview ?? avatarUrl);
  const avatarInitial = (displayName || username || "A").slice(0, 1).toUpperCase();

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
      <fieldset className="space-y-4">
        <legend className="eldonia-eyebrow mb-2 block">{copy.publicProfile}</legend>
        <div className="flex flex-col gap-3 rounded border border-eldonia-gold/15 bg-eldonia-surface/40 p-3 sm:flex-row sm:items-center">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-eldonia-surface ring-1 ring-eldonia-gold/30">
            {visibleAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={visibleAvatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="font-display text-2xl font-bold text-eldonia-gold-light">
                {avatarInitial}
              </span>
            )}
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="avatar" className="eldonia-label">{copy.avatar}</label>
              <input
                id="avatar"
                type="file"
                accept={AVATAR_MIME_TYPES.join(",")}
                onChange={(e) => handleAvatarChange(e.target.files?.[0] ?? null)}
                className="eldonia-input"
              />
              <p className="eldonia-hint">{copy.avatarHint}</p>
            </div>
            {visibleAvatar && (
              <button
                type="button"
                className="eldonia-btn-ghost text-xs"
                onClick={() => {
                  handleAvatarChange(null);
                  setRemoveAvatar(true);
                }}
              >
                {copy.avatarRemove}
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="display_name" className="eldonia-label">{copy.displayName}</label>
          <input id="display_name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="eldonia-input" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="eldonia-label">{copy.username}</label>
          <input id="username" pattern="[a-z0-9_]{3,30}" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} className="eldonia-input" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="eldonia-label">{copy.email}</label>
          <input
            id="email"
            type="email"
            value={email ?? ""}
            readOnly
            className="eldonia-input cursor-not-allowed opacity-80"
          />
          <p className="eldonia-hint">{copy.emailReadonlyHint}</p>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="bio" className="eldonia-label">{copy.bio}</label>
          <textarea id="bio" rows={3} maxLength={500} value={bio} onChange={(e) => setBio(e.target.value)} className="eldonia-textarea" />
        </div>
        <label className="flex items-center gap-2 text-sm text-eldonia-text-muted">
          <input type="checkbox" checked={isCreator} onChange={(e) => setIsCreator(e.target.checked)} className="accent-eldonia-gold" />
          {copy.creatorToggle}
        </label>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="eldonia-eyebrow mb-2 block">{copy.identityBank}</legend>
        <div className="flex flex-col gap-1">
          <label htmlFor="legal_name" className="eldonia-label">{copy.legalName}</label>
          <input id="legal_name" value={legalName} onChange={(e) => setLegalName(e.target.value)} className="eldonia-input" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="country" className="eldonia-label">{copy.country}</label>
            <input id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="eldonia-input" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="eldonia-label">{copy.phone}</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="eldonia-input" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="address1" className="eldonia-label">{copy.address}</label>
          <input id="address1" value={address1} onChange={(e) => setAddress1(e.target.value)} className="eldonia-input" placeholder={copy.addressPlaceholder} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="address2" className="eldonia-label">{copy.address2}</label>
          <input id="address2" value={address2} onChange={(e) => setAddress2(e.target.value)} className="eldonia-input" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="bank_name" className="eldonia-label">{copy.bankName}</label>
            <input id="bank_name" value={bankName} onChange={(e) => setBankName(e.target.value)} className="eldonia-input" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="bank_branch" className="eldonia-label">{copy.bankBranch}</label>
            <input id="bank_branch" value={bankBranch} onChange={(e) => setBankBranch(e.target.value)} className="eldonia-input" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="bank_type" className="eldonia-label">{copy.bankType}</label>
            <select id="bank_type" value={bankType} onChange={(e) => setBankType(e.target.value)} className="eldonia-input">
              <option value={copy.bankTypeSavings}>{copy.bankTypeSavings}</option>
              <option value={copy.bankTypeChecking}>{copy.bankTypeChecking}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label htmlFor="bank_number" className="eldonia-label">{copy.bankNumber}</label>
            <input id="bank_number" value={bankNumber} onChange={(e) => setBankNumber(e.target.value)} className="eldonia-input" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="bank_holder" className="eldonia-label">{copy.bankHolder}</label>
          <input id="bank_holder" value={bankHolder} onChange={(e) => setBankHolder(e.target.value)} className="eldonia-input" />
        </div>
      </fieldset>

      {error && <p className="eldonia-alert-error lg:col-span-2">{error}</p>}
      {message && <p className="eldonia-alert-success lg:col-span-2">{message}</p>}

      <button type="submit" disabled={loading} className="eldonia-btn-primary w-fit lg:col-span-2">
        {loading ? copy.saving : copy.submit}
      </button>
    </form>
  );
}
