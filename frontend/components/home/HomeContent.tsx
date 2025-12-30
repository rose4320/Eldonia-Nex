'use client'

import { useTranslation } from '../../app/context/TranslationContext'

interface SystemStatus {
  status: string
  message: string
  ssr_ready?: boolean
  error_type?: string
  timestamp?: string
}

interface HomeContentProps {
  systemStatus: SystemStatus
}

export default function HomeContent({ systemStatus }: HomeContentProps) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* メインコンテンツ */}
      <div className="container mx-auto px-6 py-16">
        {/* ヒーローセクション */}
        <div className="text-center mb-20">
          <h2 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
              {t('home.heroTitle1')}
            </span>
            <br />
            <span className="brand-title text-6xl">
              {t('home.heroTitle2')}
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
            {t('home.heroDescription')}
          </p>
          
          {/* システムステータス表示 */}
          <div className="mb-12 p-6 bg-gray-800/70 rounded-2xl shadow-xl max-w-3xl mx-auto border border-purple-500/30">
            <h3 className="text-lg font-bold mb-4 text-center text-purple-400">🚀 {t('home.systemStatus')}</h3>
            
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
                  <div className="text-xs text-gray-400">{t('home.frontendHealthy')}</div>
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
            <h3 className="text-xl font-bold mb-4 text-center text-purple-300">{t('home.gallery')}</h3>
            <p className="text-gray-400 text-center">
              {t('home.galleryDesc')}
            </p>
          </div>
          
          <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-indigo-500/30 hover:border-indigo-400/50">
            <div className="text-6xl mb-6 text-center">📺</div>
            <h3 className="text-xl font-bold mb-4 text-center text-indigo-300">{t('home.streaming')}</h3>
            <p className="text-gray-400 text-center">
              {t('home.streamingDesc')}
            </p>
          </div>
          
          <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-green-500/30 hover:border-green-400/50">
            <div className="text-6xl mb-6 text-center">💼</div>
            <h3 className="text-xl font-bold mb-4 text-center text-green-300">{t('home.marketplace')}</h3>
            <p className="text-gray-400 text-center">
              {t('home.marketplaceDesc')}
            </p>
          </div>
          
          <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-yellow-500/30 hover:border-yellow-400/50">
            <div className="text-6xl mb-6 text-center">🎮</div>
            <h3 className="text-xl font-bold mb-4 text-center text-yellow-300">{t('home.gamification')}</h3>
            <p className="text-gray-400 text-center">
              {t('home.gamificationDesc')}
            </p>
          </div>
        </div>

        {/* CTAセクション */}
        <div className="text-center">
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:from-purple-700 hover:to-indigo-700 hover:shadow-2xl transition-all">
            🚀 {t('home.startNow')}
          </button>
        </div>
      </div>
    </div>
  )
}




