'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

/* ============================================================
   Eldonia-Nex Header — 黒×金ファンタジーデザイン
   ============================================================ */

interface HeaderProps {
  isAuthenticated?: boolean
  user?: {
    name: string
    level: number
    currentExp: number
    maxExp: number
    avatar?: string
  } | null
  cartAmount?: number
  notificationCount?: number
}

const NAV_ITEMS = [
  { label: 'GALLERY',   href: '/gallery',     icon: '🖼' },
  { label: 'COMMUNITY', href: '/community',   icon: '👥' },
  { label: 'EVENT',     href: '/events',      icon: '📅' },
  { label: 'MARKET',    href: '/marketplace', icon: '🛍' },
  { label: 'WORKS',     href: '/jobs',        icon: '💼' },
]

const LANGUAGES = ['JA', 'EN', 'ZH', 'KO', 'VI']

/* ── ロゴコンポーネント ── */
const LogoMark: React.FC = () => {
  const [err, setErr] = useState(false)
  if (err) {
    return (
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
        style={{
          background: 'linear-gradient(135deg, #FCD34D, #F97316)',
          color: '#111',
          fontFamily: 'var(--font-pt-serif), serif',
          boxShadow: '0 0 16px rgba(252,211,77,.4)',
        }}
      >
        EN
      </div>
    )
  }
  return (
    <div
      className="w-10 h-10 relative shrink-0 transition-transform duration-300 hover:scale-110"
      style={{ filter: 'drop-shadow(0 0 10px rgba(252,211,77,.45))' }}
    >
      <Image
        src="/assets/logo/eldonia-nex-logo.png"
        alt="Eldonia-Nex"
        fill
        sizes="40px"
        className="object-contain"
        onError={() => setErr(true)}
        priority
      />
    </div>
  )
}

/* ── EXP バー ── */
const ExpBar: React.FC<{ level: number; current: number; max: number; compact?: boolean }> = ({
  level, current, max, compact = false
}) => {
  const pct = Math.min((current / max) * 100, 100)
  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'w-full'}`}>
      <span
        className="text-xs font-bold shrink-0"
        style={{
          fontFamily: 'var(--font-pt-serif), serif',
          color: '#FCD34D',
          textShadow: '0 0 6px rgba(252,211,77,.5)',
        }}
      >
        Lv.{level}
      </span>
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{
          height: '4px',
          minWidth: compact ? '60px' : '80px',
          background: 'rgba(252,211,77,.1)',
          border: '1px solid rgba(252,211,77,.15)',
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #FCD34D, #F97316)',
            boxShadow: '0 0 4px rgba(252,211,77,.5)',
          }}
        />
      </div>
    </div>
  )
}

/* ── ナビリンク ── */
const NavLink: React.FC<{ label: string; href: string }> = ({ label, href }) => (
  <a
    href={href}
    className="relative group text-xs font-semibold tracking-[.12em] uppercase transition-all duration-200"
    style={{ fontFamily: 'var(--font-pt-serif), Inter, sans-serif' }}
  >
    <span
      className="transition-all duration-200"
      style={{
        background: 'linear-gradient(180deg, rgba(252,211,77,.7) 0%, rgba(249,115,22,.7) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {label}
    </span>
    {/* ホバー下線 */}
    <span
      className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
      style={{ background: 'linear-gradient(90deg, #FCD34D, #F97316)' }}
    />
  </a>
)

/* ── メインヘッダー ── */
const Header: React.FC<HeaderProps> = ({
  isAuthenticated = false,
  user = null,
  cartAmount = 0,
  notificationCount = 0,
}) => {
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [langOpen,    setLangOpen]    = useState(false)
  const [lang,        setLang]        = useState('JA')
  const [scrolled,    setScrolled]    = useState(false)
  const [showTitle,   setShowTitle]   = useState(true)
  const langRef = useRef<HTMLDivElement>(null)

  /* スクロール検知 */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* タイトル表示幅制御 */
  useEffect(() => {
    const check = () => setShowTitle(window.innerWidth > 1100)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  /* 言語メニュー外クリック */
  useEffect(() => {
    if (!langOpen) return
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [langOpen])

  /* モバイルメニュー開時スクロールロック */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const expPct = user ? Math.min((user.currentExp / user.maxExp) * 100, 100) : 0

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? 'rgba(8,8,8,.96)'
            : 'linear-gradient(180deg, rgba(8,8,8,.98) 0%, rgba(8,8,8,.85) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled
            ? '1px solid rgba(252,211,77,.15)'
            : '1px solid rgba(252,211,77,.06)',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,.7)' : 'none',
        }}
      >
        {/* ── トップゴールドライン ── */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(252,211,77,.5), rgba(249,115,22,.5), transparent)' }}
        />

        <div className="w-[92%] max-w-[1280px] mx-auto">

          {/* ──────────────────────────────────────
              モバイル ( ~767px )
              ────────────────────────────────────── */}
          <div className="flex md:hidden items-center justify-between" style={{ minHeight: '72px' }}>
            <Link href="/" className="flex items-center gap-2.5">
              <LogoMark />
              <span
                className="text-lg font-bold"
                style={{
                  fontFamily: 'var(--font-pt-serif), serif',
                  background: 'linear-gradient(180deg, #FCD34D, #F97316)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Eldonia-Nex
              </span>
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-lg transition-colors"
              style={{ color: menuOpen ? '#FCD34D' : 'rgba(200,180,140,.7)' }}
              aria-label="メニュー"
            >
              {menuOpen
                ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>

          {/* ──────────────────────────────────────
              デスクトップ ( 768px+ ) — 3カラム
              ────────────────────────────────────── */}
          <div
            className="hidden md:grid"
            style={{
              gridTemplateColumns: '30% 40% 30%',
              alignItems: 'center',
              gap: '16px',
              minHeight: '88px',
            }}
          >
            {/* ── 左: ブランド ── */}
            <Link href="/" className="flex items-center gap-3 group">
              <LogoMark />
              {showTitle && (
                <span
                  className="font-bold leading-none"
                  style={{
                    fontFamily: 'var(--font-pt-serif), serif',
                    fontSize: '28px',
                    background: 'linear-gradient(180deg, #FCD34D 0%, #F97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 8px rgba(252,211,77,.3))',
                    transition: 'filter .3s ease',
                  }}
                >
                  Eldonia-Nex
                </span>
              )}
            </Link>

            {/* ── 中央: ナビ + 検索 ── */}
            <div className="flex flex-col gap-2.5 w-full px-2">
              {/* ナビ */}
              <nav className="flex justify-center items-center gap-6 xl:gap-8">
                {NAV_ITEMS.map(n => <NavLink key={n.label} label={n.label} href={n.href} />)}
              </nav>
              {/* 検索 */}
              <div className="relative">
                <input
                  type="search"
                  placeholder="作品・クリエイターを検索..."
                  className="w-full pl-4 pr-10 py-2 text-sm rounded-lg outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,.04)',
                    border: '1px solid rgba(252,211,77,.12)',
                    color: 'rgba(245,240,232,.8)',
                    fontFamily: 'var(--font-noto-sans-jp), sans-serif',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(252,211,77,.35)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(252,211,77,.15)' }}
                  onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(252,211,77,.12)'; e.currentTarget.style.boxShadow = 'none' }}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-sm transition-colors" style={{ color: 'rgba(252,211,77,.4)' }}>
                  🔍
                </button>
              </div>
            </div>

            {/* ── 右: ユーザーセクション ── */}
            <div className="flex flex-col items-end gap-2 pl-4">
              {isAuthenticated && user ? (
                <>
                  {/* アクションアイコン行 */}
                  <div className="flex items-center gap-3">
                    {/* 言語 */}
                    <div className="relative" ref={langRef}>
                      <button
                        className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition-all duration-200"
                        style={{
                          fontFamily: 'var(--font-pt-serif), serif',
                          color: 'rgba(252,211,77,.7)',
                          border: '1px solid rgba(252,211,77,.15)',
                          background: 'rgba(252,211,77,.04)',
                        }}
                        onClick={() => setLangOpen(!langOpen)}
                      >
                        {lang}
                        <svg className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {langOpen && (
                        <div
                          className="absolute top-full right-0 mt-1 rounded-lg overflow-hidden z-50"
                          style={{
                            background: 'rgba(12,12,14,.98)',
                            border: '1px solid rgba(252,211,77,.2)',
                            boxShadow: '0 8px 24px rgba(0,0,0,.7)',
                            animation: 'slideDown .2s ease',
                          }}
                        >
                          {LANGUAGES.map(l => (
                            <button
                              key={l}
                              className="block w-full text-left px-4 py-2 text-xs transition-colors"
                              style={{
                                fontFamily: 'var(--font-pt-serif), serif',
                                color: l === lang ? '#FCD34D' : 'rgba(200,180,140,.7)',
                                background: l === lang ? 'rgba(252,211,77,.08)' : 'transparent',
                              }}
                              onClick={() => { setLang(l); setLangOpen(false) }}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* カート */}
                    <button className="relative transition-transform duration-200 hover:scale-110" style={{ color: 'rgba(200,180,140,.6)' }}>
                      <span className="text-lg">🛒</span>
                      {cartAmount > 0 && (
                        <span
                          className="absolute -top-1 -right-1 text-xs rounded-full px-1 min-w-4 text-center font-bold leading-4"
                          style={{ background: '#F97316', color: '#111', fontSize: '9px' }}
                        >
                          {cartAmount >= 1000 ? `¥${Math.round(cartAmount/1000)}K` : `¥${cartAmount}`}
                        </span>
                      )}
                    </button>

                    {/* 通知 */}
                    <button className="relative transition-transform duration-200 hover:scale-110" style={{ color: 'rgba(200,180,140,.6)' }}>
                      <span className="text-lg">🔔</span>
                      {notificationCount > 0 && (
                        <span
                          className="absolute -top-1 -right-1 text-xs rounded-full px-1 min-w-4 text-center font-bold leading-4"
                          style={{ background: '#EF4444', color: '#fff', fontSize: '9px' }}
                        >
                          {notificationCount > 99 ? '99+' : notificationCount}
                        </span>
                      )}
                    </button>

                    {/* アバター */}
                    <button className="flex items-center gap-1.5 transition-transform duration-200 hover:scale-105">
                      {user.avatar ? (
                        <Image src={user.avatar} alt={user.name} width={28} height={28} className="rounded-full" style={{ border: '1px solid rgba(252,211,77,.3)' }} />
                      ) : (
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            background: 'linear-gradient(135deg, #FCD34D, #F97316)',
                            color: '#111',
                            border: '1px solid rgba(252,211,77,.4)',
                            fontFamily: 'var(--font-pt-serif), serif',
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </button>
                  </div>

                  {/* EXPバー行 */}
                  <div className="w-full flex items-center gap-2 pr-1">
                    <span className="text-xs font-bold shrink-0" style={{ fontFamily: 'var(--font-pt-serif), serif', color: '#FCD34D' }}>
                      Lv.{user.level}
                    </span>
                    <div
                      className="flex-1 rounded-full overflow-hidden"
                      style={{ height: '3px', background: 'rgba(252,211,77,.1)', border: '1px solid rgba(252,211,77,.1)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${expPct}%`,
                          background: 'linear-gradient(90deg, #FCD34D, #F97316)',
                          boxShadow: '0 0 4px rgba(252,211,77,.5)',
                          transition: 'width .7s ease',
                        }}
                      />
                    </div>
                    <span className="text-xs shrink-0" style={{ color: 'rgba(200,180,140,.4)', fontFamily: 'var(--font-pt-serif), serif' }}>
                      {user.currentExp.toLocaleString()}
                    </span>
                  </div>
                </>
              ) : (
                /* 未ログイン */
                <div className="flex items-center gap-3">
                  {/* 言語 */}
                  <div className="relative" ref={langRef}>
                    <button
                      className="text-xs font-semibold px-2 py-1 rounded transition-all duration-200"
                      style={{
                        fontFamily: 'var(--font-pt-serif), serif',
                        color: 'rgba(252,211,77,.6)',
                        border: '1px solid rgba(252,211,77,.12)',
                        background: 'rgba(252,211,77,.03)',
                      }}
                      onClick={() => setLangOpen(!langOpen)}
                    >
                      {lang}
                    </button>
                    {langOpen && (
                      <div
                        className="absolute top-full right-0 mt-1 rounded-lg overflow-hidden z-50"
                        style={{
                          background: 'rgba(12,12,14,.98)',
                          border: '1px solid rgba(252,211,77,.2)',
                          boxShadow: '0 8px 24px rgba(0,0,0,.7)',
                          animation: 'slideDown .2s ease',
                        }}
                      >
                        {LANGUAGES.map(l => (
                          <button
                            key={l}
                            className="block w-full text-left px-4 py-2 text-xs transition-colors"
                            style={{
                              fontFamily: 'var(--font-pt-serif), serif',
                              color: l === lang ? '#FCD34D' : 'rgba(200,180,140,.7)',
                              background: l === lang ? 'rgba(252,211,77,.08)' : 'transparent',
                            }}
                            onClick={() => { setLang(l); setLangOpen(false) }}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    className="text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                    style={{
                      fontFamily: 'var(--font-pt-serif), serif',
                      color: 'rgba(245,240,232,.7)',
                      border: '1px solid rgba(252,211,77,.15)',
                      background: 'transparent',
                      letterSpacing: '.04em',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(252,211,77,.4)'; e.currentTarget.style.color = '#FCD34D' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(252,211,77,.15)'; e.currentTarget.style.color = 'rgba(245,240,232,.7)' }}
                  >
                    ログイン
                  </button>
                  <button
                    className="text-xs font-bold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    style={{
                      fontFamily: 'var(--font-pt-serif), serif',
                      background: 'linear-gradient(135deg, #FCD34D, #F97316)',
                      color: '#111',
                      letterSpacing: '.04em',
                      boxShadow: '0 2px 12px rgba(249,115,22,.3)',
                    }}
                  >
                    新規登録
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── ボトムゴールドライン（スクロール時に出現） ── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(252,211,77,.25), transparent)',
            opacity: scrolled ? 1 : 0,
          }}
        />
      </header>

      {/* ================================================================
          モバイルメニュー（フルスクリーンドロワー）
          ================================================================ */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto md:hidden"
          style={{
            background: 'rgba(8,8,8,.98)',
            backdropFilter: 'blur(24px)',
            paddingTop: '72px',
            animation: 'slideDown .25s ease',
          }}
        >
          {/* 背景グロー */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(252,211,77,.05) 0%, transparent 70%)' }}
          />

          <div className="relative z-10 flex flex-col h-full px-6 py-8 gap-6">

            {/* ── ユーザー情報 ── */}
            {isAuthenticated && user ? (
              <div
                className="rounded-xl p-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(252,211,77,.06) 0%, rgba(249,115,22,.03) 100%)',
                  border: '1px solid rgba(252,211,77,.15)',
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #FCD34D, #F97316)',
                      color: '#111',
                      fontFamily: 'var(--font-pt-serif), serif',
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: '#F5F0E8', fontFamily: 'var(--font-noto-sans-jp), sans-serif' }}>{user.name}</div>
                    <div className="text-xs" style={{ color: 'rgba(252,211,77,.6)', fontFamily: 'var(--font-pt-serif), serif' }}>Lv.{user.level}</div>
                  </div>
                </div>
                <ExpBar level={user.level} current={user.currentExp} max={user.maxExp} />
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    fontFamily: 'var(--font-pt-serif), serif',
                    color: 'rgba(245,240,232,.7)',
                    border: '1px solid rgba(252,211,77,.2)',
                    letterSpacing: '.04em',
                  }}
                >
                  ログイン
                </button>
                <button
                  className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{
                    fontFamily: 'var(--font-pt-serif), serif',
                    background: 'linear-gradient(135deg, #FCD34D, #F97316)',
                    color: '#111',
                    letterSpacing: '.04em',
                  }}
                >
                  新規登録
                </button>
              </div>
            )}

            {/* ── ナビゲーション ── */}
            <nav className="flex flex-col gap-1">
              <div
                className="text-xs tracking-[.2em] uppercase mb-3 font-semibold"
                style={{ color: 'rgba(252,211,77,.3)', fontFamily: 'var(--font-pt-serif), serif' }}
              >
                Navigation
              </div>
              {NAV_ITEMS.map(n => (
                <a
                  key={n.label}
                  href={n.href}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200"
                  style={{
                    color: 'rgba(245,240,232,.75)',
                    border: '1px solid transparent',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(252,211,77,.06)'
                    e.currentTarget.style.borderColor = 'rgba(252,211,77,.15)'
                    e.currentTarget.style.color = '#FCD34D'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'transparent'
                    e.currentTarget.style.color = 'rgba(245,240,232,.75)'
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="text-lg">{n.icon}</span>
                  <span
                    className="text-sm font-semibold tracking-[.1em] uppercase"
                    style={{ fontFamily: 'var(--font-pt-serif), serif' }}
                  >
                    {n.label}
                  </span>
                </a>
              ))}
            </nav>

            {/* ── 言語・検索 ── */}
            <div className="flex flex-col gap-4">
              {/* 検索 */}
              <div className="relative">
                <input
                  type="search"
                  placeholder="作品・クリエイターを検索..."
                  className="w-full pl-4 pr-10 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: 'rgba(255,255,255,.04)',
                    border: '1px solid rgba(252,211,77,.12)',
                    color: 'rgba(245,240,232,.8)',
                    fontFamily: 'var(--font-noto-sans-jp), sans-serif',
                  }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'rgba(252,211,77,.4)' }}>🔍</span>
              </div>

              {/* 言語 */}
              <div className="flex gap-2">
                {LANGUAGES.map(l => (
                  <button
                    key={l}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      fontFamily: 'var(--font-pt-serif), serif',
                      background: l === lang ? 'linear-gradient(135deg, #FCD34D, #F97316)' : 'rgba(255,255,255,.04)',
                      color: l === lang ? '#111' : 'rgba(200,180,140,.6)',
                      border: l === lang ? 'none' : '1px solid rgba(252,211,77,.1)',
                    }}
                    onClick={() => setLang(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* ── アクション ── */}
            {isAuthenticated && (
              <div className="flex gap-3 mt-auto">
                <button
                  className="flex-1 flex items-center justify-between px-4 py-3.5 rounded-xl text-sm"
                  style={{
                    background: 'rgba(249,115,22,.08)',
                    border: '1px solid rgba(249,115,22,.2)',
                    color: 'rgba(245,240,232,.75)',
                  }}
                >
                  <span>🛒 カート</span>
                  {cartAmount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: '#F97316', color: '#111' }}>
                      ¥{cartAmount.toLocaleString()}
                    </span>
                  )}
                </button>
                <button
                  className="flex-1 flex items-center justify-between px-4 py-3.5 rounded-xl text-sm"
                  style={{
                    background: 'rgba(59,130,246,.08)',
                    border: '1px solid rgba(59,130,246,.2)',
                    color: 'rgba(245,240,232,.75)',
                  }}
                >
                  <span>🔔 通知</span>
                  {notificationCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold animate-pulse" style={{ background: '#EF4444', color: '#fff' }}>
                      {notificationCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Header
