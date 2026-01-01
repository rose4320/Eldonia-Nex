'use client'

import { useRouter } from 'next/navigation'
import { FiArrowRight, FiCalendar, FiZap } from 'react-icons/fi'
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
  challenges: {
    weekly_challenge: string | null
    monthly_challenge: string | null
  }
}

export default function HomeContent({ systemStatus, challenges }: HomeContentProps) {
  const { t, locale } = useTranslation()
  const router = useRouter()

  const handleJoin = (theme: string | null) => {
    if (!theme) return
    router.push(`/${locale}/artworks/upload?tags=${encodeURIComponent(theme)}&title=${encodeURIComponent(theme + 'の作品')}`)
  }

  const handleView = (theme: string | null) => {
    if (!theme) return
    router.push(`/${locale}/gallery?search=${encodeURIComponent(theme)}`)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Blobs for Premium Feel */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full"></div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* ヒーローセクション */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-sm font-bold mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            NEXT GENERATION CREATIVE HUB
          </div>

          <h1 className="text-7xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
            <span className="block text-white">
              {t('home.heroTitle1')}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400">
              {t('home.heroTitle2')}
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            {t('home.heroDescription')}
          </p>

          {/* チャレンジ（お題）セクション - 置換箇所 */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            {/* 今週のお題 */}
            <div className="group relative bg-gray-900/40 border border-purple-500/30 rounded-[2.5rem] p-8 backdrop-blur-2xl hover:border-purple-400/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)] overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <FiZap className="text-6xl text-purple-400" />
              </div>
              <div className="relative z-10 text-left">
                <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 border border-purple-500/20">
                  {t('home.weeklyChallenge')}
                </span>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight leading-tight group-hover:text-purple-300 transition-colors">
                  {challenges.weekly_challenge || 'お題を準備中...'}
                </h3>
                <button
                  onClick={() => handleJoin(challenges.weekly_challenge)}
                  className="flex items-center gap-2 text-xs font-bold text-gray-500 group-hover:text-white transition-all outline-none"
                >
                  今すぐ参加する <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* 今月のお題 */}
            <div className="group relative bg-gray-900/40 border border-indigo-500/30 rounded-[2.5rem] p-8 backdrop-blur-2xl hover:border-indigo-400/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)] overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <FiCalendar className="text-6xl text-indigo-400" />
              </div>
              <div className="relative z-10 text-left">
                <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 border border-indigo-500/20">
                  {t('home.monthlyChallenge')}
                </span>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight leading-tight group-hover:text-indigo-300 transition-colors">
                  {challenges.monthly_challenge || '次のお題をお楽しみに'}
                </h3>
                <button
                  onClick={() => handleView(challenges.monthly_challenge)}
                  className="flex items-center gap-2 text-xs font-bold text-gray-500 group-hover:text-white transition-all outline-none"
                >
                  詳細を見る <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* バックエンド稼働状況 (サブ情報として小さく表示) */}
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold tracking-widest text-gray-600 uppercase">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${systemStatus.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              API: {systemStatus.status.toUpperCase()}
            </div>
            <span className="w-px h-3 bg-gray-800"></span>
            <div>LOCALE: {t('common.appName')}</div>
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




