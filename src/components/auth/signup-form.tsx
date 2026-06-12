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

type SignupFormProps = {
  redirectTo: string;
  supabaseConfigured: boolean;
};

export function SignupForm({ redirectTo, supabaseConfigured }: SignupFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push(sanitizeRedirectTo(redirectTo));
        router.refresh();
        return;
      }

      setMessage("確認メールを送信しました。メール内のリンクから登録を完了してください。");
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
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="eldonia-input"
        />
      </div>

      {error && <p className="eldonia-alert-error">{error}</p>}
      {message && <p className="eldonia-alert-success">{message}</p>}

      <button
        type="submit"
        disabled={loading || !supabaseConfigured}
        className="eldonia-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "登録中..." : "アカウント作成"}
      </button>

      <p className="text-center text-sm text-eldonia-text-muted">
        すでにアカウントをお持ちの方は{" "}
        <Link
          href={`/auth/login?redirect_to=${encodeURIComponent(redirectTo)}`}
          className="eldonia-link font-medium"
        >
          ログイン
        </Link>
      </p>
    </form>
  );
}
