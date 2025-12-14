"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function ReferralPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [referralCode, setReferralCode] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    totalRewards: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    } else if (user) {
      fetchReferralData();
    }
  }, [user, loading, router]);

  const fetchReferralData = async () => {
    try {
      // バックエンドAPIから紹介コードと統計を取得
      const res = await fetch(`http://localhost:8001/api/v1/users/${user?.id}/referral-code/`, {
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        setReferralCode(data.referral_code);
        setStats({
          totalReferrals: data.stats.total_referrals,
          activeReferrals: data.stats.active_referrals,
          totalRewards: data.stats.total_rewards
        });

        // QRコード生成
        generateQRCode(data.referral_url);
      } else {
        // フォールバック: ローカルで生成
        generateReferralCode();
      }
    } catch (err) {
      console.error("紹介コード取得エラー:", err);
      // フォールバック: ローカルで生成
      generateReferralCode();
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

  const generateReferralCode = () => {
    // ユーザーIDベースの紹介コード生成
    const code = `ELDONIA-${user?.username?.toUpperCase()}-${user?.id}`;
    setReferralCode(code);

    // 紹介URLを生成
    const referralUrl = `${window.location.origin}/register?ref=${code}`;

    // QRコード生成
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

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-purple-300 hover:text-purple-100 mb-4 flex items-center gap-2 transition-colors"
          >
            <span>←</span> ダッシュボードに戻る
          </button>
          <h1 className="text-4xl font-bold text-purple-100 font-pt-serif">🎁 紹介コード</h1>
          <p className="text-purple-300 mt-2">友達を招待して特典をゲット！</p>
        </div>

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
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-purple-100 mb-4 flex items-center gap-2">
                <span>🔑</span> あなたの紹介コード
              </h2>
              
              <div className="bg-gray-950 rounded-xl p-6 mb-4">
                <p className="text-3xl font-mono font-bold text-center text-purple-300 break-all">
                  {referralCode}
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
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-purple-100 mb-4 flex items-center gap-2">
                <span>📱</span> QRコード
              </h2>

              {qrCodeUrl && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-6 flex justify-center">
                    <img src={qrCodeUrl} alt="QRコード" className="w-full max-w-xs" />
                  </div>

                  <button
                    onClick={handleDownloadQR}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    💾 QRコードをダウンロード
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 右カラム: 統計と説明 */}
          <div className="space-y-6">
            {/* 紹介統計 */}
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-purple-100 mb-6 flex items-center gap-2">
                <span>📊</span> 紹介実績
              </h2>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-950/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-300 text-sm">総紹介数</p>
                      <p className="text-3xl font-bold text-purple-100">{stats.totalReferrals}</p>
                    </div>
                    <span className="text-4xl">👥</span>
                  </div>
                </div>

                <div className="bg-gray-950/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-300 text-sm">アクティブ</p>
                      <p className="text-3xl font-bold text-green-400">{stats.activeReferrals}</p>
                    </div>
                    <span className="text-4xl">✨</span>
                  </div>
                </div>

                <div className="bg-gray-950/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-300 text-sm">獲得報酬</p>
                      <p className="text-3xl font-bold text-yellow-400">¥{stats.totalRewards.toLocaleString()}</p>
                    </div>
                    <span className="text-4xl">💰</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 紹介URL */}
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-purple-100 mb-4 flex items-center gap-2">
                <span>🔗</span> 紹介リンク
              </h2>

              <div className="bg-gray-950 rounded-xl p-4 mb-4 break-all">
                <p className="text-sm text-purple-300 font-mono">
                  {`${window.location.origin}/register?ref=${referralCode}`}
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
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl shadow-2xl p-8 border-2 border-purple-500/30">
              <h2 className="text-2xl font-bold text-purple-100 mb-4 flex items-center gap-2">
                <span>🎁</span> 紹介特典
              </h2>

              <div className="space-y-3 text-purple-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-semibold">友達が登録</p>
                    <p className="text-sm text-purple-300">あなたと友達に500ポイント</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-semibold">友達が初購入</p>
                    <p className="text-sm text-purple-300">あなたに10%キャッシュバック</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-semibold">10人紹介達成</p>
                    <p className="text-sm text-purple-300">1ヶ月プレミアム無料</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 使い方ガイド */}
        <div className="mt-8 bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-purple-100 mb-6">📖 紹介コードの使い方</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-4">📤</div>
              <h3 className="text-xl font-semibold text-purple-200 mb-2">1. シェア</h3>
              <p className="text-purple-300 text-sm">
                紹介コードやQRコードを友達にシェア
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">✍️</div>
              <h3 className="text-xl font-semibold text-purple-200 mb-2">2. 登録</h3>
              <p className="text-purple-300 text-sm">
                友達が紹介コードで新規登録
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-purple-200 mb-2">3. 特典GET</h3>
              <p className="text-purple-300 text-sm">
                両方に自動的にポイント付与
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

