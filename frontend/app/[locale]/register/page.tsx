"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

interface FormData {
  email: string;
  password: string;
  passwordConfirm: string;
  plan: string;
  agree: boolean;
  newsletter: boolean;
}

// ブラウザのホスト名を使用してAPIのベースURLを動的に決定
// クライアントサイドでのみ実行される
const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return ''; // SSR時は空文字を返す
  }
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  return `http://${hostname}:8000`;
};

function RegisterPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'ja';

  const plan = searchParams.get("plan") || "free";
  const planName = searchParams.get("planName") || "Free";

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
    passwordConfirm: "",
    plan: plan,
    agree: false,
    newsletter: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = (): boolean => {
    setError("");

    if (!form.email) {
      setError("メールアドレスを入力してください");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("有効なメールアドレスを入力してください");
      return false;
    }
    if (!form.password) {
      setError("パスワードを入力してください");
      return false;
    }
    if (form.password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return false;
    }
    if (form.password !== form.passwordConfirm) {
      setError("パスワードが一致しません");
      return false;
    }
    if (!form.agree) {
      setError("利用規約に同意してください");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const API_BASE_URL = getApiBaseUrl();
      const res = await fetch(`${API_BASE_URL}/api/v1/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          plan: form.plan,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // 登録成功 - ログインページへリダイレクト
        router.push(`/${currentLocale}/signin?registered=true&plan=${form.plan}`);
      } else {
        setError(data.error || "登録に失敗しました。もう一度お試しください。");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("登録に失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <Link href={`/${currentLocale}`} className="inline-block mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent font-pt-serif">
              Eldonia-Nex
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            🎨 新規登録
          </h2>
          <p className="text-gray-400">
            クリエイターとしての旅を始めましょう
          </p>
        </div>

        {/* プラン情報 */}
        {plan !== "free" && (
          <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-amber-300">選択プラン</span>
              <span className="text-amber-400 font-bold text-lg">{planName}</span>
            </div>
          </div>
        )}

        {/* 登録フォーム */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 rounded-2xl shadow-2xl p-8">
          {/* エラーメッセージ */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* メールアドレス */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                メールアドレス <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>

            {/* パスワード */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                パスワード <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="8文字以上"
                className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>

            {/* パスワード確認 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                パスワード（確認） <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                name="passwordConfirm"
                value={form.passwordConfirm}
                onChange={handleChange}
                placeholder="もう一度入力"
                className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>

            {/* 利用規約 */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-300">
                  <Link href={`/${currentLocale}/terms`} className="text-indigo-400 hover:text-indigo-300 underline">利用規約</Link>
                  と
                  <Link href={`/${currentLocale}/terms/privacy`} className="text-indigo-400 hover:text-indigo-300 underline">プライバシーポリシー</Link>
                  に同意します <span className="text-red-400">*</span>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={form.newsletter}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-300">
                  お知らせメールを受け取る（任意）
                </span>
              </label>
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 ${isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/25"
                }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  登録中...
                </span>
              ) : (
                "🚀 アカウントを作成"
              )}
            </button>
          </form>

          {/* ヒント */}
          <div className="mt-6 p-4 bg-indigo-900/30 border border-indigo-500/30 rounded-lg">
            <p className="text-indigo-300 text-sm">
              💡 登録後、ダッシュボードでプロフィール（表示名、アバターなど）を設定できます
            </p>
          </div>

          {/* ログインリンク */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              すでにアカウントをお持ちですか？{" "}
              <Link
                href={`/${currentLocale}/signin`}
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                ログイン
              </Link>
            </p>
          </div>
        </div>

        {/* フッター */}
        <p className="text-center text-gray-500 text-sm mt-8">
          © 2024 Eldonia-Nex. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <RegisterPageInner />
    </Suspense>
  );
}
