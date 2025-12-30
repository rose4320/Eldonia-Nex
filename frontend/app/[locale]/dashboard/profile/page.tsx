"use client";

import { useAuth } from "@/app/context/AuthContext";
import ImageUpload from "@/components/ui/ImageUpload";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ブラウザのホスト名を使用してAPIのベースURLを動的に決定
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000/api/v1';
    }
    return `http://${hostname}:8000/api/v1`;
  }
  return 'http://localhost:8000/api/v1';
};

export default function ProfileEditPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'ja';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    avatar_url: "",
    email: "",
    timezone: "Asia/Tokyo",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${currentLocale}/signin`);
    } else if (user) {
      // ユーザー情報からフォームを初期化
      setFormData({
        display_name: user.display_name || user.username || "",
        bio: "",
        avatar_url: user.avatar_url || "",
        email: user.email || "",
        timezone: "Asia/Tokyo",
      });
    }
  }, [user, loading, router, currentLocale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const authToken = localStorage.getItem('authToken');
      const API_BASE_URL = getApiBaseUrl();
      
      // ファイルがある場合は先にアップロード
      let uploadedAvatarUrl = formData.avatar_url;
      
      if (avatarFile) {
        const formDataForUpload = new FormData();
        formDataForUpload.append("file", avatarFile);
        
        const uploadRes = await fetch(`${API_BASE_URL}/users/upload-avatar/`, {
          method: "POST",
          headers: {
            'Authorization': `Token ${authToken}`,
          },
          credentials: "include",
          body: formDataForUpload
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedAvatarUrl = uploadData.url;
        } else {
          setMessage({ type: "error", text: "画像のアップロードに失敗しました。" });
          setIsSubmitting(false);
          return;
        }
      }

      // プロフィール更新APIを呼び出し
      const res = await fetch(`${API_BASE_URL}/users/me/profile/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Token ${authToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          display_name: formData.display_name,
          bio: formData.bio,
          avatar_url: uploadedAvatarUrl,
          email: formData.email,
        })
      });

      if (res.ok) {
        setMessage({ type: "success", text: "プロフィールを更新しました！" });
        // ローカルストレージのユーザー情報も更新
        const storedUser = localStorage.getItem('eldonia_user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            userData.display_name = formData.display_name;
            userData.avatar_url = uploadedAvatarUrl;
            userData.email = formData.email;
            localStorage.setItem('eldonia_user', JSON.stringify(userData));
          } catch {}
        }
        // 1秒後にダッシュボードにリダイレクト
        setTimeout(() => {
          window.location.href = `/${currentLocale}/dashboard`;
        }, 1000);
      } else {
        const error = await res.json().catch(() => ({}));
        setMessage({ type: "error", text: error.detail || error.message || "更新に失敗しました。" });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage({ type: "error", text: "ネットワークエラーが発生しました。" });
    }

    setIsSubmitting(false);
  };

  const handleImageChange = (file: File | null, previewUrl: string) => {
    setAvatarFile(file);
    setFormData({
      ...formData,
      avatar_url: previewUrl
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 rounded-2xl shadow-2xl p-8">
          {/* ヘッダー */}
          <div className="mb-8">
            <button
              onClick={() => router.push(`/${currentLocale}/dashboard`)}
              className="text-purple-300 hover:text-purple-100 mb-4 flex items-center gap-2 transition-colors"
            >
              <span>←</span> ダッシュボードに戻る
            </button>
            <h1 className="text-4xl font-bold text-purple-100 font-pt-serif">👤 プロフィール編集</h1>
            <p className="text-purple-300 mt-2">あなたの情報を更新しましょう</p>
          </div>

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

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 表示名 */}
            <div>
              <label htmlFor="display_name" className="block text-sm font-semibold text-purple-200 mb-2">
                ✨ 表示名
              </label>
              <input
                type="text"
                id="display_name"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-950 border-2 border-purple-500/50 rounded-lg text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="あなたの表示名"
                maxLength={100}
              />
              <p className="text-purple-400 text-xs mt-1">他のユーザーに表示される名前です</p>
            </div>

            {/* メールアドレス */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-purple-200 mb-2">
                📧 メールアドレス
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-950 border-2 border-purple-500/50 rounded-lg text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* 自己紹介 */}
            <div>
              <label htmlFor="bio" className="block text-sm font-semibold text-purple-200 mb-2">
                📝 自己紹介
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-950 border-2 border-purple-500/50 rounded-lg text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="あなたについて教えてください..."
                maxLength={500}
              />
              <p className="text-purple-400 text-xs mt-1">
                {formData.bio.length}/500文字
              </p>
            </div>

            {/* アバター画像アップロード */}
            <div>
              <label className="block text-sm font-semibold text-purple-200 mb-2">
                🖼️ アバター画像
              </label>
              <ImageUpload
                currentImageUrl={formData.avatar_url}
                onImageChange={handleImageChange}
                maxSizeMB={5}
                recommendedSize="400x400px"
              />
              <p className="text-purple-400 text-xs mt-2">
                ドラッグ&ドロップまたはクリックして画像をアップロード
              </p>
            </div>

            {/* アバターURL（従来の方法も残す） */}
            <div>
              <label htmlFor="avatar_url" className="block text-sm font-semibold text-purple-200 mb-2">
                🔗 またはアバターURL
              </label>
              <input
                type="url"
                id="avatar_url"
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-950 border-2 border-purple-500/50 rounded-lg text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-purple-400 text-xs mt-1">
                URLを直接指定することもできます
              </p>
              {formData.avatar_url && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={formData.avatar_url}
                    alt="Avatar Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* タイムゾーン */}
            <div>
              <label htmlFor="timezone" className="block text-sm font-semibold text-purple-200 mb-2">
                🌏 タイムゾーン
              </label>
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-950 border-2 border-purple-500/50 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="Asia/Tokyo">日本 (東京)</option>
                <option value="America/New_York">アメリカ東部 (ニューヨーク)</option>
                <option value="America/Los_Angeles">アメリカ西部 (ロサンゼルス)</option>
                <option value="Europe/London">イギリス (ロンドン)</option>
                <option value="Europe/Paris">フランス (パリ)</option>
                <option value="Australia/Sydney">オーストラリア (シドニー)</option>
              </select>
            </div>

            {/* ボタン */}
            <div className="flex gap-4 pt-6 border-t-2 border-purple-500/30">
              <button
                type="button"
                onClick={() => router.push(`/${currentLocale}/dashboard`)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 bg-gradient-to-r from-purple-600 to-purple-400 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg ${
                  isSubmitting 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:from-purple-700 hover:to-purple-500 hover:shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    更新中...
                  </span>
                ) : (
                  "💾 保存する"
                )}
              </button>
            </div>
          </form>

          {/* 追加情報 */}
          <div className="mt-8 p-6 bg-purple-900/30 rounded-xl border-2 border-purple-500/30">
            <h3 className="text-lg font-semibold text-purple-200 mb-3">💡 ヒント</h3>
            <ul className="space-y-2 text-purple-300 text-sm">
              <li>• プロフィールを充実させると、他のユーザーからの信頼度が上がります</li>
              <li>• アバターは正方形の画像を推奨します（推奨サイズ: 400x400px以上）</li>
              <li>• 自己紹介はあなたの作品スタイルや得意分野を書くと効果的です</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

