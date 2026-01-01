'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

// ロケールコードマッピング
const localeMap: Record<string, string> = {
  'JA': 'ja',
  'EN': 'en',
  'ZH': 'zh-CN',
  'KO': 'ko',
}

const displayToLocale = (display: string): string => localeMap[display] || 'ja'
const localeToDisplay = (locale: string): string => {
  const entry = Object.entries(localeMap).find(([, v]) => v === locale)
  return entry ? entry[0] : 'JA'
}

// UI/UX設計書準拠：ヘッダーコンポーネントプロパティ
interface HeaderProps {
  isAuthenticated?: boolean
  user?: {
    name: string
    level: number
    currentExp: number
    maxExp: number
    avatar?: string
  }
  isStaff?: boolean
  cartAmount?: number
  notificationCount?: number
}

// ロゴコンポーネント（エラーハンドリング付き）
const LogoComponent = () => {
  const [logoError, setLogoError] = useState(false)

  if (logoError) {
    // ロゴファイルが見つからない場合の代替表示
    return (
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform duration-300"
        style={{
          background: 'linear-gradient(135deg, #FBBF24, #F97316)'
        }}
      >
        <span className="text-gray-900 font-bold text-2xl">EN</span>
      </div>
    )
  }

  return (
    <div className="w-16 h-16 relative">
      <Image
        src="/assets/logo/eldonia-nex-logo.png"
        alt="Eldonia-Nex ファンタジー魔法陣ロゴ"
        width={64}
        height={64}
        className="object-contain hover:scale-105 transition-transform duration-300"
        onError={() => setLogoError(true)}
        priority
      />
    </div>
  )
}

// UI/UX設計書準拠：3カラムヘッダーレイアウト（30% | 40% | 30%）
const Header: React.FC<HeaderProps> = ({
  isAuthenticated = false,
  user = null,
  isStaff = false,
  cartAmount = 0,
  notificationCount = 0
}) => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [showTitle, setShowTitle] = useState(true)

  // 現在のロケールをURLから取得
  const currentLocale = pathname?.split('/')[1] || 'ja'
  const selectedLanguage = localeToDisplay(currentLocale)

  // 言語変更時のリダイレクト処理（フルページリロードで翻訳を適用）
  const handleLanguageChange = (langDisplay: string) => {
    const newLocale = displayToLocale(langDisplay)

    if (newLocale === currentLocale) {
      setIsLangMenuOpen(false)
      return
    }

    // URLのロケール部分を置換
    const segments = pathname?.split('/') || []
    if (segments.length > 1) {
      segments[1] = newLocale
    }
    const newPath = segments.join('/') || `/${newLocale}`

    setIsLangMenuOpen(false)
    // フルページリロードでサーバーコンポーネントを再レンダリング
    window.location.href = newPath
  }

  // ウィンドウサイズ監視とタイトル表示制御
  React.useEffect(() => {
    const handleResize = () => {
      setShowTitle(window.innerWidth > 1070)
    }

    // 初期設定
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 言語メニューの外部クリック処理
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.language-selector')) {
        setIsLangMenuOpen(false)
      }
    }

    if (isLangMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isLangMenuOpen])

  // EXP進捗率計算
  const expProgress = user ? (user.currentExp / user.maxExp) * 100 : 0

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md shadow-lg w-full z-50">
      <div className="w-[90%] max-w-7xl mx-auto">
        {/* モバイル用レイアウト（0-767px） */}
        <div className="flex md:hidden items-center justify-between min-h-[88px] px-4">
          {/* 左：ロゴのみ（クリックでトップへ） */}
          <div className="flex items-center">
            <Link href={`/${currentLocale}`} className="transition-transform hover:scale-105 duration-200">
              <LogoComponent />
            </Link>
          </div>

          {/* 右：バーガーメニュー（大きめ・操作しやすく） */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 text-gray-300 hover:text-purple-400 transition-colors hover:bg-gray-800 rounded-lg"
            aria-label="メニューを開く"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* タブレット用レイアウト（768px-1023px） */}
        <div className="hidden md:grid lg:hidden grid-cols-[15%_60%_25%] items-center gap-3 min-h-[88px] px-4">
          {/* 左カラム（15%）：ロゴのみ（クリックでトップへ） */}
          <div className="flex items-center justify-center">
            <Link href={`/${currentLocale}`} className="transition-transform hover:scale-105 duration-200">
              <LogoComponent />
            </Link>
          </div>

          {/* 中央カラム（60%）：ナビゲーション＋検索 */}
          <div className="flex flex-col space-y-2 w-full pr-8">
            {/* コンパクトナビゲーション */}
            <nav className="flex justify-center items-center space-x-6">
              {[
                { key: 'gallery', label: 'GALLERY', href: '/gallery' },
                { key: 'community', label: 'COMMUNITY', href: '/community' },
                { key: 'event', label: 'EVENT', href: '/events' },
                { key: 'shop', label: 'SHOP', href: '/marketplace' },
                { key: 'works', label: 'WORKS', href: '/jobs' }
              ].map(({ key, label, href }) => (
                <a
                  key={key}
                  href={`/${currentLocale}${href}`}
                  className="relative group"
                  style={{
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    letterSpacing: '0.05em'
                  }}
                >
                  <span
                    className="text-xs font-semibold tracking-wider transition-colors duration-200"
                    style={{
                      background: 'linear-gradient(180deg, #FCD34D 0%, #F97316 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {label}
                  </span>
                  <span
                    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{
                      background: 'linear-gradient(90deg, #8B5CF6, #3B82F6)'
                    }}
                  ></span>
                </a>
              ))}
            </nav>

            {/* コンパクト検索ボックス */}
            <div className="relative w-full">
              <input
                type="search"
                placeholder="検索..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", sans-serif'
                }}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
              >
                🔍
              </button>
            </div>
          </div>

          {/* 右カラム（25%）：ユーザーセクション */}
          <div className="flex flex-col justify-center min-w-0 w-full pl-8">
            {isAuthenticated && user ? (
              <>
                {/* コンパクトアクションボタン（上段） */}
                <div className="flex items-center justify-center space-x-2 mb-2 mt-3">
                  {/* 言語選択 */}
                  <div className="relative language-selector">
                    <button
                      className="flex items-center space-x-1 p-1 text-gray-300 hover:text-purple-400 transition-colors duration-200 hover:scale-110"
                      onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                      style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                    >
                      <span className="text-xs font-semibold">{selectedLanguage}</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isLangMenuOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 min-w-12">
                        {['JA', 'EN', 'ZH', 'KO'].map((lang) => (
                          <button
                            key={lang}
                            className="block w-full text-left px-2 py-1.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-purple-400 transition-colors first:rounded-t-lg last:rounded-b-lg"
                            onClick={() => handleLanguageChange(lang)}
                            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* カート */}
                  <button className="relative p-1 text-gray-300 hover:text-yellow-400 transition-colors duration-200 hover:scale-110">
                    <span className="text-base">🛒</span>
                    {cartAmount > 0 && (
                      <span
                        className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full px-1 py-0.5 min-w-3 text-center font-bold"
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: '10px' }}
                      >
                        ¥{(cartAmount / 1000).toFixed(0)}K
                      </span>
                    )}
                  </button>

                  {/* 通知 */}
                  <button className="relative p-1 text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:scale-110">
                    <span className="text-base">🔔</span>
                    {notificationCount > 0 && (
                      <span
                        className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full px-1 py-0.5 min-w-3 text-center font-bold"
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: '10px' }}
                      >
                        {notificationCount > 99 ? '99+' : notificationCount}
                      </span>
                    )}
                  </button>

                  {/* 管理者用コントロールセンター (Tablet) */}
                  {isStaff && (
                    <Link href={`/${currentLocale}/admin/settings`}>
                      <button
                        className="p-1 text-indigo-400 hover:text-indigo-300 transition-colors duration-200 hover:scale-110 flex items-center justify-center"
                        title="Master Control Center"
                      >
                        <span className="text-lg">⚙️</span>
                      </button>
                    </Link>
                  )}

                  {/* ユーザープロフィール */}
                  <button className="flex items-center space-x-1 p-1 rounded-lg hover:bg-gray-800 transition-all duration-200 hover:scale-105">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.name}のアバター`}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-600 hover:ring-purple-400 transition-all duration-200"
                      />
                    ) : (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center ring-1 ring-gray-600 hover:ring-purple-400 transition-all duration-200"
                        style={{
                          background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)'
                        }}
                      >
                        <span
                          className="text-white text-xs font-bold"
                          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </button>
                </div>

                {/* コンパクトEXPバー（下段） */}
                <div className="w-full mb-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className="text-purple-400 text-xs font-bold"
                      style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                    >
                      Lv.{user.level}
                    </span>
                    <div className="exp-bar flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${expProgress}%`,
                          background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #3B82F6)'
                        }}
                      />
                    </div>
                    <span
                      className="text-gray-400 text-xs"
                      style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                    >
                      {(user.currentExp / 1000).toFixed(0)}K/{(user.maxExp / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-2 mt-3">
                <div className="flex items-center space-x-2">
                  {/* 言語選択 */}
                  <div className="relative language-selector">
                    <button
                      className="flex items-center space-x-1 p-1 text-gray-300 hover:text-purple-400 transition-colors duration-200 hover:scale-110"
                      onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                      style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                    >
                      <span className="text-xs font-semibold">{selectedLanguage}</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isLangMenuOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 min-w-12">
                        {['JA', 'EN', 'ZH', 'KO'].map((lang) => (
                          <button
                            key={lang}
                            className="block w-full text-left px-2 py-1.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-purple-400 transition-colors first:rounded-t-lg last:rounded-b-lg"
                            onClick={() => handleLanguageChange(lang)}
                            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    className="text-gray-300 hover:text-purple-400 text-xs font-semibold px-2 py-1 border border-gray-600 rounded-lg hover:border-purple-500 transition-all duration-200 hover:scale-105"
                    style={{ fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", sans-serif' }}
                  >
                    ログイン
                  </button>
                  <button
                  // ...existing code...
                  />
                  <Link
                    href={`/${currentLocale}/plans`}
                    className="text-white px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg block w-full h-full text-center"
                    style={{
                      background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                      fontFamily: 'var(--font-noto-sans-jp), \"Noto Sans JP\", sans-serif'
                    }}
                  >
                    新規登録
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* デスクトップ用レイアウト（1024px以上） */}
        <div className="hidden lg:grid grid-cols-[30%_40%_30%] items-center gap-4 min-h-[88px] px-4 lg:px-6">
          {/* 左カラム（30%）：ブランドセクション（クリックでトップへ） */}
          <div className="flex items-center space-x-4">
            <Link href={`/${currentLocale}`} className="transition-transform hover:scale-105 duration-200">
              <LogoComponent />
            </Link>

            {/* 1070px以下でタイトル文字を非表示 */}
            {showTitle && (
              <Link href={`/${currentLocale}`} className="transition-colors hover:opacity-80 duration-200">
                <div className="flex flex-col">
                  <h1 className="brand-title" style={{
                    fontFamily: 'var(--font-pt-serif), "PT Serif", serif',
                    fontSize: '32px',
                    fontWeight: 700,
                    background: 'linear-gradient(180deg, #FCD34D 0%, #F97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    margin: 0,
                    lineHeight: 1.2
                  }}>
                    Eldonia-Nex
                  </h1>
                </div>
              </Link>
            )}
          </div>

          {/* 中央カラム（40%）：ナビゲーション＋検索 */}
          <div className="flex flex-col space-y-3 w-full pr-12">
            {/* メインナビゲーション */}
            <nav className="flex justify-center items-center space-x-8">
              {[
                { key: 'gallery', label: 'GALLERY', href: '/gallery' },
                { key: 'community', label: 'COMMUNITY', href: '/community' },
                { key: 'event', label: 'EVENT', href: '/events' },
                { key: 'shop', label: 'SHOP', href: '/marketplace' },
                { key: 'works', label: 'WORKS', href: '/jobs' }
              ].map(({ key, label, href }) => (
                <a
                  key={key}
                  href={`/${currentLocale}${href}`}
                  className="font-semibold text-sm tracking-wider transition-all duration-200 relative group hover:scale-105"
                  style={{
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    letterSpacing: '0.05em'
                  }}
                >
                  <span
                    className="relative z-10 transition-all duration-200"
                    style={{
                      background: 'linear-gradient(180deg, #FCD34D 0%, #F97316 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(180deg, #FBBF24 0%, #EA580C 100%)'
                      e.currentTarget.style.webkitBackgroundClip = 'text'
                      e.currentTarget.style.webkitTextFillColor = 'transparent'
                      e.currentTarget.style.backgroundClip = 'text'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(180deg, #FCD34D 0%, #F97316 100%)'
                      e.currentTarget.style.webkitBackgroundClip = 'text'
                      e.currentTarget.style.webkitTextFillColor = 'transparent'
                      e.currentTarget.style.backgroundClip = 'text'
                    }}
                  >
                    {label}
                  </span>
                  <span
                    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{
                      background: 'linear-gradient(90deg, #FCD34D, #F97316)'
                    }}
                  ></span>
                </a>
              ))}
            </nav>

            {/* 検索ボックス */}
            <div className="relative w-full">
              <input
                type="search"
                placeholder="作品・クリエイターを検索..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", sans-serif'
                }}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
              >
                🔍
              </button>
            </div>
          </div>

          {/* 右カラム（30%）：ユーザーセクション */}
          <div className="flex flex-col justify-center min-w-0 w-full pl-12">
            {isAuthenticated && user ? (
              // ログイン時UI（UI/UX設計書準拠：上段アクション / 下段EXP）
              <>
                {/* アクションボタン（上段・中央寄せ） */}
                <div className="flex items-center justify-center space-x-4 mb-3 mt-4 px-2">
                  {/* 言語選択 */}
                  <div className="relative language-selector">
                    <button
                      className="flex items-center space-x-1 p-1.5 text-gray-300 hover:text-purple-400 transition-colors duration-200 hover:scale-110"
                      onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                      style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                    >
                      <span className="text-sm font-semibold">{selectedLanguage}</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isLangMenuOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 min-w-16">
                        {['JA', 'EN', 'ZH', 'KO'].map((lang) => (
                          <button
                            key={lang}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-purple-400 transition-colors first:rounded-t-lg last:rounded-b-lg"
                            onClick={() => {
                              handleLanguageChange(lang)
                              setIsLangMenuOpen(false)
                            }}
                            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* カート */}
                  <button className="relative p-1.5 text-gray-300 hover:text-yellow-400 transition-colors duration-200 hover:scale-110">
                    <span className="text-lg">🛒</span>
                    {cartAmount > 0 && (
                      <span
                        className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-4 text-center font-bold"
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                      >
                        ¥{(cartAmount / 1000).toFixed(1)}K
                      </span>
                    )}
                  </button>

                  {/* 通知 */}
                  <button className="relative p-1.5 text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:scale-110">
                    <span className="text-lg">🔔</span>
                    {notificationCount > 0 && (
                      <span
                        className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-4 text-center font-bold"
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                      >
                        {notificationCount > 99 ? '99+' : notificationCount}
                      </span>
                    )}
                  </button>

                  {/* 管理者用コントロールセンター */}
                  {isStaff && (
                    <Link href={`/${currentLocale}/admin/settings`}>
                      <button
                        className="p-1.5 text-indigo-400 hover:text-indigo-300 transition-colors duration-200 hover:scale-110 flex items-center justify-center"
                        title="Master Control Center"
                      >
                        <span className="text-xl">⚙️</span>
                      </button>
                    </Link>
                  )}

                  {/* ユーザープロフィール */}
                  <Link href={`/${currentLocale}/dashboard`}>
                    <button className="flex items-center space-x-1 p-1.5 rounded-lg hover:bg-gray-800 transition-all duration-200 hover:scale-105">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.name}のアバター`}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-600 hover:ring-purple-400 transition-all duration-200"
                        />
                      ) : (
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center ring-1 ring-gray-600 hover:ring-purple-400 transition-all duration-200"
                          style={{
                            background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)'
                          }}
                        >
                          <span
                            className="text-white text-sm font-bold"
                            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span
                        className="text-gray-300 text-sm font-medium hidden xl:block"
                        style={{ fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", sans-serif' }}
                      >
                        👤
                      </span>
                    </button>
                  </Link>
                </div>

                {/* EXPバー（下段・横並び） UI/UX設計書準拠 */}
                <div className="flex items-center justify-center space-x-2 w-full mb-2.5">
                  <span
                    className="text-purple-400 text-xs font-bold tracking-wide shrink-0"
                    style={{
                      fontFamily: 'var(--font-inter), Inter, sans-serif',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Lv.{user.level}
                  </span>

                  <div className="exp-bar flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${expProgress}%`,
                        background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #3B82F6)'
                      }}
                    />
                  </div>

                  <span
                    className="text-gray-400 text-xs font-medium shrink-0"
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    {user.currentExp.toLocaleString()}/{user.maxExp.toLocaleString()} EXP
                  </span>
                </div>
              </>
            ) : (
              // 未ログイン時UI
              <div className="flex flex-col items-center space-y-3 mt-4 px-2">
                <div className="flex flex-row items-center w-full justify-center flex-wrap gap-2">
                  {/* 言語選択 */}
                  <div className="relative language-selector">
                    <button
                      className="flex items-center space-x-1 p-1.5 text-gray-300 hover:text-purple-400 transition-colors duration-200 hover:scale-110"
                      onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                      style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                    >
                      <span className="text-sm font-semibold">{selectedLanguage}</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isLangMenuOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 min-w-16">
                        {['JA', 'EN', 'ZH', 'KO'].map((lang) => (
                          <button
                            key={lang}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-purple-400 transition-colors first:rounded-t-lg last:rounded-b-lg"
                            onClick={() => {
                              handleLanguageChange(lang)
                              setIsLangMenuOpen(false)
                            }}
                            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/${currentLocale}/signin`}
                    className="text-gray-300 hover:text-purple-400 text-sm font-semibold px-3 py-1.5 border border-gray-600 rounded-lg hover:border-purple-500 transition-all duration-200 hover:scale-105"
                    style={{ fontFamily: 'var(--font-noto-sans-jp), \"Noto Sans JP\", sans-serif' }}
                    passHref
                  >
                    ログイン
                  </Link>
                  <button
                  // ...existing code...
                  />
                  <Link
                    href={`/${currentLocale}/plans`}
                    className="text-white bg-linear-to-r from-purple-600 to-purple-400 px-3 py-1.5 border border-gray-600 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg block text-center hover:border-purple-500"
                    style={{
                      fontFamily: 'var(--font-noto-sans-jp), \"Noto Sans JP\", sans-serif'
                    }}
                  >
                    新規登録
                  </Link>
                </div>
                <div
                  className="text-center text-xs text-gray-500 font-medium"
                  style={{ fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", sans-serif' }}
                >
                  ゲストとして閲覧中
                </div>
              </div>
            )}
          </div>
        </div>

        {/* モバイルメニュー（拡張版・スクロール対応） */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800/95 backdrop-blur-md border-t border-gray-700 shadow-2xl fixed left-0 right-0 top-[88px] bottom-0 z-40 overflow-y-auto">
            <div className="min-h-full max-w-md mx-auto md:max-w-lg">
              {/* ユーザー情報セクション */}
              {isAuthenticated && user ? (
                <div className="px-6 py-6 border-b border-gray-700 bg-linear-to-r from-gray-850 to-gray-800">
                  <div className="flex items-center space-x-4 mb-4">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.name}のアバター`}
                        className="w-12 h-12 rounded-full object-cover ring-3 ring-purple-400 shadow-lg"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center ring-3 ring-purple-400 shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)'
                        }}
                      >
                        <span
                          className="text-white font-bold text-lg"
                          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-white font-semibold text-lg" style={{ fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", sans-serif' }}>
                        {user.name}
                      </div>
                      <div className="text-purple-400 text-sm font-bold" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                        Lv.{user.level}
                      </div>
                    </div>
                  </div>

                  {/* EXPバー */}
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 text-sm font-medium" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                        経験値
                      </span>
                      <span className="text-gray-400 text-xs" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                        {user.currentExp.toLocaleString()}/{user.maxExp.toLocaleString()} EXP
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out shadow-lg"
                        style={{
                          width: `${expProgress}%`,
                          background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #3B82F6)',
                          boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)'
                        }}
                      />
                    </div>

                    {/* 管理者用リンク (Mobile) */}
                    {isStaff && (
                      <div className="mt-4 pt-4 border-t border-gray-700/50">
                        <Link
                          href={`/${currentLocale}/admin/settings`}
                          className="flex items-center space-x-3 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-300 hover:bg-indigo-500/20 transition-all"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="text-xl">⚙️</span>
                          <span className="font-bold">Master Control Center</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="px-6 py-6 border-b border-gray-700 bg-linear-to-r from-gray-850 to-gray-800">
                  <div className="flex flex-col space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="text-white text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", sans-serif' }}>
                        Eldonia-Nexへようこそ
                      </h3>
                      <p className="text-gray-400 text-sm" style={{ fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", sans-serif' }}>
                        創造性を解き放とう
                      </p>
                    </div>
                    <button
                      className="w-full text-gray-300 hover:text-purple-400 text-sm font-semibold px-5 py-3 border border-gray-600 rounded-xl hover:border-purple-500 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20"
                      style={{ fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", sans-serif' }}
                    >
                      ログイン
                    </button>
                    <button
                    // ...existing code...
                    />
                    <Link
                      href={`/${currentLocale}/plans`}
                      className="w-full text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 block text-center"
                      style={{
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        fontFamily: 'var(--font-noto-sans-jp), \"Noto Sans JP\", sans-serif'
                      }}
                    >
                      新規登録
                    </Link>
                  </div>
                </div>
              )}

              {/* アクション機能（カート・通知・言語） */}
              <div className="px-6 py-6 border-b border-gray-700">
                <h3 className="text-gray-400 text-sm font-bold mb-4 uppercase tracking-wider flex items-center" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                  <span className="w-8 h-0.5 bg-purple-500 mr-3 rounded"></span>
                  機能
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                  {/* カート */}
                  <button className="flex items-center justify-between w-full p-4 text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50 rounded-xl transition-all duration-200 group hover:shadow-lg hover:shadow-yellow-500/20">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                        <span className="text-xl">🛒</span>
                      </div>
                      <span className="font-medium text-base" style={{ fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", sans-serif' }}>
                        ショッピングカート
                      </span>
                    </div>
                    {cartAmount > 0 && (
                      <span
                        className="bg-red-500 text-white text-xs rounded-full px-3 py-1.5 min-w-8 text-center font-bold shadow-lg"
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                      >
                        ¥{(cartAmount / 1000).toFixed(1)}K
                      </span>
                    )}
                  </button>

                  {/* 通知 */}
                  <button className="flex items-center justify-between w-full p-4 text-gray-300 hover:text-blue-400 hover:bg-gray-700/50 rounded-xl transition-all duration-200 group hover:shadow-lg hover:shadow-blue-500/20">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                        <span className="text-xl">🔔</span>
                      </div>
                      <span className="font-medium text-base" style={{ fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", sans-serif' }}>
                        通知
                      </span>
                    </div>
                    {notificationCount > 0 && (
                      <span
                        className="bg-red-500 text-white text-xs rounded-full px-3 py-1.5 min-w-6 text-center font-bold shadow-lg animate-pulse"
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                      >
                        {notificationCount > 99 ? '99+' : notificationCount}
                      </span>
                    )}
                  </button>

                  {/* 言語選択 */}
                  <div className="relative md:col-span-2 lg:col-span-1">
                    <button
                      className="flex items-center justify-between w-full p-4 text-gray-300 hover:text-purple-400 hover:bg-gray-700/50 rounded-xl transition-all duration-200 group hover:shadow-lg hover:shadow-purple-500/20"
                      onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                          <span className="text-xl">🌐</span>
                        </div>
                        <span className="font-medium text-base" style={{ fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", sans-serif' }}>
                          言語設定
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold bg-purple-500/20 px-3 py-1 rounded-lg" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                          {selectedLanguage}
                        </span>
                        <svg className={`w-5 h-5 transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {isLangMenuOpen && (
                      <div className="mt-3 bg-gray-700/90 backdrop-blur-md border border-gray-600 rounded-xl shadow-2xl overflow-hidden">
                        {['JA', 'EN', 'ZH', 'KO'].map((lang, index) => (
                          <button
                            key={lang}
                            className="block w-full text-left px-5 py-4 text-sm text-gray-300 hover:bg-gray-600 hover:text-purple-400 transition-all duration-200 group"
                            onClick={() => {
                              handleLanguageChange(lang)
                              setIsLangMenuOpen(false)
                            }}
                            style={{
                              fontFamily: 'var(--font-inter), Inter, sans-serif',
                              borderBottom: index < 3 ? '1px solid rgba(75, 85, 99, 0.5)' : 'none'
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{lang}</span>
                              {selectedLanguage === lang && (
                                <span className="text-purple-400 text-xs">✓</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ナビゲーション */}
              <nav className="px-6 py-6 border-b border-gray-700">
                <h3 className="text-gray-400 text-sm font-bold mb-4 uppercase tracking-wider flex items-center" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                  <span className="w-8 h-0.5 bg-purple-500 mr-3 rounded"></span>
                  ナビゲーション
                </h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
                  {[
                    { label: 'GALLERY', href: '/gallery', icon: '🖼️', color: 'from-pink-500 to-rose-500' },
                    { label: 'COMMUNITY', href: '/community', icon: '👥', color: 'from-blue-500 to-cyan-500' },
                    { label: 'EVENT', href: '/events', icon: '📅', color: 'from-green-500 to-emerald-500' },
                    { label: 'SHOP', href: '/marketplace', icon: '🛍️', color: 'from-yellow-500 to-orange-500' },
                    { label: 'WORKS', href: '/jobs', icon: '💼', color: 'from-purple-500 to-indigo-500' }
                  ].map(({ label, href, icon, color }) => (
                    <a
                      key={label}
                      href={`/${currentLocale}${href}`}
                      className="flex items-center space-x-4 text-gray-300 hover:text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 hover:bg-gray-700/50 group hover:shadow-lg hover:scale-105"
                      style={{
                        fontFamily: 'var(--font-inter), Inter, sans-serif',
                        letterSpacing: '0.05em'
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className={`w-10 h-10 bg-linear-to-br ${color} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        <span className="text-lg filter drop-shadow-sm">{icon}</span>
                      </div>
                      <span className="text-base font-medium">{label}</span>
                    </a>
                  ))}
                </div>
              </nav>

              {/* モバイル・タブレット検索 */}
              <div className="px-6 py-6 bg-gray-850/50">
                <h3 className="text-gray-400 text-sm font-bold mb-4 uppercase tracking-wider flex items-center" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                  <span className="w-8 h-0.5 bg-purple-500 mr-3 rounded"></span>
                  検索
                </h3>
                <div className="relative">
                  <input
                    type="search"
                    placeholder="作品・クリエイターを検索..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-xl text-sm text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:bg-gray-700/70 shadow-inner"
                    style={{ fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", sans-serif' }}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 閉じるボタン */}
              <div className="px-6 py-6">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl transition-all duration-200 font-medium"
                  style={{ fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", sans-serif' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>メニューを閉じる</span>
                </button>
              </div>

              {/* 下部余白 */}
              <div className="h-8"></div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header