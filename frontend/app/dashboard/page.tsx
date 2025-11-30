"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

// 拡張ユーザー型
export type UserProfile = {
  id: number;
  username: string;
  email: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  subscription: "free" | "basic" | "premium" | "enterprise";
  subscription_plan: string | null;
  total_exp: number;
  current_level: number;
  account_status: string;
  date_joined: string;
};

export type UserStats = {
  artworks_count: number;
  followers_count: number;
  following_count: number;
  likes_received: number;
  total_views: number;
  revenue_total: number;
};

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "profile" | "settings" | "referral" | "activity">("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [referralCode, setReferralCode] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    totalRewards: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    } else if (user) {
      fetchUserData();
      fetchReferralData();
    }
  }, [user, loading, router]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // プロフィール取得
      const profileRes = await fetch(`/api/users/profile/${user?.id}`, {
        credentials: "include"
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }

      // 統計取得
      const statsRes = await fetch(`/api/users/stats/${user?.id}`, {
        credentials: "include"
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("ユーザーデータの取得に失敗:", error);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const fetchReferralData = async () => {
    if (!user?.id) {
      console.log("ユーザーIDがありません。ローカルで生成します。");
      generateReferralCodeLocally();
      return;
    }

    try {
      // バックエンドAPIから紹介コードと統計を取得
      const res = await fetch(`http://localhost:8001/api/v1/users/${user.id}/referral-code/`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/json"
        }
      });

      if (res.ok) {
        const data = await res.json();
        setReferralCode(data.referral_code);
        setReferralStats({
          totalReferrals: data.stats.total_referrals,
          activeReferrals: data.stats.active_referrals,
          totalRewards: data.stats.total_rewards
        });

        // QRコード生成
        generateQRCode(data.referral_url);
      } else {
        console.warn(`APIエラー: ${res.status} - ローカルで生成します`);
        // フォールバック: ローカルで生成
        generateReferralCodeLocally();
      }
    } catch (err) {
      console.warn("紹介コード取得エラー（バックエンドが起動していない可能性）:", err);
      // フォールバック: ローカルで生成（エラーではなく正常動作）
      generateReferralCodeLocally();
    }
  };

  const generateQRCode = async (url: string) => {
    try {
      const qrUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",  // 黒
          light: "#FFFFFF"  // 白
        }
      });
      setQrCodeUrl(qrUrl);
    } catch (err) {
      console.error("QRコード生成エラー:", err);
    }
  };

  const generateReferralCodeLocally = () => {
    if (!user) return;
    
    const code = `ELDONIA-${user.username.toUpperCase()}-${user.id}`;
    setReferralCode(code);
    
    // ダミー統計（開発用）
    setReferralStats({
      totalReferrals: 0,
      activeReferrals: 0,
      totalRewards: 0
    });
    
    const referralUrl = `${window.location.origin}/register?ref=${code}`;
    generateQRCode(referralUrl);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("コピーに失敗しました:", err);
    }
  };

  const handleCopyUrl = async () => {
    const referralUrl = `${window.location.origin}/register?ref=${referralCode}`;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("コピーに失敗しました:", err);
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.download = `eldonia-referral-${user?.username}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-purple-200 text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getSubscriptionBadge = (subscription: string) => {
    const badges = {
      free: { label: "🆓 Free", color: "bg-gray-600" },
      basic: { label: "⭐ Basic", color: "bg-blue-600" },
      premium: { label: "💎 Premium", color: "bg-green-600" },
      enterprise: { label: "👑 Enterprise", color: "bg-yellow-600" }
    };
    return badges[subscription as keyof typeof badges] || badges.free;
  };

  const subscriptionBadge = getSubscriptionBadge(profile?.subscription || "free");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 rounded-2xl shadow-2xl p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* アバター */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1">
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-5xl font-bold text-purple-200">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    profile?.username?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
              </div>
              {/* レベルバッジ */}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                Lv.{profile?.current_level || 1}
              </div>
            </div>

            {/* ユーザー情報 */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-purple-100 mb-2 font-pt-serif">
                {profile?.display_name || profile?.username || user.username}
              </h1>
              <p className="text-purple-300 text-lg mb-3">@{profile?.username || user.username}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start items-center">
                <span className={`${subscriptionBadge.color} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg`}>
                  {subscriptionBadge.label}
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  {profile?.total_exp || 0} XP
                </span>
                <span className="text-purple-300 text-sm">
                  登録日: {new Date(profile?.date_joined || Date.now()).toLocaleDateString("ja-JP")}
                </span>
              </div>
              {profile?.bio && (
                <p className="mt-4 text-purple-200 max-w-2xl">{profile.bio}</p>
              )}
            </div>

            {/* アクション */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/artworks/upload")}
                className="bg-gradient-to-r from-green-600 to-green-400 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-green-500 font-semibold shadow-lg transition-all duration-200"
              >
                🎨 作品を投稿
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-purple-500 font-semibold shadow-lg transition-all duration-200"
              >
                プロフィール編集
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-400 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-500 font-semibold shadow-lg transition-all duration-200"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[
            { label: "作品", value: stats?.artworks_count || 0, icon: "🎨", color: "from-blue-600 to-blue-400" },
            { label: "フォロワー", value: stats?.followers_count || 0, icon: "👥", color: "from-green-600 to-green-400" },
            { label: "フォロー中", value: stats?.following_count || 0, icon: "💫", color: "from-purple-600 to-purple-400" },
            { label: "いいね", value: stats?.likes_received || 0, icon: "❤️", color: "from-pink-600 to-pink-400" },
            { label: "閲覧数", value: stats?.total_views || 0, icon: "👁️", color: "from-yellow-600 to-yellow-400" },
            { label: "収益", value: `¥${(stats?.revenue_total || 0).toLocaleString()}`, icon: "💰", color: "from-orange-600 to-orange-400" }
          ].map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 rounded-xl shadow-lg p-4 hover:transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-purple-300 text-sm font-medium">{stat.label}</span>
              </div>
              <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* タブナビゲーション */}
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-purple-900 rounded-xl shadow-lg p-2 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "overview", label: "概要", icon: "📊" },
              { id: "profile", label: "プロフィール", icon: "👤" },
              { id: "settings", label: "設定", icon: "⚙️" },
              { id: "referral", label: "紹介コード", icon: "🎁" },
              { id: "activity", label: "アクティビティ", icon: "📈" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-lg"
                    : "text-purple-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* タブコンテンツ */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 rounded-2xl shadow-2xl p-8">
          {activeTab === "overview" && (
            <div>
              <h2 className="text-3xl font-bold text-purple-100 mb-6 font-pt-serif">📊 アクティビティ概要</h2>
              
              {/* クイックアクション */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => router.push("/artworks/upload")}
                  className="bg-gradient-to-br from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 rounded-xl p-6 text-left transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="text-4xl mb-3">🎨</div>
                  <h3 className="text-xl font-bold text-white mb-2">作品を投稿</h3>
                  <p className="text-green-100 text-sm">新しい作品をギャラリーに追加</p>
                </button>

                <button
                  onClick={() => router.push("/gallery")}
                  className="bg-gradient-to-br from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 rounded-xl p-6 text-left transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="text-4xl mb-3">🖼️</div>
                  <h3 className="text-xl font-bold text-white mb-2">ギャラリー</h3>
                  <p className="text-blue-100 text-sm">作品を閲覧・購入する</p>
                </button>

                <button
                  onClick={() => setActiveTab("referral")}
                  className="bg-gradient-to-br from-pink-600 to-pink-400 hover:from-pink-700 hover:to-pink-500 rounded-xl p-6 text-left transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="text-4xl mb-3">🎁</div>
                  <h3 className="text-xl font-bold text-white mb-2">紹介コード</h3>
                  <p className="text-pink-100 text-sm">友達を招待して特典をゲット</p>
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-purple-200 mb-4">🎨 最近の作品</h3>
                  <p className="text-purple-300">作品はまだありません。最初の作品を投稿しましょう！</p>
                  <button
                    onClick={() => router.push("/artworks/upload")}
                    className="mt-4 bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-purple-500 font-semibold shadow-lg transition-all duration-200"
                  >
                    作品を投稿する
                  </button>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-purple-200 mb-4">📢 最新のお知らせ</h3>
                  <p className="text-purple-300">新しいお知らせはありません。</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <h2 className="text-3xl font-bold text-purple-100 mb-6 font-pt-serif">👤 プロフィール設定</h2>
              <p className="text-purple-300 mb-6">プロフィール情報を編集できます</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push("/dashboard/profile")}
                  className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white p-6 rounded-xl font-semibold shadow-lg transition-all duration-200 text-left"
                >
                  <div className="text-3xl mb-3">✏️</div>
                  <h3 className="text-xl font-bold mb-2">プロフィール編集</h3>
                  <p className="text-sm text-purple-100">表示名、自己紹介、アバター画像などを編集</p>
                </button>

                <button
                  onClick={() => router.push("/dashboard/settings")}
                  className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white p-6 rounded-xl font-semibold shadow-lg transition-all duration-200 text-left"
                >
                  <div className="text-3xl mb-3">⚙️</div>
                  <h3 className="text-xl font-bold mb-2">アカウント設定</h3>
                  <p className="text-sm text-blue-100">パスワード、プライバシー設定など</p>
                </button>
              </div>

              {/* プロフィールプレビュー */}
              <div className="mt-8 bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-purple-900/50 rounded-xl shadow-lg p-6 border-2 border-purple-500/20">
                <h3 className="text-xl font-bold text-purple-100 mb-4">📋 現在のプロフィール</h3>
                <div className="space-y-3 text-purple-200">
                  <div className="flex items-center gap-3">
                    <span className="text-purple-400 min-w-[100px]">ユーザー名:</span>
                    <span className="font-semibold">{user?.username}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-purple-400 min-w-[100px]">表示名:</span>
                    <span className="font-semibold">{user?.display_name || "未設定"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-purple-400 min-w-[100px]">メール:</span>
                    <span className="font-semibold">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-purple-400 min-w-[100px]">プラン:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      user?.subscription === "free" ? "bg-gray-600" :
                      user?.subscription === "premium" ? "bg-green-600" :
                      "bg-yellow-600"
                    }`}>
                      {user?.subscription?.toUpperCase() || "FREE"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-purple-400 min-w-[100px]">レベル:</span>
                    <span className="font-semibold">Lv.{user?.level || 1}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-purple-400 min-w-[100px]">経験値:</span>
                    <span className="font-semibold">{user?.exp || 0} XP</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-3xl font-bold text-purple-100 mb-6 font-pt-serif">⚙️ アカウント設定</h2>
              <p className="text-purple-300 mb-4">設定機能は開発中です。</p>
              <button
                onClick={() => router.push("/dashboard/settings")}
                className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-500 font-semibold shadow-lg transition-all duration-200"
              >
                設定ページを開く
              </button>
            </div>
          )}

          {activeTab === "referral" && (
            <div>
              <h2 className="text-3xl font-bold text-purple-100 mb-6 font-pt-serif">🎁 紹介コード</h2>

              {/* 成功メッセージ */}
              {copySuccess && (
                <div className="mb-6 bg-green-900/20 border-2 border-green-500/50 rounded-lg p-4 text-green-200 text-center">
                  ✓ コピーしました！
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 左カラム: 紹介コードとQR */}
                <div className="space-y-6">
                  {/* 紹介コード */}
                  <div className="bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-purple-900/50 rounded-xl shadow-lg p-6 border-2 border-purple-500/20">
                    <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
                      <span>🔑</span> あなたの紹介コード
                    </h3>
                    
                    <div className="bg-gray-950 rounded-lg p-4 mb-4">
                      <p className="text-2xl font-mono font-bold text-center text-purple-300 break-all">
                        {referralCode || "読み込み中..."}
                      </p>
                    </div>

                    <button
                      onClick={handleCopyCode}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      📋 コードをコピー
                    </button>
                  </div>

                  {/* QRコード */}
                  <div className="bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-purple-900/50 rounded-xl shadow-lg p-6 border-2 border-purple-500/20">
                    <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
                      <span>📱</span> QRコード
                    </h3>

                    {qrCodeUrl ? (
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 flex justify-center">
                          <img src={qrCodeUrl} alt="QRコード" className="w-48 h-48" />
                        </div>

                        <button
                          onClick={handleDownloadQR}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          💾 QRコードをダウンロード
                        </button>
                      </div>
                    ) : (
                      <div className="bg-gray-950 rounded-lg p-8 text-center">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-purple-300 mt-4">QRコード生成中...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 右カラム: 統計と説明 */}
                <div className="space-y-6">
                  {/* 紹介統計 */}
                  <div className="bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-purple-900/50 rounded-xl shadow-lg p-6 border-2 border-purple-500/20">
                    <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
                      <span>📊</span> 紹介実績
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-gray-950/50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-300 text-sm">総紹介数</p>
                            <p className="text-3xl font-bold text-purple-100">{referralStats.totalReferrals}</p>
                          </div>
                          <span className="text-4xl">👥</span>
                        </div>
                      </div>

                      <div className="bg-gray-950/50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-300 text-sm">アクティブ</p>
                            <p className="text-3xl font-bold text-green-400">{referralStats.activeReferrals}</p>
                          </div>
                          <span className="text-4xl">✨</span>
                        </div>
                      </div>

                      <div className="bg-gray-950/50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-300 text-sm">獲得報酬</p>
                            <p className="text-3xl font-bold text-yellow-400">¥{referralStats.totalRewards.toLocaleString()}</p>
                          </div>
                          <span className="text-4xl">💰</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 紹介URL */}
                  <div className="bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-purple-900/50 rounded-xl shadow-lg p-6 border-2 border-purple-500/20">
                    <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
                      <span>🔗</span> 紹介リンク
                    </h3>

                    <div className="bg-gray-950 rounded-lg p-3 mb-4 break-all">
                      <p className="text-xs text-purple-300 font-mono">
                        {referralCode ? `${window.location.origin}/register?ref=${referralCode}` : "読み込み中..."}
                      </p>
                    </div>

                    <button
                      onClick={handleCopyUrl}
                      className="w-full bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      🔗 リンクをコピー
                    </button>
                  </div>

                  {/* 特典説明 */}
                  <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl shadow-lg p-6 border-2 border-purple-500/30">
                    <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
                      <span>🎁</span> 紹介特典
                    </h3>

                    <div className="space-y-3 text-purple-200 text-sm">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">✅</span>
                        <div>
                          <p className="font-semibold">友達が登録</p>
                          <p className="text-xs text-purple-300">あなたと友達に500ポイント</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="text-xl">✅</span>
                        <div>
                          <p className="font-semibold">友達が初購入</p>
                          <p className="text-xs text-purple-300">あなたに10%キャッシュバック</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="text-xl">✅</span>
                        <div>
                          <p className="font-semibold">10人紹介達成</p>
                          <p className="text-xs text-purple-300">1ヶ月プレミアム無料</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 使い方ガイド */}
              <div className="mt-6 bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-purple-900/50 rounded-xl shadow-lg p-6 border-2 border-purple-500/20">
                <h3 className="text-xl font-bold text-purple-100 mb-4">📖 紹介コードの使い方</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-4xl mb-3">📤</div>
                    <h4 className="text-lg font-semibold text-purple-200 mb-2">1. シェア</h4>
                    <p className="text-purple-300 text-sm">
                      紹介コードやQRコードを友達にシェア
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-4xl mb-3">✍️</div>
                    <h4 className="text-lg font-semibold text-purple-200 mb-2">2. 登録</h4>
                    <p className="text-purple-300 text-sm">
                      友達が紹介コードで新規登録
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-4xl mb-3">🎉</div>
                    <h4 className="text-lg font-semibold text-purple-200 mb-2">3. 特典GET</h4>
                    <p className="text-purple-300 text-sm">
                      両方に自動的にポイント付与
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div>
              <h2 className="text-3xl font-bold text-purple-100 mb-6 font-pt-serif">📈 アクティビティ履歴</h2>
              <p className="text-purple-300">アクティビティはまだありません。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

