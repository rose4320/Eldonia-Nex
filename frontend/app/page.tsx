'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

/* ============================================================
   Eldonia-Nex — トップページ
   コンセプト: 黒×金の魔法陣ファンタジー × クリエイターズ聖地
   ============================================================ */

/* ── カウントアップ Hook ── */
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    const startTime = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(ease * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration, start])
  return count
}

/* ── IntersectionObserver Hook ── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

/* ── パーティクル（固定seed → SSR/CSR hydration一致） ── */
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x:  ((i * 37 + 11) % 97),
  y:  ((i * 53 + 17) % 97),
  size: (i % 3) * 0.5 + 0.8,
  delay: (i % 5) * 0.8,
  dur:   (i % 4) * 0.7 + 2.2,
}))

/* ── 機能カードデータ ── */
const FEATURES = [
  {
    icon: '🎨',
    title: 'GALLERY',
    subtitle: '作品ギャラリー',
    desc: '絵画・イラスト・写真・3Dなど、あらゆる表現が輝く展示空間',
    href: '/gallery',
    color: 'from-amber-500/20 to-orange-600/10',
    border: 'rgba(251,191,36,.35)',
    glow: 'rgba(251,191,36,.15)',
  },
  {
    icon: '📺',
    title: 'LIVE',
    subtitle: 'ライブ配信',
    desc: 'リアルタイムで制作過程を披露。投げ銭・有料配信に対応',
    href: '/streaming',
    color: 'from-red-500/20 to-pink-600/10',
    border: 'rgba(239,68,68,.35)',
    glow: 'rgba(239,68,68,.15)',
  },
  {
    icon: '🛍️',
    title: 'MARKET',
    subtitle: 'マーケットプレイス',
    desc: 'デジタル作品から物理商品まで。安心・安全な決済システム',
    href: '/marketplace',
    color: 'from-emerald-500/20 to-teal-600/10',
    border: 'rgba(16,185,129,.35)',
    glow: 'rgba(16,185,129,.15)',
  },
  {
    icon: '🤝',
    title: 'COLLAB',
    subtitle: 'コラボレーション',
    desc: 'クリエイター同士が繋がりプロジェクトを共同制作',
    href: '/community',
    color: 'from-violet-500/20 to-purple-600/10',
    border: 'rgba(139,92,246,.35)',
    glow: 'rgba(139,92,246,.15)',
  },
  {
    icon: '📅',
    title: 'EVENTS',
    subtitle: 'イベント管理',
    desc: 'オンライン・オフラインのクリエイターイベントを開催・参加',
    href: '/events',
    color: 'from-blue-500/20 to-cyan-600/10',
    border: 'rgba(59,130,246,.35)',
    glow: 'rgba(59,130,246,.15)',
  },
  {
    icon: '🎮',
    title: 'GAME',
    subtitle: 'ゲーミフィケーション',
    desc: 'EXP獲得・レベルアップ・実績バッジで創作が楽しくなる',
    href: '/profile',
    color: 'from-yellow-500/20 to-amber-600/10',
    border: 'rgba(234,179,8,.35)',
    glow: 'rgba(234,179,8,.15)',
  },
]

/* ── 統計データ ── */
const STATS = [
  { label: 'クリエイター', value: 48200,  suffix: '+', unit: '人' },
  { label: '作品数',       value: 320000, suffix: '+', unit: '点' },
  { label: '累計売上',     value: 12,     suffix: '億', unit: '円+' },
  { label: '月間訪問者',   value: 2400000, suffix: '+', unit: '' },
]

/* ── サブスクリプション ── */
const PLANS = [
  {
    name: 'FREE',
    price: '¥0',
    period: '/月',
    features: ['月3作品まで投稿', '手数料 15%', 'ギャラリー閲覧'],
    cta: 'はじめる',
    highlight: false,
  },
  {
    name: 'PRO',
    price: '¥1,500',
    period: '/月',
    features: ['無制限投稿', '手数料 8%', 'Live配信（200人）', '優先サポート'],
    cta: 'PRO を試す',
    highlight: true,
    badge: '人気',
  },
  {
    name: 'BUSINESS',
    price: '¥10,000',
    period: '/月',
    features: ['無制限投稿', '手数料 5%', 'Live配信（1,000人）', '専任サポート', 'API連携'],
    cta: 'お問い合わせ',
    highlight: false,
  },
]

/* ── ナビゲーションメニュー文字（ルーン風） ── */
const RUNE_TEXT = 'ᛖᛚᛞᚩᚾᛁᚪ ᚾᛖᚷ'

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [heroVisible, setHeroVisible] = useState(false)
  const statsSection = useInView()
  const featuresSection = useInView()
  const plansSection = useInView()

  const stat0 = useCountUp(STATS[0].value, 2200, statsSection.inView)
  const stat1 = useCountUp(STATS[1].value, 2200, statsSection.inView)
  const stat2 = useCountUp(STATS[2].value, 1800, statsSection.inView)
  const stat3 = useCountUp(STATS[3].value, 2500, statsSection.inView)
  const statValues = [stat0, stat1, stat2, stat3]

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    setTimeout(() => setHeroVisible(true), 100)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const parallax = scrollY * 0.35

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#080808' }}>

      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* 背景レイヤー1: 星フィールド */}
        <div
          className="absolute inset-0 star-field"
          style={{ transform: `translateY(${parallax * .4}px)` }}
        />

        {/* 背景レイヤー2: グリッドパターン */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />

        {/* 背景レイヤー3: ラジアルグロー */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 55% at 50% 30%, rgba(252,211,77,.09) 0%, rgba(249,115,22,.04) 40%, transparent 70%)',
            transform: `translateY(${parallax * .2}px)`,
          }}
        />

        {/* 背景レイヤー4: アンビエントオーブ */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            top: '-10%', left: '-10%',
            background: 'radial-gradient(circle, rgba(139,92,246,.06) 0%, transparent 70%)',
            animation: 'orbFloat 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            bottom: '-5%', right: '-8%',
            background: 'radial-gradient(circle, rgba(249,115,22,.07) 0%, transparent 70%)',
            animation: 'orbFloat 24s ease-in-out infinite reverse',
          }}
        />

        {/* SVGパーティクル */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          {PARTICLES.map(p => (
            <circle
              key={p.id}
              cx={`${p.x}%`} cy={`${p.y}%`}
              r={p.size}
              fill="rgba(252,211,77,.5)"
              style={{
                animation: `sparkle ${p.dur}s ${p.delay}s ease-in-out infinite`,
              }}
            />
          ))}
        </svg>

        {/* メインコンテンツ */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">

          {/* ロゴ + 魔法陣リング */}
          <div
            className="relative mb-10"
            suppressHydrationWarning
            style={{
              opacity:   heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0) scale(1)' : 'translateY(-30px) scale(.8)',
              transition: 'all 1s cubic-bezier(.34,1.56,.64,1)',
            }}
          >
            {/* 外側の回転リング */}
            <div
              className="absolute rounded-full border pointer-events-none"
              style={{
                inset: '-24px',
                borderColor: 'rgba(252,211,77,.2)',
                animation: 'runeRotate 30s linear infinite',
                background: 'conic-gradient(from 0deg, transparent 0%, rgba(252,211,77,.05) 50%, transparent 100%)',
              }}
            />
            {/* 内側の逆回転リング */}
            <div
              className="absolute rounded-full border pointer-events-none"
              style={{
                inset: '-10px',
                borderColor: 'rgba(249,115,22,.15)',
                borderStyle: 'dashed',
                animation: 'runeRotate 20s linear infinite reverse',
              }}
            />
            {/* ロゴ本体 */}
            <div
              className="w-32 h-32 relative"
              style={{ filter: 'drop-shadow(0 0 24px rgba(252,211,77,.5)) drop-shadow(0 0 60px rgba(249,115,22,.3))' }}
            >
              <Image
                src="/assets/logo/eldonia-nex-logo.png"
                alt="Eldonia-Nex ロゴ"
                fill
                sizes="128px"
                className="object-contain"
                loading="eager"
                priority
              />
            </div>
            {/* 四方のスパークル */}
            {[0, 90, 180, 270].map(deg => (
              <div
                key={deg}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  top: '50%', left: '50%',
                  transform: `rotate(${deg}deg) translateX(80px) translateY(-50%)`,
                  background: 'radial-gradient(circle, #FCD34D, #F97316)',
                  boxShadow: '0 0 6px #FCD34D',
                  animation: `sparkle 2s ${deg / 90 * .5}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>

          {/* ルーンテキスト */}
          <div
            className="text-sm tracking-[.4em] mb-3 font-light"
            style={{
              color: 'rgba(252,211,77,.4)',
              fontFamily: 'var(--font-pt-serif), serif',
              opacity:   heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all .8s ease .3s',
            }}
          >
            {RUNE_TEXT}
          </div>

          {/* メインタイトル */}
          <h1
            className="font-bold mb-4 leading-none"
            style={{
              fontFamily: 'var(--font-pt-serif), serif',
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
              background: 'linear-gradient(180deg, #FEF9E7 0%, #FCD34D 35%, #F97316 70%, #B45309 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 12px rgba(252,211,77,.4))',
              opacity:   heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'all .9s ease .4s',
            }}
          >
            Eldonia-Nex
          </h1>

          {/* サブタイトル */}
          <p
            className="text-lg md:text-xl mb-3 tracking-widest uppercase"
            style={{
              fontFamily: 'var(--font-pt-serif), serif',
              color: 'rgba(252,211,77,.6)',
              letterSpacing: '.25em',
              opacity:   heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all .9s ease .5s',
            }}
          >
            Creative Realm for All Artists
          </p>

          {/* キャッチコピー */}
          <p
            className="text-base md:text-lg max-w-2xl leading-relaxed mb-10"
            style={{
              color: 'rgba(200,190,175,.75)',
              fontFamily: 'var(--font-noto-sans-jp), sans-serif',
              opacity:   heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all .9s ease .65s',
            }}
          >
            すべてのクリエイターが自由に表現し、<br className="hidden md:block" />
            正当な評価と収益を得られる世界へ
          </p>

          {/* CTAボタン群 */}
          <div
            className="flex flex-col sm:flex-row gap-4 items-center"
            style={{
              opacity:   heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all .9s ease .8s',
            }}
          >
            <Link href="/gallery">
              <button className="btn-gold text-base px-8 py-3.5 rounded-lg">
                <span>✦</span> ギャラリーへ
              </button>
            </Link>
            <Link href="/gallery">
              <button className="btn-outline-gold text-base px-8 py-3.5 rounded-lg">
                作品を投稿する
              </button>
            </Link>
          </div>

          {/* スクロールインジケーター */}
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{
              opacity:   heroVisible ? .6 : 0,
              transition: 'opacity 1s ease 1.5s',
            }}
          >
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: 'rgba(252,211,77,.5)', fontFamily: 'var(--font-pt-serif), serif' }}
            >
              Scroll
            </span>
            <div
              className="w-px h-12"
              style={{
                background: 'linear-gradient(180deg, rgba(252,211,77,.5), transparent)',
                animation: 'floatY 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </section>

      {/* ================================================================
          STATS SECTION
          ================================================================ */}
      <section className="py-24 relative overflow-hidden">
        {/* 区切り線 */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(252,211,77,.3), transparent)' }} />

        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(252,211,77,.04) 0%, transparent 50%, rgba(249,115,22,.03) 100%)' }}
        />

        <div ref={statsSection.ref} className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <div
                key={i}
                className="text-center"
                style={{
                  opacity:   statsSection.inView ? 1 : 0,
                  transform: statsSection.inView ? 'translateY(0)' : 'translateY(24px)',
                  transition: `all .7s ease ${i * .12}s`,
                }}
              >
                {/* 上の装飾線 */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-px" style={{ background: 'var(--brand-gradient-h)' }} />
                </div>
                <div
                  className="text-4xl md:text-5xl font-bold mb-1"
                  style={{
                    fontFamily: 'var(--font-pt-serif), serif',
                    background: 'var(--brand-gradient-shine)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 8px rgba(252,211,77,.3))',
                  }}
                >
                  {statValues[i].toLocaleString()}{s.suffix}
                  <span className="text-2xl">{s.unit}</span>
                </div>
                <div className="text-sm tracking-widest uppercase" style={{ color: 'rgba(200,180,140,.6)', fontFamily: 'var(--font-pt-serif), serif' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(252,211,77,.2), transparent)' }} />
      </section>

      {/* ================================================================
          FEATURES SECTION
          ================================================================ */}
      <section className="py-28 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        <div ref={featuresSection.ref} className="relative z-10 max-w-7xl mx-auto px-6">

          {/* セクションタイトル */}
          <div
            className="text-center mb-16"
            style={{
              opacity:   featuresSection.inView ? 1 : 0,
              transform: featuresSection.inView ? 'translateY(0)' : 'translateY(28px)',
              transition: 'all .7s ease',
            }}
          >
            <div className="badge-gold mx-auto mb-4 w-fit">✦ FEATURES</div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{
                fontFamily: 'var(--font-pt-serif), serif',
                background: 'linear-gradient(180deg, #F5F0E8 0%, #FCD34D 60%, #F97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              すべての創造をひとつの場所で
            </h2>
            <p style={{ color: 'rgba(200,190,175,.6)', fontFamily: 'var(--font-noto-sans-jp), sans-serif' }}>
              クリエイターの夢を実現する6つの核心機能
            </p>
          </div>

          {/* 機能グリッド */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <Link key={f.title} href={f.href}>
                <div
                  className="group relative rounded-xl overflow-hidden cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${f.color})`,
                    border: `1px solid ${f.border}`,
                    boxShadow: `0 4px 24px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.04)`,
                    opacity:   featuresSection.inView ? 1 : 0,
                    transform: featuresSection.inView ? 'translateY(0) scale(1)' : 'translateY(32px) scale(.96)',
                    transition: `all .6s ease ${i * .08}s`,
                  }}
                >
                  {/* ホバーグロー */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${f.glow}, transparent)` }}
                  />
                  {/* 上部ライン */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${f.border}, transparent)` }}
                  />

                  <div className="relative z-10 p-7">
                    {/* アイコン */}
                    <div
                      className="text-4xl mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1 inline-block"
                      style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.5))' }}
                    >
                      {f.icon}
                    </div>

                    {/* タイトル */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <h3
                        className="text-lg font-bold tracking-widest"
                        style={{
                          fontFamily: 'var(--font-pt-serif), serif',
                          background: 'var(--brand-gradient)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {f.title}
                      </h3>
                      <span className="text-sm" style={{ color: 'rgba(245,240,232,.5)' }}>{f.subtitle}</span>
                    </div>

                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(200,190,175,.65)' }}>
                      {f.desc}
                    </p>

                    {/* 矢印 */}
                    <div
                      className="mt-5 flex items-center gap-1 text-xs font-semibold tracking-wider"
                      style={{ color: 'rgba(252,211,77,.5)', fontFamily: 'var(--font-pt-serif), serif', transition: 'all .3s ease' }}
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">EXPLORE →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          MAGIC CIRCLE SHOWCASE (装飾的な中間セクション)
          ================================================================ */}
      <section className="py-32 relative overflow-hidden flex flex-col items-center">
        {/* 大きな背景魔法陣 */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: '900px', height: '900px',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: .04,
          }}
        >
          {[400, 340, 260, 180].map((r, i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: `${r * 2}px`, height: `${r * 2}px`,
                top: '50%', left: '50%',
                transform: `translate(-50%, -50%)`,
                borderColor: '#FCD34D',
                animation: `runeRotate ${20 + i * 8}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <div
            className="text-6xl mb-8 inline-block"
            style={{ animation: 'floatY 5s ease-in-out infinite, glowPulse 3s ease-in-out infinite' }}
          >
            ✦
          </div>
          <h2
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{
              fontFamily: 'var(--font-pt-serif), serif',
              background: 'linear-gradient(180deg, #F5F0E8 0%, #FCD34D 50%, #F97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 16px rgba(252,211,77,.3))',
            }}
          >
            あなたの才能が<br />世界を照らす
          </h2>
          <p
            className="text-lg md:text-xl leading-relaxed mb-10"
            style={{
              color: 'rgba(200,190,175,.65)',
              fontFamily: 'var(--font-noto-sans-jp), sans-serif',
            }}
          >
            EXPを積み重ね、レベルを上げ、伝説のクリエイターへ<br className="hidden md:block" />
            Eldonia-Nexがあなたの旅に同行します
          </p>

          {/* ゲーミフィケーションデモ */}
          <div
            className="max-w-md mx-auto rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(252,211,77,.06) 0%, rgba(249,115,22,.03) 100%)',
              border: '1px solid rgba(252,211,77,.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.04)',
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #FCD34D, #F97316)',
                  color: '#111',
                  fontFamily: 'var(--font-pt-serif), serif',
                  boxShadow: '0 4px 16px rgba(249,115,22,.4)',
                }}
              >
                25
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold mb-0.5" style={{ color: '#F5F0E8' }}>テストクリエイター</div>
                <div className="text-xs mb-2" style={{ color: 'rgba(252,211,77,.6)' }}>⚔️ 伝説のイラストレーター</div>
                <div className="exp-bar">
                  <div
                    className="exp-bar-fill"
                    style={{ width: '72%', transition: 'width 1.5s ease .5s' }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs" style={{ color: 'rgba(200,180,140,.5)' }}>12,500 EXP</span>
                  <span className="text-xs" style={{ color: 'rgba(200,180,140,.5)' }}>Lv.26まで 2,500</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['🎨 作品投稿 +100EXP', '❤️ いいね +10EXP', '💰 販売成約 +500EXP'].map(t => (
                <div
                  key={t}
                  className="text-center py-2 px-1 rounded-lg text-xs"
                  style={{
                    background: 'rgba(252,211,77,.06)',
                    border: '1px solid rgba(252,211,77,.12)',
                    color: 'rgba(252,211,77,.7)',
                    fontFamily: 'var(--font-noto-sans-jp), sans-serif',
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SUBSCRIPTION PLANS
          ================================================================ */}
      <section className="py-28 relative">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(252,211,77,.02) 50%, transparent 100%)' }} />

        <div ref={plansSection.ref} className="relative z-10 max-w-5xl mx-auto px-6">

          <div
            className="text-center mb-14"
            style={{
              opacity:   plansSection.inView ? 1 : 0,
              transform: plansSection.inView ? 'translateY(0)' : 'translateY(24px)',
              transition: 'all .7s ease',
            }}
          >
            <div className="badge-gold mx-auto mb-4 w-fit">✦ PLANS</div>
            <h2
              className="text-4xl font-bold mb-3"
              style={{
                fontFamily: 'var(--font-pt-serif), serif',
                background: 'linear-gradient(180deg, #F5F0E8 0%, #FCD34D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              あなたに合ったプランを選ぶ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((p, i) => (
              <div
                key={p.name}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: p.highlight
                    ? 'linear-gradient(160deg, rgba(252,211,77,.1) 0%, rgba(249,115,22,.06) 100%)'
                    : 'rgba(22,22,28,1)',
                  border: p.highlight ? '1px solid rgba(252,211,77,.4)' : '1px solid rgba(252,211,77,.1)',
                  boxShadow: p.highlight ? '0 8px 48px rgba(249,115,22,.2), inset 0 1px 0 rgba(252,211,77,.15)' : '0 4px 20px rgba(0,0,0,.5)',
                  opacity:   plansSection.inView ? 1 : 0,
                  transform: plansSection.inView ? 'translateY(0) scale(1)' : 'translateY(32px) scale(.97)',
                  transition: `all .6s ease ${i * .1}s`,
                }}
              >
                {p.highlight && (
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, #FCD34D, #F97316, transparent)' }}
                  />
                )}
                {p.badge && (
                  <div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: 'var(--brand-gradient)',
                      color: '#111',
                      fontFamily: 'var(--font-pt-serif), serif',
                    }}
                  >
                    {p.badge}
                  </div>
                )}
                <div className="p-8">
                  <div
                    className="text-sm tracking-[.2em] uppercase mb-3 font-semibold"
                    style={{
                      fontFamily: 'var(--font-pt-serif), serif',
                      color: p.highlight ? '#FCD34D' : 'rgba(200,180,140,.5)',
                    }}
                  >
                    {p.name}
                  </div>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span
                      className="text-4xl font-bold"
                      style={{
                        fontFamily: 'var(--font-pt-serif), serif',
                        background: p.highlight ? 'var(--brand-gradient-shine)' : 'linear-gradient(180deg, #F5F0E8, #C9C0B0)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {p.price}
                    </span>
                    <span className="text-sm" style={{ color: 'rgba(200,180,140,.4)' }}>{p.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {p.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(200,190,175,.75)' }}>
                        <span style={{ color: p.highlight ? '#FCD34D' : 'rgba(252,211,77,.4)' }}>✦</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300"
                    style={p.highlight ? {
                      background: 'var(--brand-gradient)',
                      color: '#111',
                      fontFamily: 'var(--font-pt-serif), serif',
                      letterSpacing: '.05em',
                      boxShadow: '0 4px 16px rgba(249,115,22,.3)',
                    } : {
                      background: 'transparent',
                      color: 'rgba(252,211,77,.6)',
                      border: '1px solid rgba(252,211,77,.2)',
                      fontFamily: 'var(--font-pt-serif), serif',
                      letterSpacing: '.05em',
                    }}
                  >
                    {p.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FINAL CTA
          ================================================================ */}
      <section className="py-32 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(252,211,77,.07) 0%, transparent 70%)' }}
        />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(252,211,77,.3), transparent)' }} />

        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <div
            className="inline-block mb-8"
            style={{ animation: 'floatY 4s ease-in-out infinite' }}
          >
            <Image
              src="/assets/logo/eldonia-nex-logo.png"
              alt="Eldonia-Nex"
              width={80}
              height={80}
              style={{ filter: 'drop-shadow(0 0 20px rgba(252,211,77,.5))' }}
            />
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold mb-5"
            style={{
              fontFamily: 'var(--font-pt-serif), serif',
              background: 'linear-gradient(180deg, #F5F0E8 0%, #FCD34D 60%, #F97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 16px rgba(252,211,77,.3))',
            }}
          >
            今すぐ旅をはじめよう
          </h2>
          <p
            className="text-base md:text-lg mb-10 leading-relaxed"
            style={{
              color: 'rgba(200,190,175,.6)',
              fontFamily: 'var(--font-noto-sans-jp), sans-serif',
            }}
          >
            無料で登録して、あなたの才能を世界に届けてください
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-gold text-base px-10 py-4 rounded-lg">
              ✦ 無料で始める
            </button>
            <Link href="/gallery">
              <button className="btn-ghost text-base px-10 py-4 rounded-lg">
                作品を見る
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
