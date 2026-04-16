'use client'

import Image from 'next/image'
import React from 'react'

/* ============================================================
   Eldonia-Nex Footer — 黒×金ファンタジーデザイン
   ============================================================ */

const SITE_LINKS = [
  { label: 'ギャラリー',   href: '/gallery' },
  { label: 'コミュニティ', href: '/community' },
  { label: 'イベント',     href: '/events' },
  { label: 'マーケット',   href: '/marketplace' },
  { label: 'お仕事',       href: '/jobs' },
  { label: 'ライブ配信',   href: '/streaming' },
]

const SUPPORT_LINKS = [
  { label: 'ヘルプセンター', href: '/help' },
  { label: 'よくある質問',   href: '/faq' },
  { label: 'お問い合わせ',   href: '/contact' },
  { label: '利用規約',       href: '/terms' },
  { label: 'プライバシー',   href: '/privacy' },
  { label: 'ガイドライン',   href: '/guidelines' },
]

const SOCIAL = [
  { icon: '𝕏',  label: 'X (Twitter)', href: 'https://twitter.com',   color: '#F5F0E8' },
  { icon: 'in', label: 'Discord',      href: 'https://discord.com',   color: '#5865F2' },
  { icon: '▶',  label: 'YouTube',      href: 'https://youtube.com',   color: '#FF0000' },
  { icon: '📷', label: 'Instagram',    href: 'https://instagram.com', color: '#E1306C' },
]

const PLANS = ['FREE', 'STANDARD', 'PRO', 'BUSINESS']

const Footer: React.FC = () => {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: '#080808', borderTop: '1px solid rgba(252,211,77,.12)' }}
    >
      {/* 上部グラデーション境界 */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(252,211,77,.4), rgba(249,115,22,.3), transparent)' }}
      />

      {/* 背景装飾: 魔法陣リング */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '600px', height: '600px',
          bottom: '-200px', left: '50%',
          transform: 'translateX(-50%)',
          opacity: .025,
        }}
      >
        {[260, 200, 140, 80].map((r, i) => (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: `${r * 2}px`, height: `${r * 2}px`,
              top: '50%', left: '50%',
              transform: `translate(-50%, -50%)`,
              borderColor: '#FCD34D',
              animation: `runeRotate ${25 + i * 7}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
            }}
          />
        ))}
      </div>

      {/* グリッドパターン */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* ── メインコンテンツ ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">

        {/* ── 第1段: ブランド + ニュースレター ── */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 mb-14">
          {/* ブランド */}
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 relative shrink-0"
                style={{ filter: 'drop-shadow(0 0 12px rgba(252,211,77,.5))' }}
              >
                <Image
                  src="/assets/logo/eldonia-nex-logo.png"
                  alt="Eldonia-Nex"
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <span
                className="text-3xl font-bold"
                style={{
                  fontFamily: 'var(--font-pt-serif), serif',
                  background: 'linear-gradient(180deg, #FCD34D 0%, #F97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 6px rgba(252,211,77,.3))',
                }}
              >
                Eldonia-Nex
              </span>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: 'rgba(200,190,175,.55)',
                fontFamily: 'var(--font-noto-sans-jp), sans-serif',
              }}
            >
              すべてのクリエイターが自由に表現し、<br />
              正当な評価と収益を得られる世界の実現
            </p>
            {/* SNS */}
            <div className="flex items-center gap-3 mt-1">
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300 hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,.04)',
                    border: '1px solid rgba(252,211,77,.1)',
                    color: 'rgba(200,180,140,.6)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(252,211,77,.3)'
                    e.currentTarget.style.color = s.color
                    e.currentTarget.style.boxShadow = `0 4px 12px ${s.color}30`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(252,211,77,.1)'
                    e.currentTarget.style.color = 'rgba(200,180,140,.6)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ニュースレター */}
          <div
            className="rounded-2xl p-6 w-full lg:max-w-md"
            style={{
              background: 'linear-gradient(135deg, rgba(252,211,77,.05) 0%, rgba(249,115,22,.03) 100%)',
              border: '1px solid rgba(252,211,77,.15)',
            }}
          >
            <div
              className="text-sm font-semibold tracking-[.12em] uppercase mb-1"
              style={{ fontFamily: 'var(--font-pt-serif), serif', color: 'rgba(252,211,77,.7)' }}
            >
              Newsletter
            </div>
            <p
              className="text-xs mb-4"
              style={{ color: 'rgba(200,180,140,.5)', fontFamily: 'var(--font-noto-sans-jp), sans-serif' }}
            >
              最新のクリエイター情報・イベントをお届けします
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,.05)',
                  border: '1px solid rgba(252,211,77,.12)',
                  color: 'rgba(245,240,232,.8)',
                  fontFamily: 'var(--font-pt-serif), serif',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(252,211,77,.35)' }}
                onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(252,211,77,.12)' }}
              />
              <button
                className="px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #FCD34D, #F97316)',
                  color: '#111',
                  fontFamily: 'var(--font-pt-serif), serif',
                  letterSpacing: '.04em',
                  boxShadow: '0 2px 10px rgba(249,115,22,.3)',
                }}
              >
                登録
              </button>
            </div>
          </div>
        </div>

        {/* ── 区切り線 ── */}
        <div
          className="mb-12"
          style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(252,211,77,.15), transparent)' }}
        />

        {/* ── 第2段: リンク3カラム ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

          {/* サイトマップ */}
          <div>
            <h5
              className="text-xs font-bold tracking-[.2em] uppercase mb-4"
              style={{
                fontFamily: 'var(--font-pt-serif), serif',
                background: 'linear-gradient(180deg, #FCD34D, #F97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Platform
            </h5>
            <ul className="space-y-2.5">
              {SITE_LINKS.map(l => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm transition-all duration-200"
                    style={{ color: 'rgba(200,180,140,.5)', fontFamily: 'var(--font-noto-sans-jp), sans-serif' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#FCD34D'; e.currentTarget.style.paddingLeft = '4px' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(200,180,140,.5)'; e.currentTarget.style.paddingLeft = '0' }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* サポート */}
          <div>
            <h5
              className="text-xs font-bold tracking-[.2em] uppercase mb-4"
              style={{
                fontFamily: 'var(--font-pt-serif), serif',
                background: 'linear-gradient(180deg, #FCD34D, #F97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Support
            </h5>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map(l => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm transition-all duration-200"
                    style={{ color: 'rgba(200,180,140,.5)', fontFamily: 'var(--font-noto-sans-jp), sans-serif' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#FCD34D'; e.currentTarget.style.paddingLeft = '4px' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(200,180,140,.5)'; e.currentTarget.style.paddingLeft = '0' }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* プラン */}
          <div>
            <h5
              className="text-xs font-bold tracking-[.2em] uppercase mb-4"
              style={{
                fontFamily: 'var(--font-pt-serif), serif',
                background: 'linear-gradient(180deg, #FCD34D, #F97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Plans
            </h5>
            <ul className="space-y-2.5">
              {PLANS.map(p => (
                <li key={p}>
                  <a
                    href="/pricing"
                    className="text-sm font-semibold transition-all duration-200 flex items-center gap-2"
                    style={{ color: 'rgba(200,180,140,.5)', fontFamily: 'var(--font-pt-serif), serif' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#FCD34D' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(200,180,140,.5)' }}
                  >
                    <span style={{ color: 'rgba(252,211,77,.3)' }}>✦</span> {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 技術スタック */}
          <div>
            <h5
              className="text-xs font-bold tracking-[.2em] uppercase mb-4"
              style={{
                fontFamily: 'var(--font-pt-serif), serif',
                background: 'linear-gradient(180deg, #FCD34D, #F97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Tech Stack
            </h5>
            <ul className="space-y-2">
              {[
                ['⚛', 'React 19 / Next.js 16'],
                ['🐍', 'Django 5.1'],
                ['🐘', 'PostgreSQL 17'],
                ['🐳', 'Docker'],
              ].map(([icon, name]) => (
                <li key={name} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(200,180,140,.4)', fontFamily: 'var(--font-pt-serif), serif' }}>
                  <span>{icon}</span>{name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── 区切り線 ── */}
        <div
          className="mb-8"
          style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(252,211,77,.1), transparent)' }}
        />

        {/* ── 第3段: コピーライト ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-xs"
            style={{
              color: 'rgba(200,180,140,.3)',
              fontFamily: 'var(--font-pt-serif), serif',
              letterSpacing: '.04em',
            }}
          >
            © 2025 Eldonia-Nex. All rights reserved.
          </p>
          <p
            className="text-xs flex items-center gap-1.5"
            style={{ color: 'rgba(200,180,140,.25)', fontFamily: 'var(--font-pt-serif), serif' }}
          >
            Made with
            <span style={{ color: 'rgba(252,211,77,.4)', animation: 'glowPulse 3s ease-in-out infinite' }}>✦</span>
            by Creative Technology Team
          </p>
          {/* ルーンテキスト装飾 */}
          <p
            className="text-xs tracking-[.3em]"
            style={{ color: 'rgba(252,211,77,.12)', fontFamily: 'var(--font-pt-serif), serif' }}
          >
            ᛖᛚᛞᚩᚾᛁᚪ ᚾᛖᚷ
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
