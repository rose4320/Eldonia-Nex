"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useContent } from "@/components/providers/locale-provider";
import {
  enabledOAuthProviders,
  signInWithProvider,
  type OAuthProvider,
} from "@/lib/auth/oauth";
import { mapAuthError } from "@/lib/supabase/env";

type OAuthButtonsProps = {
  redirectTo: string;
  signup?: boolean;
  referralCode?: string | null;
};

const PROVIDER_META: Record<
  OAuthProvider,
  { label: string; icon: ReactNode; bg: string; fg: string }
> = {
  google: {
    label: "Google",
    icon: <GoogleIcon />,
    bg: "#ffffff",
    fg: "#1f1f1f",
  },
  facebook: {
    label: "Facebook",
    icon: <FacebookIcon />,
    bg: "#1877f2",
    fg: "#ffffff",
  },
  twitter: {
    label: "X",
    icon: <XIcon />,
    bg: "#000000",
    fg: "#ffffff",
  },
  discord: {
    label: "Discord",
    icon: <DiscordIcon />,
    bg: "#5865f2",
    fg: "#ffffff",
  },
};

export function OAuthButtons({
  redirectTo,
  signup = false,
  referralCode = null,
}: OAuthButtonsProps) {
  const t = useContent();
  const [pending, setPending] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const providers = enabledOAuthProviders();
  if (providers.length === 0) {
    return null;
  }

  async function handleSignIn(provider: OAuthProvider) {
    setError(null);
    setPending(provider);

    try {
      await signInWithProvider(provider, {
        redirectTo,
        origin: window.location.origin,
        signup,
        referralCode,
      });
    } catch (caught) {
      setError(mapAuthError(caught));
      setPending(null);
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-eldonia-text-muted">
        <span className="h-px flex-1 bg-eldonia-border" />
        <span>{t.auth.oauthDivider}</span>
        <span className="h-px flex-1 bg-eldonia-border" />
      </div>

      <div
        className={`grid gap-2 ${providers.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
      >
        {providers.map((provider) => {
          const meta = PROVIDER_META[provider];
          const isPending = pending === provider;
          return (
            <button
              key={provider}
              type="button"
              onClick={() => handleSignIn(provider)}
              disabled={pending !== null}
              className="flex items-center justify-center gap-2 rounded-md border border-eldonia-border px-3 py-2.5 text-sm font-medium transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: meta.bg, color: meta.fg }}
              aria-label={`${meta.label}`}
            >
              {meta.icon}
              <span>{isPending ? t.auth.oauthLoading : meta.label}</span>
            </button>
          );
        })}
      </div>

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

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93zm-1.29 19.5h2.04L6.48 3.24H4.29z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.32 4.37A19.8 19.8 0 0 0 15.45 3a13.6 13.6 0 0 0-.62 1.27 18.3 18.3 0 0 0-5.66 0A13 13 0 0 0 8.55 3a19.7 19.7 0 0 0-4.88 1.37C.55 8.98-.3 13.48.13 17.92a19.9 19.9 0 0 0 6.03 3.05c.49-.66.92-1.36 1.29-2.1-.71-.27-1.39-.6-2.03-.99.17-.13.34-.26.5-.4a14.2 14.2 0 0 0 12.16 0c.16.14.33.27.5.4-.64.39-1.32.72-2.03.99.37.74.8 1.44 1.29 2.1a19.9 19.9 0 0 0 6.03-3.05c.5-5.15-.85-9.61-3.55-13.55zM8.02 15.33c-1.18 0-2.15-1.08-2.15-2.42s.95-2.42 2.15-2.42 2.17 1.09 2.15 2.42c0 1.34-.95 2.42-2.15 2.42zm7.96 0c-1.18 0-2.15-1.08-2.15-2.42s.95-2.42 2.15-2.42 2.17 1.09 2.15 2.42c0 1.34-.94 2.42-2.15 2.42z" />
    </svg>
  );
}
