"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContent } from "@/components/providers/locale-provider";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { resolvePostLoginPath } from "@/lib/auth/redirect";
import {
  mapAuthError,
  supabaseSetupMessage,
} from "@/lib/supabase/env";

type LoginFormProps = {
  redirectTo: string;
  supabaseConfigured: boolean;
  initialError?: string | null;
};

export function LoginForm({
  redirectTo,
  supabaseConfigured,
  initialError = null,
}: LoginFormProps) {
  const t = useContent();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!supabaseConfigured) {
      setError(supabaseSetupMessage());
      setLoading(false);
      return;
    }

    try {
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, redirectTo }),
      });

      const payload = (await loginResponse.json()) as { error?: string; destination?: string };

      if (!loginResponse.ok) {
        setError(payload.error ?? "ログインに失敗しました。");
        setLoading(false);
        return;
      }

      router.refresh();
      window.location.assign(payload.destination ?? resolvePostLoginPath(redirectTo));
    } catch (caught) {
      setError(mapAuthError(caught));
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="eldonia-label">
          {t.auth.email}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="eldonia-input"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="password" className="eldonia-label">
            {t.auth.password}
          </label>
          <Link
            href="/auth/forgot-password"
            className="eldonia-link text-xs font-medium"
          >
            {t.auth.forgotPasswordLink}
          </Link>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="eldonia-input"
        />
      </div>

      {error && <p className="eldonia-alert-error">{error}</p>}

      <button
        type="submit"
        disabled={loading || !supabaseConfigured}
        className="eldonia-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? t.auth.loginLoading : t.auth.loginSubmit}
      </button>

      <OAuthButtons redirectTo={redirectTo} />

      <p className="text-center text-sm text-eldonia-text-muted">
        {t.auth.noAccount}{" "}
        <Link
          href={`/auth/signup?redirect_to=${encodeURIComponent(redirectTo)}`}
          className="eldonia-link font-medium"
        >
          {t.chrome.signup}
        </Link>
      </p>
    </form>
  );
}
