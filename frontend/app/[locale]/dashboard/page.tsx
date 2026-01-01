"use client";

import { useAuth } from "@/app/context/AuthContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { Suspense, useEffect, useState } from "react";

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

// APIのベースURLを動的に決定
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

// アバターURLを絶対URLに変換する関数
const getFullAvatarUrl = (avatarUrl: string | undefined): string | undefined => {
  if (!avatarUrl) return undefined;
  // 既に絶対URLの場合はそのまま返す
  if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
    return avatarUrl;
  }
  // 相対パスの場合はバックエンドのURLを付加
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const backendHost = hostname === 'localhost' || hostname === '127.0.0.1'
      ? 'http://localhost:8000'
      : `http://${hostname}:8000`;
    return `${backendHost}${avatarUrl}`;
  }
  return `http://localhost:8000${avatarUrl}`;
};

function DashboardPageInner() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = pathname?.split('/')[1] || 'ja';

  // URLパラメータからタブを取得（例: ?tab=referral）
  const tabParam = searchParams.get('tab');
  const validTabs = ["overview", "profile", "settings", "referral", "activity", "events", "plan", "portfolio"] as const;
  type TabType = typeof validTabs[number];
  const initialTab: TabType = validTabs.includes(tabParam as TabType) ? (tabParam as TabType) : "overview";

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);

  // ポートフォリオ関連
  interface PortfolioItem {
    id: number;
    title: string;
    description: string;
    work_type: string;
    thumbnail_url: string;
    visibility: string;
    is_featured: boolean;
    view_count: number;
    like_count: number;
    created_at: string;
  }
  const [myPortfolios, setMyPortfolios] = useState<PortfolioItem[]>([]);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [portfolioForm, setPortfolioForm] = useState({
    title: '',
    description: '',
    work_type: 'illustration',
    thumbnail_url: '',
    external_url: '',
    tags: '',
    tools_used: '',
    visibility: 'public',
  });
  const [editingPortfolioId, setEditingPortfolioId] = useState<number | null>(null);
  const [myArtworks, setMyArtworks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
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
      router.push(`/${currentLocale}/signin`);
    } else if (user) {
      fetchUserData();
      fetchReferralData();
      fetchMyPortfolios();
      fetchMyArtworks();
    }
  }, [user, loading, router, currentLocale]);

  const fetchMyPortfolios = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const API_BASE_URL = getApiBaseUrl();
      const res = await fetch(`${API_BASE_URL}/portfolios/me/`, {
        headers: { 'Authorization': `Token ${authToken}` },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setMyPortfolios(data);
      }
    } catch (error) {
      console.error('Portfolio fetch error:', error);
    }
  };

  const fetchMyArtworks = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.log('No auth token found');
        setMyArtworks([]);
        return;
      }

      const API_BASE_URL = getApiBaseUrl();
      const res = await fetch(`${API_BASE_URL}/artworks/me/`, {
        cache: 'no-store',
        headers: { 'Authorization': `Token ${authToken}` }
      });

      if (res.ok) {
        const data = await res.json();
        setMyArtworks(data.artworks || []);
      } else {
        console.error('Failed to fetch my artworks:', res.status);
        setMyArtworks([]);
      }
    } catch (error) {
      console.error('Artworks fetch error:', error);
      setMyArtworks([]);
    }
  };

  const createPortfolio = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const API_BASE_URL = getApiBaseUrl();
      const method = editingPortfolioId ? 'PATCH' : 'POST';
      const url = editingPortfolioId
        ? `${API_BASE_URL}/portfolios/me/${editingPortfolioId}/`
        : `${API_BASE_URL}/portfolios/me/`;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: portfolioForm.title,
          description: portfolioForm.description,
          work_type: portfolioForm.work_type,
          thumbnail_url: portfolioForm.thumbnail_url,
          external_url: portfolioForm.external_url,
          tags: portfolioForm.tags ? portfolioForm.tags.split(',').map(t => t.trim()) : null,
          tools_used: portfolioForm.tools_used ? portfolioForm.tools_used.split(',').map(t => t.trim()) : null,
          visibility: portfolioForm.visibility,
        }),
      });
      if (res.ok) {
        setShowPortfolioForm(false);
        setEditingPortfolioId(null);
        setPortfolioForm({ title: '', description: '', work_type: 'illustration', thumbnail_url: '', external_url: '', tags: '', tools_used: '', visibility: 'public' });
        fetchMyPortfolios();
      }
    } catch (error) {
      console.error('Portfolio create error:', error);
    }
  };

  const deletePortfolio = async (id: number) => {
    if (!confirm('このポートフォリオを削除しますか？')) return;
    try {
      const authToken = localStorage.getItem('authToken');
      const API_BASE_URL = getApiBaseUrl();
      await fetch(`${API_BASE_URL}/portfolios/me/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${authToken}` },
        credentials: 'include',
      });
      fetchMyPortfolios();
    } catch (error) {
      console.error('Portfolio delete error:', error);
    }
  };

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // プロフィール取得（バックエンドAPIを使用）
      const authToken = localStorage.getItem('authToken');
      const API_BASE_URL = getApiBaseUrl();
      const profileRes = await fetch(`${API_BASE_URL}/users/me/`, {
        headers: { 'Authorization': `Token ${authToken}` },
        credentials: "include"
      });

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        // APIレスポンスをprofile形式に変換
        setProfile({
          id: user?.id || 0,
          email: user?.email || '',
          date_joined: new Date().toISOString(),
          display_name: profileData.display_name,
          username: profileData.username,
          bio: '',
          avatar_url: profileData.avatar_url,
          subscription: profileData.subscription || 'free',
          subscription_plan: profileData.subscription || 'free',
          total_exp: profileData.exp || 0,
          current_level: profileData.level || 1,
          account_status: 'active',
        });
      }

      // 統計取得（ダミーデータ）
      setStats({
        artworks_count: 0,
        followers_count: 0,
        following_count: 0,
        likes_received: 0,
        total_views: 0,
        revenue_total: 0
      });
    } catch (error) {
      console.error("ユーザーデータの取得に失敗:", error);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = `/${currentLocale}`;
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

    const referralUrl = `${window.location.origin}/${currentLocale}/register?ref=${code}`;
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
    const referralUrl = `${window.location.origin}/${currentLocale}/register?ref=${referralCode}`;
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
      standard: { label: "⭐ Standard", color: "bg-blue-600" },
      pro: { label: "🚀 Pro", color: "bg-purple-600" },
      premium: { label: "💎 Premium", color: "bg-green-600" },
      business: { label: "🏢 Business", color: "bg-yellow-600" },
      enterprise: { label: "👑 Enterprise", color: "bg-yellow-600" }
    };
    return badges[subscription as keyof typeof badges] || badges.free;
  };

  const subscriptionBadge = getSubscriptionBadge(profile?.subscription || user?.subscription || "free");

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
                  {getFullAvatarUrl(profile?.avatar_url || user?.avatar_url) ? (
                    <img src={getFullAvatarUrl(profile?.avatar_url || user?.avatar_url)} alt={profile?.display_name || user?.display_name || user?.username} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    (profile?.username || user?.username)?.charAt(0).toUpperCase() || "U"
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
                onClick={() => router.push(`/${currentLocale}/artworks/upload`)}
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
              { id: "events", label: "イベント作成", icon: "🎉" },
              { id: "profile", label: "プロフィール", icon: "👤" },
              { id: "settings", label: "設定", icon: "⚙️" },
              { id: "plan", label: "プラン変更", icon: "💎" },
              { id: "referral", label: "紹介コード", icon: "🎁" },
              { id: "activity", label: "アクティビティ", icon: "📈" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab.id
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

              {/* クイックアクション - 5列グリッド */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <button
                  onClick={() => router.push(`/${currentLocale}/artworks/upload`)}
                  className="bg-gradient-to-br from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 rounded-xl p-5 text-left transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="text-3xl mb-2">🎨</div>
                  <h3 className="text-lg font-bold text-white mb-1">作品を投稿</h3>
                  <p className="text-green-100 text-xs">新しい作品を追加</p>
                </button>

                <button
                  onClick={() => setActiveTab("events")}
                  className="bg-gradient-to-br from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 rounded-xl p-5 text-left transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="text-3xl mb-2">🎉</div>
                  <h3 className="text-lg font-bold text-white mb-1">イベント登録</h3>
                  <p className="text-purple-100 text-xs">イベントを作成</p>
                </button>

                <button
                  onClick={() => router.push(`/${currentLocale}/marketplace/register`)}
                  className="bg-gradient-to-br from-orange-600 to-orange-400 hover:from-orange-700 hover:to-orange-500 rounded-xl p-5 text-left transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="text-3xl mb-2">🛒</div>
                  <h3 className="text-lg font-bold text-white mb-1">商品登録</h3>
                  <p className="text-orange-100 text-xs">商品を出品する</p>
                </button>

                <button
                  onClick={() => router.push(`/${currentLocale}/jobs/register`)}
                  className="bg-gradient-to-br from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 rounded-xl p-5 text-left transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="text-3xl mb-2">👥</div>
                  <h3 className="text-lg font-bold text-white mb-1">人材紹介</h3>
                  <p className="text-blue-100 text-xs">求人・コラボ募集</p>
                </button>

                <button
                  onClick={() => router.push(`/${currentLocale}/community/groupwork`)}
                  className="bg-gradient-to-br from-teal-600 to-teal-400 hover:from-teal-700 hover:to-teal-500 rounded-xl p-5 text-left transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="text-3xl mb-2">📁</div>
                  <h3 className="text-lg font-bold text-white mb-1">グループ作業</h3>
                  <p className="text-teal-100 text-xs">共同制作・コラボ</p>
                </button>
              </div>

              {/* サブアクション */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <button
                  onClick={() => setActiveTab("portfolio")}
                  className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 rounded-lg p-4 text-left transition-all duration-200 border border-purple-500/30"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎨</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">ポートフォリオ</h4>
                      <p className="text-xs text-purple-300">作品集管理</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push(`/${currentLocale}/gallery`)}
                  className="bg-gray-800/80 hover:bg-gray-700 rounded-lg p-4 text-left transition-all duration-200 border border-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🖼️</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">ギャラリー</h4>
                      <p className="text-xs text-gray-400">作品を閲覧</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push(`/${currentLocale}/events`)}
                  className="bg-gray-800/80 hover:bg-gray-700 rounded-lg p-4 text-left transition-all duration-200 border border-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">イベント一覧</h4>
                      <p className="text-xs text-gray-400">参加・閲覧</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push(`/${currentLocale}/marketplace`)}
                  className="bg-gray-800/80 hover:bg-gray-700 rounded-lg p-4 text-left transition-all duration-200 border border-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏪</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">マーケット</h4>
                      <p className="text-xs text-gray-400">商品を購入</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push(`/${currentLocale}/jobs`)}
                  className="bg-gray-800/80 hover:bg-gray-700 rounded-lg p-4 text-left transition-all duration-200 border border-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💼</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">求人一覧</h4>
                      <p className="text-xs text-gray-400">仕事を探す</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("referral")}
                  className="bg-gray-800/80 hover:bg-gray-700 rounded-lg p-4 text-left transition-all duration-200 border border-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎁</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">紹介コード</h4>
                      <p className="text-xs text-gray-400">友達を招待</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="space-y-4">
                {/* 投稿作品 */}
                <div className="bg-gray-900/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-purple-200">🎨 投稿作品</h3>
                    <button
                      onClick={() => router.push(`/${currentLocale}/artworks/upload`)}
                      className="text-sm bg-purple-600/50 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      + 新規投稿
                    </button>
                  </div>

                  {/* 作品グリッド（APIから取得） */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {myArtworks.length > 0 ? (
                      myArtworks.map((artwork: any) => (
                        <div key={artwork.id} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 text-center relative group">
                          <div className="aspect-square bg-gray-700/50 rounded-lg mb-2 overflow-hidden relative">
                            {/* 画像表示 */}
                            {(() => {
                              const url = artwork.thumbnail_url || artwork.image_url || artwork.file_url;
                              if (!url) return <div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>;

                              let fullUrl = url;
                              if (!url.startsWith('http')) {
                                let backendHost = 'http://localhost:8000';
                                if (typeof window !== 'undefined') {
                                  const hostname = window.location.hostname;
                                  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
                                    backendHost = `http://${hostname}:8000`;
                                  }
                                }
                                fullUrl = `${backendHost}${url.startsWith('/') ? url : `/${url}`}`;
                              }

                              const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(fullUrl);

                              if (isVideo) {
                                return (
                                  <video
                                    src={fullUrl}
                                    className="w-full h-full object-cover"
                                    controls={false} // ホバーで再生などを実装してもよいが、一旦静止画代わりの表示
                                    muted
                                    loop
                                    playsInline
                                    onMouseOver={(e) => e.currentTarget.play()}
                                    onMouseOut={(e) => {
                                      e.currentTarget.pause();
                                      e.currentTarget.currentTime = 0;
                                    }}
                                  />
                                );
                              }

                              return (
                                <img
                                  src={fullUrl}
                                  alt={artwork.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.style.display = 'none';
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-4xl">🎨</div>';
                                    }
                                  }}
                                />
                              );
                            })()}



                            {/* オーバーレイアクション */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                onClick={async () => {
                                  if (confirm('削除してもよろしいですか？')) {
                                    try {
                                      const authToken = localStorage.getItem('authToken');
                                      const API_BASE_URL = getApiBaseUrl();
                                      const res = await fetch(`${API_BASE_URL}/artworks/${artwork.id}/`, {
                                        method: 'DELETE',
                                        headers: { 'Authorization': `Token ${authToken}` }
                                      });
                                      if (res.ok) {
                                        alert('削除しました');
                                        fetchMyArtworks();
                                      } else {
                                        const errorData = await res.json().catch(() => ({}));
                                        alert(`削除に失敗しました: ${errorData.error || res.statusText}`);
                                      }
                                    } catch (error) {
                                      console.error('Delete error:', error);
                                      alert('削除中にエラーが発生しました');
                                    }
                                  }
                                }}
                                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700" title="削除"
                              >
                                🗑️
                              </button>
                              <button
                                onClick={() => {
                                  // 編集ページへ遷移
                                  window.location.href = `/ja/artworks/upload?id=${artwork.id}`;
                                }}
                                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700" title="編集"
                              >
                                ✏️
                              </button>
                            </div>
                          </div>
                          <h4 className="font-semibold text-purple-100 truncate">{artwork.title}</h4>
                          <p className="text-xs text-gray-400">{new Date(artwork.created_at).toLocaleDateString()}</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 text-center">
                        <div className="aspect-square bg-gray-700/50 rounded-lg mb-2 flex items-center justify-center mx-auto w-24 h-24">
                          <span className="text-4xl text-gray-500">🖼️</span>
                        </div>
                        <p className="text-xs text-gray-400">作品はまだありません</p>
                      </div>
                    )}
                  </div>

                  {myArtworks.length === 0 && (
                    <p className="text-purple-300 text-sm mt-4">最初の作品を投稿しましょう！</p>
                  )}
                </div>

                {/* 登録済みイベント */}
                <div className="bg-gray-900/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-purple-200">🎉 登録イベント</h3>
                    <button
                      onClick={() => setActiveTab("events")}
                      className="text-sm bg-purple-600/50 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      + 新規作成
                    </button>
                  </div>
                  <p className="text-purple-300 text-sm">登録したイベントはありません。</p>
                </div>

                {/* 出品商品 */}
                <div className="bg-gray-900/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-purple-200">🛒 出品商品</h3>
                    <button
                      onClick={() => router.push(`/${currentLocale}/marketplace/register`)}
                      className="text-sm bg-orange-600/50 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      + 新規出品
                    </button>
                  </div>
                  <p className="text-purple-300 text-sm">出品中の商品はありません。</p>
                </div>

                {/* グループ作業 */}
                <div className="bg-gray-900/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-purple-200">📁 グループ作業</h3>
                    <button
                      onClick={() => router.push(`/${currentLocale}/community/groupwork`)}
                      className="text-sm bg-teal-600/50 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      + 新規プロジェクト
                    </button>
                  </div>
                  <p className="text-purple-300 text-sm">参加中のグループ作業はありません。</p>
                </div>

                {/* 最新のお知らせ */}
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
                  onClick={() => router.push(`/${currentLocale}/dashboard/profile`)}
                  className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white p-6 rounded-xl font-semibold shadow-lg transition-all duration-200 text-left"
                >
                  <div className="text-3xl mb-3">✏️</div>
                  <h3 className="text-xl font-bold mb-2">プロフィール編集</h3>
                  <p className="text-sm text-purple-100">表示名、自己紹介、アバター画像などを編集</p>
                </button>

                <button
                  onClick={() => router.push(`/${currentLocale}/dashboard/settings`)}
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
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${user?.subscription === "free" ? "bg-gray-600" :
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
                onClick={() => router.push(`/${currentLocale}/dashboard/settings`)}
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
                        {referralCode ? `${typeof window !== 'undefined' ? window.location.origin : ''}/${currentLocale}/register?ref=${referralCode}` : "読み込み中..."}
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

          {activeTab === "plan" && (
            <PlanChangeTab user={user} currentLocale={currentLocale} />
          )}

          {activeTab === "events" && (
            <EventCreateTab />
          )}

          {activeTab === "portfolio" && (
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900/50 rounded-2xl p-8 border-2 border-purple-500/30 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-purple-100 font-pt-serif">🎨 マイポートフォリオ</h2>
                <button
                  onClick={() => setShowPortfolioForm(!showPortfolioForm)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  {showPortfolioForm ? '✕ 閉じる' : editingPortfolioId ? '編集をやめる' : '＋ 新規作成'}
                </button>
              </div>

              {/* 作成フォーム */}
              {showPortfolioForm && (
                <div className="bg-gray-800/50 rounded-xl p-6 mb-6 border border-purple-500/30">
                  <h3 className="text-xl font-bold text-purple-200 mb-4">新しいポートフォリオを作成</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-purple-300 text-sm mb-1">タイトル *</label>
                      <input
                        type="text"
                        value={portfolioForm.title}
                        onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-lg text-white"
                        placeholder="作品タイトル"
                      />
                    </div>
                    <div>
                      <label className="block text-purple-300 text-sm mb-1">作品タイプ</label>
                      <select
                        value={portfolioForm.work_type}
                        onChange={(e) => setPortfolioForm({ ...portfolioForm, work_type: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-lg text-white"
                      >
                        <option value="illustration">イラスト</option>
                        <option value="manga">漫画</option>
                        <option value="animation">アニメーション</option>
                        <option value="3d">3Dモデル</option>
                        <option value="music">音楽</option>
                        <option value="video">動画</option>
                        <option value="novel">小説</option>
                        <option value="game">ゲーム</option>
                        <option value="design">デザイン</option>
                        <option value="photo">写真</option>
                        <option value="other">その他</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-purple-300 text-sm mb-1">説明</label>
                      <textarea
                        value={portfolioForm.description}
                        onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-lg text-white h-24"
                        placeholder="作品の説明"
                      />
                    </div>
                    <div>
                      <label className="block text-purple-300 text-sm mb-1">サムネイルURL</label>
                      <input
                        type="url"
                        value={portfolioForm.thumbnail_url}
                        onChange={(e) => setPortfolioForm({ ...portfolioForm, thumbnail_url: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-lg text-white"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-purple-300 text-sm mb-1">外部リンク</label>
                      <input
                        type="url"
                        value={portfolioForm.external_url}
                        onChange={(e) => setPortfolioForm({ ...portfolioForm, external_url: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-lg text-white"
                        placeholder="YouTube, Pixiv, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-purple-300 text-sm mb-1">タグ（カンマ区切り）</label>
                      <input
                        type="text"
                        value={portfolioForm.tags}
                        onChange={(e) => setPortfolioForm({ ...portfolioForm, tags: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-lg text-white"
                        placeholder="イラスト, ファンタジー, キャラクター"
                      />
                    </div>
                    <div>
                      <label className="block text-purple-300 text-sm mb-1">公開設定</label>
                      <select
                        value={portfolioForm.visibility}
                        onChange={(e) => setPortfolioForm({ ...portfolioForm, visibility: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-lg text-white"
                      >
                        <option value="public">公開</option>
                        <option value="unlisted">限定公開</option>
                        <option value="private">非公開</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={createPortfolio}
                      disabled={!portfolioForm.title}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                    >
                      作成する
                    </button>
                  </div>
                </div>
              )}

              {/* ポートフォリオ一覧 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myPortfolios.map((p) => (
                  <div key={p.id} className="bg-gray-800/50 rounded-xl overflow-hidden border border-purple-500/20">
                    <div className="aspect-video bg-gray-700/50 relative">
                      {p.thumbnail_url ? (
                        <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🎨</div>
                      )}
                      <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs ${p.visibility === 'public' ? 'bg-green-600' : p.visibility === 'unlisted' ? 'bg-yellow-600' : 'bg-gray-600'
                        } text-white`}>
                        {p.visibility === 'public' ? '公開' : p.visibility === 'unlisted' ? '限定' : '非公開'}
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-white mb-1 line-clamp-1">{p.title}</h4>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">{p.description || '説明なし'}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>👁 {p.view_count} ❤️ {p.like_count}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingPortfolioId(p.id);
                              setPortfolioForm({
                                title: p.title || '',
                                description: p.description || '',
                                work_type: p.work_type || 'illustration',
                                thumbnail_url: p.thumbnail_url || '',
                                external_url: '',
                                tags: '',
                                tools_used: '',
                                visibility: p.visibility || 'public',
                              });
                              setShowPortfolioForm(true);
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            編集
                          </button>
                          <button
                            onClick={() => deletePortfolio(p.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {myPortfolios.length === 0 && !showPortfolioForm && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">🎨</div>
                  <p className="text-purple-300 mb-4">ポートフォリオがまだありません</p>
                  <button
                    onClick={() => setShowPortfolioForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
                  >
                    最初の作品を追加する
                  </button>
                </div>
              )}

              {/* 投稿作品（ギャラリー）表示 */}
              {myArtworks.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-xl font-bold text-purple-200 mb-4">🖼 投稿作品（ギャラリー）</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myArtworks.map((a) => (
                      <div key={a.id} className="bg-gray-800/60 rounded-xl overflow-hidden border border-gray-700/60">
                        <div className="aspect-video bg-gray-700/50 relative">
                          {a.image_url ? (
                            <img src={a.image_url} alt={a.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🎬</div>
                          )}
                          <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-indigo-600/80 text-white text-xs">ギャラリー</span>
                        </div>
                        <div className="p-4 space-y-2">
                          <h4 className="text-white font-semibold line-clamp-1">{a.title}</h4>
                          <p className="text-gray-400 text-sm line-clamp-2">{a.description || '説明なし'}</p>
                          <p className="text-xs text-gray-500">カテゴリ: {a.category}</p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>👁 {a.views || 0} ❤️ {a.likes_count || 0}</span>
                            <button
                              onClick={() => router.push(`/ja/gallery/category/${a.category}/${a.id}`)}
                              className="text-indigo-400 hover:text-indigo-300"
                            >
                              詳細
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div >
    </div >
  );
}

// イベント作成タブコンポーネント
function EventCreateTab() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'ja';
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'venue',
    venue_name: '',
    venue_address: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    capacity: '',
    purpose: '',
    location: '',
    is_free: true,
    ticket_price: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const start_datetime = `${formData.start_date}T${formData.start_time}:00`;
      const end_datetime = `${formData.end_date}T${formData.end_time}:00`;

      const eventData = {
        title: formData.title,
        description: formData.description,
        event_type: formData.event_type,
        venue_name: formData.venue_name,
        venue_address: formData.venue_address,
        start_datetime,
        end_datetime,
        timezone: 'Asia/Tokyo',
        capacity: parseInt(formData.capacity),
        is_free: formData.is_free,
        status: 'draft',
      };

      // Events API エンドポイント
      // ブラウザのホスト名を使用してAPIのベースURLを動的に決定
      const getApiBaseUrl = () => {
        if (typeof window !== 'undefined') {
          const hostname = window.location.hostname;
          // localhostまたは127.0.0.1の場合はそのまま使用、それ以外は同じホストのポート8000を使用
          if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:8000/api/v1';
          }
          return `http://${hostname}:8000/api/v1`;
        }
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      };
      const API_BASE_URL = getApiBaseUrl();

      const response = await fetch(`${API_BASE_URL}/events/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
        credentials: 'include',
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const createdEvent = await response.json();
        setMessage({ type: 'success', text: '🎉 イベントが作成されました!' });
        setTimeout(() => {
          router.push(`/${currentLocale}/events/${createdEvent.id}`);
        }, 1500);
      } else if (response.status === 403) {
        const errorData = await response.json();
        setMessage({
          type: 'error',
          text: errorData.detail || 'プラン制限によりイベントを作成できません。'
        });
      } else {
        const errorData = await response.json();
        setMessage({
          type: 'error',
          text: errorData.detail || 'イベントの作成に失敗しました。'
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setMessage({ type: 'error', text: 'サーバーエラーが発生しました。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-purple-100 mb-6 font-pt-serif">🎉 イベントを作成</h2>

      {/* メッセージ */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl ${message.type === 'success'
          ? 'bg-green-900/30 border-2 border-green-500/50 text-green-200'
          : 'bg-red-900/30 border-2 border-red-500/50 text-red-200'
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本情報 */}
        <div className="bg-gray-900/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-purple-200 mb-4">📋 基本情報</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                イベントタイトル <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="例: クリエイターミートアップ 2025"
                className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                イベント説明
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="イベントの詳細を入力してください"
                className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  用途 <span className="text-red-400">*</span>
                </label>
                <select
                  name="purpose"
                  required
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  <option value="networking">🤝 ネットワーキング</option>
                  <option value="workshop">🛠️ ワークショップ</option>
                  <option value="exhibition">🎨 展示会</option>
                  <option value="conference">🎤 カンファレンス</option>
                  <option value="seminar">📚 セミナー</option>
                  <option value="party">🎉 パーティー</option>
                  <option value="other">📌 その他</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  開催形式 <span className="text-red-400">*</span>
                </label>
                <select
                  name="event_type"
                  required
                  value={formData.event_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="venue">🏢 会場開催</option>
                  <option value="online">💻 オンライン</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 日時 */}
        <div className="bg-gray-900/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-purple-200 mb-4">📅 開催日時</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                開始日 <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                required
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                開始時刻 <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                name="start_time"
                required
                value={formData.start_time}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                終了日 <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="end_date"
                required
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                終了時刻 <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                name="end_time"
                required
                value={formData.end_time}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 会場情報 */}
        <div className="bg-gray-900/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-purple-200 mb-4">🏢 会場情報</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                収容人数 <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="capacity"
                required
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="例: 50"
                className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {formData.event_type === 'venue' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    場所（地域）
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="例: 東京都渋谷区"
                    className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    会場名
                  </label>
                  <input
                    type="text"
                    name="venue_name"
                    value={formData.venue_name}
                    onChange={handleChange}
                    placeholder="例: 東京コンベンションセンター"
                    className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    会場住所
                  </label>
                  <input
                    type="text"
                    name="venue_address"
                    value={formData.venue_address}
                    onChange={handleChange}
                    placeholder="例: 東京都千代田区1-2-3"
                    className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* 参加費 */}
        <div className="bg-gray-900/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-purple-200 mb-4">💰 参加費</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_free"
                name="is_free"
                checked={formData.is_free}
                onChange={handleChange}
                className="w-5 h-5 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="is_free" className="text-purple-200 font-medium">
                無料イベント
              </label>
            </div>

            {!formData.is_free && (
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  チケット価格（円）
                </label>
                <input
                  type="number"
                  name="ticket_price"
                  min="0"
                  value={formData.ticket_price}
                  onChange={handleChange}
                  placeholder="例: 3000"
                  className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>

        {/* 送信ボタン */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '🔄 作成中...' : '✨ イベントを作成'}
          </button>
        </div>
      </form>

      {/* イベント一覧へのリンク */}
      <div className="mt-8 p-4 bg-gray-900/30 rounded-xl text-center">
        <p className="text-purple-300 mb-3">既存のイベントを確認しますか？</p>
        <button
          onClick={() => router.push(`/${currentLocale}/events`)}
          className="px-6 py-2 bg-purple-600/50 hover:bg-purple-600 text-white rounded-lg transition-colors"
        >
          📅 イベント一覧を見る
        </button>
      </div>
    </div>
  );
}

// プラン変更タブコンポーネント
function PlanChangeTab({ user, currentLocale }: { user: { subscription?: string } | null; currentLocale: string }) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isChanging, setIsChanging] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // ブラウザのホスト名を使用してAPIのベースURLを動的に決定
  const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // localhostまたは127.0.0.1の場合はそのまま使用、それ以外は同じホストのポート8000を使用
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000/api/v1';
      }
      return `http://${hostname}:8000/api/v1`;
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  };
  const API_BASE_URL = getApiBaseUrl();

  const plans = [
    { id: 'free', name: 'Free', nameJa: 'フリー', price: '¥0', icon: '🆓', color: 'gray', features: ['月3件まで投稿', '100MBストレージ', '販売手数料15%'] },
    { id: 'standard', name: 'Standard', nameJa: 'スタンダード', price: '¥800', icon: '⭐', color: 'blue', badge: 'おすすめ', features: ['月20件まで投稿', '1GBストレージ', 'Live配信月5回', '販売手数料12%'] },
    { id: 'pro', name: 'Pro', nameJa: 'プロ', price: '¥1,500', icon: '🚀', color: 'purple', badge: '人気No.1', features: ['投稿無制限', '10GBストレージ', 'Live配信無制限', '販売手数料8%'] },
    { id: 'business', name: 'Business', nameJa: 'ビジネス', price: '¥10,000', icon: '🏢', color: 'yellow', features: ['投稿無制限', '100GBストレージ', 'チーム10人', '販売手数料5%'] },
  ];

  const currentPlan = user?.subscription || 'free';

  const handlePlanChange = async (planId: string) => {
    if (planId === currentPlan) return;
    setSelectedPlan(planId);
    setShowConfirm(true);
  };

  const confirmPlanChange = async () => {
    if (!selectedPlan) return;

    setIsChanging(true);
    setMessage(null);

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/users/me/subscription/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ subscription_plan: selectedPlan }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: `✅ プランを「${plans.find(p => p.id === selectedPlan)?.name}」に変更しました！` });
        // ユーザー情報を更新（ページリロードなし）
        const updatedUser = { ...user, subscription: selectedPlan };
        localStorage.setItem('eldonia_user', JSON.stringify(updatedUser));
        // 3秒後にページをリロードして状態を更新
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage({ type: 'error', text: errorData.detail || 'プランの変更に失敗しました。' });
      }
    } catch (error) {
      console.error('Plan change error:', error);
      setMessage({ type: 'error', text: 'サーバーエラーが発生しました。' });
    } finally {
      setIsChanging(false);
      setShowConfirm(false);
      setSelectedPlan(null);
    }
  };

  const getButtonStyle = (planId: string) => {
    if (planId === currentPlan) {
      return 'bg-gray-700 text-gray-400 cursor-not-allowed';
    }
    const colorMap: Record<string, string> = {
      free: 'bg-gray-600 hover:bg-gray-500 text-white',
      standard: 'bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white',
      pro: 'bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white',
      business: 'bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-700 hover:to-yellow-500 text-white',
    };
    return colorMap[planId] || 'bg-gray-600 text-white';
  };

  const getBorderStyle = (planId: string) => {
    const colorMap: Record<string, string> = {
      free: 'border-gray-600/30 hover:border-gray-500/50',
      standard: 'border-blue-500/30 hover:border-blue-500/50',
      pro: 'border-purple-500/30 hover:border-purple-500/50',
      business: 'border-yellow-500/30 hover:border-yellow-500/50',
    };
    return colorMap[planId] || 'border-gray-600/30';
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-purple-100 mb-6 font-pt-serif">💎 プラン変更</h2>

      {/* メッセージ */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl ${message.type === 'success'
          ? 'bg-green-900/30 border-2 border-green-500/50 text-green-200'
          : 'bg-red-900/30 border-2 border-red-500/50 text-red-200'
          }`}>
          {message.text}
        </div>
      )}

      {/* 確認モーダル */}
      {showConfirm && selectedPlan && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md mx-4 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">プラン変更の確認</h3>
            <p className="text-purple-200 mb-6">
              プランを「<span className="font-bold text-white">{plans.find(p => p.id === selectedPlan)?.name}</span>」に変更しますか？
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => { setShowConfirm(false); setSelectedPlan(null); }}
                disabled={isChanging}
                className="flex-1 py-3 rounded-lg font-semibold bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
              >
                キャンセル
              </button>
              <button
                onClick={confirmPlanChange}
                disabled={isChanging}
                className="flex-1 py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-400 text-white hover:from-purple-700 hover:to-purple-500 transition-all disabled:opacity-50"
              >
                {isChanging ? '変更中...' : '変更する'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 現在のプラン */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-6 mb-8 border-2 border-purple-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-300 text-sm mb-1">現在のプラン</p>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              {plans.find(p => p.id === currentPlan)?.icon} {plans.find(p => p.id === currentPlan)?.name || 'Free'}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-purple-300 text-sm">月額料金</p>
            <p className="text-white font-semibold">{plans.find(p => p.id === currentPlan)?.price || '¥0'}/月</p>
          </div>
        </div>
      </div>

      {/* プラン一覧 */}
      <h3 className="text-xl font-semibold text-purple-200 mb-4">📋 利用可能なプラン</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-gray-800/60 rounded-xl p-5 border ${getBorderStyle(plan.id)} transition-all relative ${plan.id === currentPlan ? 'ring-2 ring-purple-500' : ''
              }`}
          >
            {plan.badge && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <span className={`bg-${plan.color}-500 text-white text-xs px-2 py-1 rounded-full`}
                  style={{ backgroundColor: plan.color === 'purple' ? '#8B5CF6' : plan.color === 'blue' ? '#3B82F6' : undefined }}
                >
                  {plan.badge}
                </span>
              </div>
            )}
            {plan.id === currentPlan && (
              <div className="absolute -top-2 right-2">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">現在</span>
              </div>
            )}
            <div className="text-3xl mb-3">{plan.icon}</div>
            <h4 className="text-lg font-bold text-white mb-1">{plan.name}</h4>
            <p className="text-2xl font-bold mb-3" style={{ color: plan.color === 'gray' ? '#9CA3AF' : plan.color === 'blue' ? '#60A5FA' : plan.color === 'purple' ? '#A78BFA' : '#FBBF24' }}>
              {plan.price}<span className="text-sm font-normal">/月</span>
            </p>
            <ul className="text-sm text-gray-400 space-y-1 mb-4">
              {plan.features.map((f, i) => (
                <li key={i}>✓ {f}</li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanChange(plan.id)}
              disabled={plan.id === currentPlan || isChanging}
              className={`w-full py-2 rounded-lg font-semibold transition-all ${getButtonStyle(plan.id)}`}
            >
              {plan.id === currentPlan ? '現在のプラン' :
                plans.findIndex(p => p.id === plan.id) < plans.findIndex(p => p.id === currentPlan) ? 'ダウングレード' : 'アップグレード'}
            </button>
          </div>
        ))}
      </div>

      {/* 解約案内 */}
      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-purple-200 mb-3">⚠️ プランの解約について</h3>
        <p className="text-gray-400 text-sm mb-4">
          有料プランを解約すると、現在の請求期間終了後にFreeプランに変更されます。
          ストレージ制限を超えている場合、一部のファイルにアクセスできなくなる可能性があります。
        </p>
        <button
          onClick={() => handlePlanChange('free')}
          disabled={currentPlan === 'free' || isChanging}
          className="text-red-400 hover:text-red-300 text-sm underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentPlan === 'free' ? '現在Freeプランです' : 'Freeプランに変更する'}
        </button>
      </div>
    </div>
  );
}

// Suspenseでラップしてdefault export
export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-purple-200 text-lg">読み込み中...</p>
          </div>
        </div>
      }
    >
      <DashboardPageInner />
    </Suspense>
  );
}

