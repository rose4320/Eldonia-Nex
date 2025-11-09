import { Metadata } from 'next'

// Server-Side Rendering用メタデータ
export const metadata: Metadata = {
  title: 'Eldonia-Nex - Creative Platform',
  description: 'クリエイター向け総合プラットフォーム。作品投稿、ライブ配信、マーケットプレイス機能を提供',
  keywords: ['creative', 'platform', 'artwork', 'streaming', 'marketplace', 'japan'],
  openGraph: {
    title: 'Eldonia-Nex - Creative Platform',
    description: 'クリエイター向け総合プラットフォーム',
    type: 'website',
    locale: 'ja_JP',
  },
}

// Django APIからのデータ取得（SSR）
async function getApiHealth() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/health/', {
      cache: 'no-store', // SSRで毎回最新データを取得
    })
    if (!res.ok) throw new Error('API接続エラー')
    return await res.json()
  } catch (error) {
    console.error('Django API接続失敗:', error)
    return { status: 'error', message: 'APIに接続できませんでした' }
  }
}

// SSRメインコンポーネント
export default async function HomePage() {
  const apiStatus = await getApiHealth()

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-purple-800">
              Eldonia-Nex
            </h1>
            <nav className="space-x-6">
              <a href="#" className="text-gray-600 hover:text-purple-600">
                ギャラリー
              </a>
              <a href="#" className="text-gray-600 hover:text-purple-600">
                ライブ配信
              </a>
              <a href="#" className="text-gray-600 hover:text-purple-600">
                マーケットプレイス
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            クリエイターのための
            <span className="text-purple-600">総合プラットフォーム</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            作品投稿から販売、ライブ配信まで。クリエイターの創作活動をトータルサポート
          </p>
          
          {/* API接続ステータス */}
          <div className="mb-8 p-4 rounded-lg bg-white shadow-md">
            <h3 className="text-lg font-semibold mb-2">システムステータス</h3>
            <div className="flex items-center justify-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${
                apiStatus.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                Django API: {apiStatus.message}
              </span>
              {apiStatus.ssr_ready && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  SSR Ready
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 機能紹介 */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-purple-600 text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-3">作品ギャラリー</h3>
            <p className="text-gray-600">
              画像、動画、音声、ドキュメントまで様々な形式の作品を投稿・展示
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-purple-600 text-4xl mb-4">📺</div>
            <h3 className="text-xl font-bold mb-3">ライブ配信</h3>
            <p className="text-gray-600">
              リアルタイムでファンとコミュニケーション。創作過程も配信可能
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-purple-600 text-4xl mb-4">💼</div>
            <h3 className="text-xl font-bold mb-3">マーケットプレイス</h3>
            <p className="text-gray-600">
              作品販売やコミッション受注で収益化を実現
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors">
            今すぐ始める
          </button>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 Eldonia-Nex. クリエイターの創作活動を支援します。</p>
        </div>
      </footer>
    </div>
  )
}
