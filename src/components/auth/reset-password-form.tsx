"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContent } from "@/components/providers/locale-provider";
import { resolvePostLoginPath } from "@/lib/auth/redirect";
import { mapAuthError } from "@/lib/supabase/env";

type ResetPasswordFormProps = {
  redirectTo: string;
};

export function ResetPasswordForm({ redirectTo }: ResetPasswordFormProps) {
  const t = useContent();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? t.auth.resetPasswordFailed);
        setLoading(false);
        return;
      }

      router.refresh();
      window.location.assign(resolvePostLoginPath(redirectTo));
    } catch (caught) {
      setError(mapAuthError(caught));
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="eldonia-label">
          {t.auth.newPassword}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="eldonia-input"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="confirm-password" className="eldonia-label">
          {t.auth.confirmPassword}
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="eldonia-input"
        />
      </div>

      {error && <p className="eldonia-alert-error">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="eldonia-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? t.auth.resetPasswordLoading : t.auth.resetPasswordSubmit}
      </button>

      <p className="text-center text-sm text-eldonia-text-muted">
        <Link href="/auth/login" className="eldonia-link font-medium">
          {t.auth.backToLogin}
        </Link>
      </p>
    </form>
  );
}
