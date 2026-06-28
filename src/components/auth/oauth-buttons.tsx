"use client";

import { useState } from "react";
import { useContent } from "@/components/providers/locale-provider";
import { isGoogleAuthEnabled, signInWithGoogle } from "@/lib/auth/oauth";
import { mapAuthError } from "@/lib/supabase/env";

type OAuthButtonsProps = {
  redirectTo: string;
  signup?: boolean;
  referralCode?: string | null;
};

export function OAuthButtons({
  redirectTo,
  signup = false,
  referralCode = null,
}: OAuthButtonsProps) {
  const t = useContent();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isGoogleAuthEnabled()) {
    return null;
  }

  async function handleGoogleSignIn() {
    setError(null);
    setLoading(true);

    try {
      await signInWithGoogle({
        redirectTo,
        origin: window.location.origin,
        signup,
        referralCode,
      });
    } catch (caught) {
      setError(mapAuthError(caught));
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-eldonia-text-muted">
        <span className="h-px flex-1 bg-eldonia-border" />
        <span>{t.auth.oauthDivider}</span>
        <span className="h-px flex-1 bg-eldonia-border" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="eldonia-btn-secondary flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <GoogleIcon />
        {loading ? t.auth.oauthLoading : t.auth.continueWithGoogle}
      </button>

      {error && <p className="eldonia-alert-error text-sm">{error}</p>}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
