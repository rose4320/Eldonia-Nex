"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { sanitizeRedirectTo } from "@/lib/auth/redirect";
import {
  mapAuthError,
  supabaseSetupMessage,
} from "@/lib/supabase/env";

type LoginFormProps = {
  redirectTo: string;
  supabaseConfigured: boolean;
};

export function LoginForm({ redirectTo, supabaseConfigured }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
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
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      router.push(sanitizeRedirectTo(redirectTo));
      router.refresh();
    } catch (caught) {
      setError(mapAuthError(caught));
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="eldonia-label">
          メールアドレス
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
        <label htmlFor="password" className="eldonia-label">
          パスワード
        </label>
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
        {loading ? "ログイン中..." : "ログイン"}
      </button>

      <p className="text-center text-sm text-eldonia-text-muted">
        アカウントをお持ちでない方は{" "}
        <Link
          href={`/auth/signup?redirect_to=${encodeURIComponent(redirectTo)}`}
          className="eldonia-link font-medium"
        >
          新規登録
        </Link>
      </p>
    </form>
  );
}
