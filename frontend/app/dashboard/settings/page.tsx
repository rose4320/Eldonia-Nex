"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"account" | "password" | "subscription" | "privacy">("account");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: "error", text: "新しいパスワードが一致しません。" });
      return;
    }

    if (passwordData.new_password.length < 8) {
      setMessage({ type: "error", text: "パスワードは8文字以上にしてください。" });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        })
      });

      if (res.ok) {
        setMessage({ type: "success", text: "パスワードを変更しました！" });
        setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
      } else {
        const error = await res.json();
        setMessage({ type: "error", text: error.message || "変更に失敗しました。" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "ネットワークエラーが発生しました。" });
    }

    setIsSubmitting(false);
  };

  const handleDeleteAccount = async () => {
    if (!confirm("本当にアカウントを削除しますか？この操作は取り消せません。")) {
      return;
    }

    if (!confirm("すべてのデータが削除されます。本当によろしいですか？")) {
      return;
    }

    try {
      const res = await fetch("/api/users/delete-account", {
        method: "DELETE",
        credentials: "include"
      });

      if (res.ok) {
        alert("アカウントを削除しました。");
        router.push("/");
      } else {
        alert("削除に失敗しました。");
      }
    } catch (error) {
      alert("エラーが発生しました。");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-purple-300 hover:text-purple-100 mb-4 flex items-center gap-2 transition-colors"
          >
            <span>←</span> ダッシュボードに戻る
          </button>
          <h1 className="text-4xl font-bold text-purple-100 font-pt-serif">⚙️ アカウント設定</h1>
          <p className="text-purple-300 mt-2">セキュリティとプライバシーを管理</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* サイドバー */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 rounded-xl shadow-lg p-4 sticky top-24">
              <nav className="space-y-2">
                {[
                  { id: "account", label: "アカウント", icon: "👤" },
                  { id: "password", label: "パスワード", icon: "🔐" },
                  { id: "subscription", label: "サブスクリプション", icon: "💳" },
                  { id: "privacy", label: "プライバシー", icon: "🔒" }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as typeof activeSection)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-lg"
                        : "text-purple-300 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="md:col-span-3">
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 rounded-2xl shadow-2xl p-8">
              {/* メッセージ */}
              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.type === "success" 
                    ? "bg-green-900/50 border-2 border-green-500 text-green-200" 
                    : "bg-red-900/50 border-2 border-red-500 text-red-200"
                }`}>
                  <p className="font-semibold">{message.text}</p>
                </div>
              )}

              {/* アカウント情報 */}
              {activeSection === "account" && (
                <div>
                  <h2 className="text-2xl font-bold text-purple-100 mb-6">👤 アカウント情報</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-900/50 rounded-xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-purple-200 font-semibold">ユーザー名</p>
                          <p className="text-purple-100 text-lg">{user.username}</p>
                        </div>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                          変更
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-900/50 rounded-xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-purple-200 font-semibold">メールアドレス</p>
                          <p className="text-purple-100 text-lg">{user.email || "未設定"}</p>
                        </div>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                          変更
                        </button>
                      </div>
                    </div>

                    <div className="bg-red-900/20 border-2 border-red-500/50 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-red-300 mb-3">⚠️ 危険な操作</h3>
                      <p className="text-red-200 mb-4 text-sm">
                        アカウントを削除すると、すべてのデータが永久に削除されます。この操作は取り消せません。
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                      >
                        アカウントを削除
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* パスワード変更 */}
              {activeSection === "password" && (
                <div>
                  <h2 className="text-2xl font-bold text-purple-100 mb-6">🔐 パスワード変更</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label htmlFor="current_password" className="block text-sm font-semibold text-purple-200 mb-2">
                        現在のパスワード
                      </label>
                      <input
                        type="password"
                        id="current_password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-950 border-2 border-purple-500/50 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="new_password" className="block text-sm font-semibold text-purple-200 mb-2">
                        新しいパスワード
                      </label>
                      <input
                        type="password"
                        id="new_password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-950 border-2 border-purple-500/50 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        minLength={8}
                        required
                      />
                      <p className="text-purple-400 text-xs mt-1">8文字以上で設定してください</p>
                    </div>

                    <div>
                      <label htmlFor="confirm_password" className="block text-sm font-semibold text-purple-200 mb-2">
                        新しいパスワード（確認）
                      </label>
                      <input
                        type="password"
                        id="confirm_password"
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-950 border-2 border-purple-500/50 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        minLength={8}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-gradient-to-r from-purple-600 to-purple-400 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:from-purple-700 hover:to-purple-500"
                      }`}
                    >
                      {isSubmitting ? "変更中..." : "パスワードを変更"}
                    </button>
                  </form>
                </div>
              )}

              {/* サブスクリプション */}
              {activeSection === "subscription" && (
                <div>
                  <h2 className="text-2xl font-bold text-purple-100 mb-6">💳 サブスクリプション管理</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-900/50 rounded-xl p-6">
                      <p className="text-purple-200 font-semibold mb-2">現在のプラン</p>
                      <p className="text-purple-100 text-2xl font-bold mb-4">🆓 Free</p>
                      <button className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg">
                        プランをアップグレード
                      </button>
                    </div>

                    <div className="bg-purple-900/30 rounded-xl p-6 border-2 border-purple-500/30">
                      <h3 className="text-lg font-semibold text-purple-200 mb-3">💡 プレミアム機能</h3>
                      <ul className="space-y-2 text-purple-300 text-sm">
                        <li>✓ 無制限のストレージ</li>
                        <li>✓ 優先サポート</li>
                        <li>✓ 高度な分析ツール</li>
                        <li>✓ カスタムドメイン</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* プライバシー */}
              {activeSection === "privacy" && (
                <div>
                  <h2 className="text-2xl font-bold text-purple-100 mb-6">🔒 プライバシー設定</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-900/50 rounded-xl p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-purple-200 font-semibold">プロフィールの公開</p>
                          <p className="text-purple-300 text-sm">他のユーザーがあなたのプロフィールを閲覧できます</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-900/50 rounded-xl p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-purple-200 font-semibold">作品のコメント</p>
                          <p className="text-purple-300 text-sm">他のユーザーがあなたの作品にコメントできます</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-900/50 rounded-xl p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-purple-200 font-semibold">メール通知</p>
                          <p className="text-purple-300 text-sm">新しいフォロワーやいいねの通知を受け取ります</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

