"use client";

import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

function SignInPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'ja';
  const { login, user } = useAuth();
  const plan = searchParams.get("plan") || "Free";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    }
    
    if (plan !== "Free") {
      if (!cardNumber || !cardExpiry || !cardCvc) {
        setError("有料プランの場合、カード情報を入力してください。");
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      // AuthContextのlogin関数を使用
      await login(email, password);
      
      // ログイン成功後、ユーザーの言語設定に基づいてホームページにリダイレクト
      const storedUser = localStorage.getItem('eldonia_user');
      let userLocale = currentLocale;
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          userLocale = userData.preferred_language || currentLocale;
        } catch {
          // パースエラーの場合は現在のlocaleを使用
        }
      }
      window.location.href = `/${userLocale}`;
    } catch (err) {
      setError("ログインに失敗しました。メールアドレスとパスワードを確認してください。");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950 py-12 px-4">
      <div className="w-full max-w-md bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-purple-200 drop-shadow-lg font-pt-serif">
          サインイン
        </h1>
        
        {/* テスト用アカウント情報 */}
        <div className="mb-6 p-4 bg-blue-900/30 border-2 border-blue-500/50 rounded-lg">
          <h3 className="text-blue-200 font-semibold mb-2 flex items-center gap-2">
            <span>ℹ️</span> テスト用アカウント
          </h3>
          <div className="text-xs text-blue-100 space-y-1">
            <p><strong>デモユーザー:</strong> demo@eldonia-nex.com / demo123</p>
            <p><strong>クリエイター:</strong> creator@eldonia-nex.com / creator123</p>
            <p><strong>管理者:</strong> admin@eldonia-nex.com / admin123</p>
          </div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-purple-100">
              メールアドレス
            </label>
            <input
              type="email"
              className="w-full border border-purple-400 bg-gray-950 text-purple-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-purple-100">
              パスワード
            </label>
            <input
              type="password"
              className="w-full border border-purple-400 bg-gray-950 text-purple-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {plan !== "Free" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1 text-purple-100">
                  カード番号
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                  className="w-full border border-purple-400 bg-gray-950 text-purple-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required={plan !== "Free"}
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-purple-100">
                    有効期限
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="MM/YY"
                    className="w-full border border-purple-400 bg-gray-950 text-purple-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required={plan !== "Free"}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-purple-100">
                    CVC
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="123"
                    className="w-full border border-purple-400 bg-gray-950 text-purple-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    required={plan !== "Free"}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </>
          )}
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/50 rounded p-3">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-purple-600 to-purple-400 text-white py-2 rounded font-semibold shadow-lg transition-all duration-200 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-purple-700 hover:to-purple-500 hover:shadow-xl"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ログイン中...
              </span>
            ) : (
              "サインイン"
            )}
          </button>
        </form>
        <div className="mt-6 text-center space-y-2">
          <Link href={`/${currentLocale}/plans`} className="text-purple-300 hover:underline block">
            プランを選択する
          </Link>
          <Link href={`/${currentLocale}/register`} className="text-purple-300 hover:underline block">
            新規登録はこちら
          </Link>
        </div>
      </div>
    </div>
  );
}

const SignInPage: React.FC = () => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950">
        <div className="text-purple-200">読み込み中...</div>
      </div>
    }
  >
    <SignInPageInner />
  </Suspense>
);

export default SignInPage;

