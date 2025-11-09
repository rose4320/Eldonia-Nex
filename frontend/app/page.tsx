import { Metadata } from 'next'
import Layout from '../components/layout/Layout'

// 要件定義書に基づくメタデータ設定
export const metadata: Metadata = {
  title: 'Eldonia-Nex - クリエイターのための創作プラットフォーム',
  description: 'すべてのクリエイターが自由に表現し、正当な評価と収益を得られる世界の実現',
  keywords: ['creative', 'platform', 'artwork', 'streaming', 'marketplace', 'japan'],
  openGraph: {
    title: 'Eldonia-Nex - Creative Platform',
    description: 'クリエイター向け総合プラットフォーム',
    type: 'website',
    locale: 'ja_JP',
  },
}

// Django APIからシステム状況取得（SSR）
async function getSystemStatus() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
  
  try {
    // タイムアウト設定付きfetch
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3秒タイムアウト
    
    const res = await fetch(`${API_URL}/health/`, {
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
    
    clearTimeout(timeoutId)
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }
    
    const data = await res.json()
    return {
      status: 'healthy',
      message: 'バックエンド正常稼働中',
      ssr_ready: true,
      timestamp: new Date().toISOString(),
      ...data
    }
  } catch (error: unknown) {
    const err = error as Error
    console.warn('Django API接続エラー:', err.message)
    
    // エラー種別による詳細メッセージ
    let message = 'バックエンドに接続できませんでした'
    if (err.name === 'AbortError') {
      message = 'バックエンド接続タイムアウト（3秒）'
    } else if ('code' in err && err.code === 'ECONNREFUSED') {
      message = 'バックエンドサーバーが起動していません'
    } else if (err.message.includes('HTTP')) {
      message = `バックエンドエラー: ${err.message}`
    }
    
    return { 
      status: 'error', 
      message,
      ssr_ready: false,
      timestamp: new Date().toISOString(),
      error_type: err.name || 'UnknownError'
    }
  }
}

// Eldonia-Nex メインページ（SSR + Layout）
export default async function EldoniaNexHomePage() {
  const systemStatus = await getSystemStatus()
  
  // ヘッダープロパティ設定（テスト用）
  const headerProps = {
    isAuthenticated: true, // テスト用
    user: {
      name: 'テストユーザー',
      level: 25,
      currentExp: 12500,
      maxExp: 15000,
    },
    cartAmount: 1200,
    notificationCount: 5
  }

  return (
    <Layout headerProps={headerProps}>
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-indigo-900">
        {/* メインコンテンツ */}
        <div className="container mx-auto px-6 py-16">
          {/* ヒーローセクション */}
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-linear-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
                クリエイターのための
              </span>
              <br />
              <span className="brand-title text-6xl">
                創作プラットフォーム
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
              すべてのクリエイターが自由に表現し、正当な評価と収益を得られる世界の実現
            </p>
            
            {/* システムステータス表示 */}
            <div className="mb-12 p-6 bg-gray-800/70 rounded-2xl shadow-xl max-w-3xl mx-auto border border-purple-500/30">
              <h3 className="text-lg font-bold mb-4 text-center text-purple-400">🚀 システムステータス</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* バックエンドステータス */}
                <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    systemStatus.status === 'healthy' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-200">Django Backend</div>
                    <div className="text-xs text-gray-400">{systemStatus.message}</div>
                  </div>
                </div>
                
                {/* フロントエンドステータス */}
                <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-200">Next.js Frontend</div>
                    <div className="text-xs text-gray-400">SSR正常稼働中</div>
                  </div>
                </div>
              </div>
              
              {/* 詳細情報 */}
              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    {systemStatus.ssr_ready && (
                      <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded-full font-medium">
                        🌟 SSR Ready
                      </span>
                    )}
                    {systemStatus.error_type && (
                      <span className="bg-red-900/50 text-red-300 px-2 py-1 rounded-full font-medium">
                        ⚠️ {systemStatus.error_type}
                      </span>
                    )}
                  </div>
                  {systemStatus.timestamp && (
                    <div>
                      最終確認: {new Date(systemStatus.timestamp).toLocaleTimeString('ja-JP')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 機能紹介セクション */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-purple-500/30 hover:border-purple-400/50">
              <div className="text-6xl mb-6 text-center">🎨</div>
              <h3 className="text-xl font-bold mb-4 text-center text-purple-300">作品ギャラリー</h3>
              <p className="text-gray-400 text-center">
                様々な形式の作品を投稿・展示
              </p>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-indigo-500/30 hover:border-indigo-400/50">
              <div className="text-6xl mb-6 text-center">📺</div>
              <h3 className="text-xl font-bold mb-4 text-center text-indigo-300">ライブ配信</h3>
              <p className="text-gray-400 text-center">
                リアルタイムで創作過程を配信
              </p>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-green-500/30 hover:border-green-400/50">
              <div className="text-6xl mb-6 text-center">💼</div>
              <h3 className="text-xl font-bold mb-4 text-center text-green-300">マーケットプレイス</h3>
              <p className="text-gray-400 text-center">
                作品販売で収益化を実現
              </p>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-yellow-500/30 hover:border-yellow-400/50">
              <div className="text-6xl mb-6 text-center">🎮</div>
              <h3 className="text-xl font-bold mb-4 text-center text-yellow-300">ゲーミフィケーション</h3>
              <p className="text-gray-400 text-center">
                EXP獲得でレベルアップ
              </p>
            </div>
          </div>

          {/* CTAセクション */}
          <div className="text-center">
            <button className="bg-linear-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:from-purple-700 hover:to-indigo-700 hover:shadow-2xl transition-all">
              🚀 今すぐ始める
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}