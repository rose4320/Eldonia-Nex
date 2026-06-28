"use client";

import { useState } from "react";
import Link from "next/link";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { mapAuthError, supabaseSetupMessage } from "@/lib/supabase/env";

type ForgotPasswordFormProps = {
  supabaseConfigured: boolean;
};

export function ForgotPasswordForm({ supabaseConfigured }: ForgotPasswordFormProps) {
  const t = useContent();
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (!supabaseConfigured) {
      setError(supabaseSetupMessage());
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? t.auth.forgotPasswordFailed);
        setLoading(false);
        return;
      }

      setMessage(t.auth.forgotPasswordSent);
      setLoading(false);
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

      {error && <p className="eldonia-alert-error">{error}</p>}
      {message && <p className="text-sm text-eldonia-gold">{message}</p>}

      <button
        type="submit"
        disabled={loading || !supabaseConfigured}
        className="eldonia-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? t.auth.forgotPasswordLoading : t.auth.forgotPasswordSubmit}
      </button>

      <p className="text-center text-sm text-eldonia-text-muted">
        <Link href="/auth/login" className="eldonia-link font-medium">
          {t.auth.backToLogin}
        </Link>
      </p>
    </form>
  );
}
