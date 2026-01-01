'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import PageHero from '../../../components/common/PageHero'

// GALLERYページ - UI/UX設計書完全準拠版
interface Artwork {
  id: string
  title: string
  author: string
  authorLevel: number
  category: string
  price: number
  isFree: boolean
  likes: number
  views: number
  imageUrl: string
  fileUrl?: string
  tags: string[]
  description: string
  fileFormat?: string
  fileSize?: string
  license?: string
  rating?: number
  reviewCount?: number
}

interface FilterState {
  search: string
  category: string
  sortBy: string
}

const Gallery: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname() || '/ja/gallery'
  const currentLocale = pathname.split('/')[1] || 'ja'
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'すべて',
    sortBy: '人気順'
  })
  const [loading, setLoading] = useState(true)
  const [redirectTo, setRedirectTo] = useState<string | null>(null)

  // APIベースURLを動的に決定
  const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000/api/v1'
      }
      return `http://${hostname}:8000/api/v1`
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
  }

  // 画像/メディアURLを絶対URLへ補正
  const getFullMediaUrl = (url?: string) => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      const backendHost =
        hostname === 'localhost' || hostname === '127.0.0.1'
          ? 'http://localhost:8000'
          : `http://${hostname}:8000`
      return `${backendHost}${url.startsWith('/') ? url : `/${url}`}`
    }
    return url
  }

  const isImageUrl = (url?: string) => {
    if (!url) return false
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url.split('?')[0])
  }

  const isVideoUrl = (url?: string) => {
    if (!url) return false
    return /\.(mp4|mov|avi|mkv|webm|flv)$/i.test(url.split('?')[0])
  }

  const isAudioUrl = (url?: string) => {
    if (!url) return false
    return /\.(mp3|wav|ogg|flac|aac|m4a)$/i.test(url.split('?')[0])
  }

  const slugify = (text: string) =>
    text
      .toString()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase()

  // 作品一覧を取得
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const API_BASE_URL = getApiBaseUrl()
        const res = await fetch(`${API_BASE_URL}/artworks/list/`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        // 重複（同じfileUrl/imageUrl）を排除しつつ整形
        const seen = new Set<string>()
        const apiArtworks: Artwork[] = []
          ; (data.artworks || []).forEach((a: any) => {
            const id = String(a.id)
            const rawImage = a.image_url || a.thumbnail_url
            const rawFile = a.file_url
            const key = (rawFile || rawImage || id || '').toString()
            if (seen.has(key)) return
            seen.add(key)

            apiArtworks.push({
              id,
              title: a.title || 'Untitled',
              author: a.creator?.display_name || a.creator?.username || 'Unknown',
              authorLevel: 1,
              category: a.category || 'その他',
              price: Number(a.price || 0),
              isFree: !!a.is_free || Number(a.price || 0) === 0,
              likes: a.likes_count || 0,
              views: a.views || 0,
              imageUrl: (() => {
                if (rawImage && isImageUrl(rawImage)) return getFullMediaUrl(rawImage)
                if (rawFile && isImageUrl(rawFile)) return getFullMediaUrl(rawFile)
                return '' // フォールバックはレンダリング時に処理
              })(),
              fileUrl: getFullMediaUrl(rawFile),
              tags: a.tags || [],
              description: a.description || '',
              fileFormat: '',
              fileSize: '',
              license: '',
              rating: 0,
              reviewCount: 0,
            })
          })
        setArtworks(apiArtworks)
      } catch (error) {
        // フォールバック：既存モック（何も取得できない場合のみ）
        setArtworks([])
      } finally {
        setLoading(false)
      }
    }
    fetchArtworks()
  }, [])

  // フィルタリング・ソート処理（useMemoで最適化）
  const filteredArtworks = useMemo(() => {
    const filtered = artworks.filter(artwork => {
      const matchesSearch = artwork.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        artwork.author.toLowerCase().includes(filters.search.toLowerCase()) ||
        artwork.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))

      const matchesCategory = filters.category === 'すべて' || artwork.category === filters.category

      return matchesSearch && matchesCategory
    })

    // ソート処理
    switch (filters.sortBy) {
      case '人気順':
        return filtered.sort((a, b) => b.likes - a.likes)
      case '新着順':
        return filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id))
      case '評価順':
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      default:
        return filtered
    }
  }, [artworks, filters])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const formatPrice = (price: number, isFree: boolean) => {
    if (isFree || price === 0) return '無料'
    return `¥${price.toLocaleString()}`
  }

  const getArtworkRoute = (category: string, id: string) => {
    const slug = slugify(category || 'other')
    return `/${currentLocale}/gallery/category/${slug}/${id}`
  }

  const handleArtworkClick = (artwork: typeof artworks[0]) => {
    const route = getArtworkRoute(artwork.category, artwork.id)
    router.push(route)
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation() // カードクリックイベントを防ぐ
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">ギャラリーを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-8 max-w-7xl">

        {/* ヒーローセクション - PageHeroコンポーネント使用 */}
        <PageHero
          title="GALLERY"
          subtitle="Realm of Creative Wonders"
          backgroundOpacity={5}
        />

        {/* UI/UX設計書準拠：フィルター・検索バー */}
        <div className="border border-gray-600/30 rounded-xl p-6 mb-8 bg-gray-800/60 backdrop-blur-md shadow-2xl">
          {/* 第一行：検索ボックス + フィルター + ソート */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="検索ボックス"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-2 border border-gray-600/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent bg-gray-700/50 backdrop-blur-sm text-gray-100 placeholder-gray-400 transition-all duration-300"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors">
                🔍
              </button>
            </div>

            <button className="px-4 py-2 border border-gray-600/40 rounded-lg text-gray-300 hover:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-500/50">
              フィルター
            </button>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-4 py-2 border border-gray-600/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-gray-700/50 backdrop-blur-sm text-gray-100 transition-all duration-300"
            >
              <option value="人気順">ソート: 人気順▼</option>
              <option value="新着順">ソート: 新着順▼</option>
              <option value="評価順">ソート: 評価順▼</option>
              <option value="価格の安い順">ソート: 価格の安い順▼</option>
              <option value="価格の高い順">ソート: 価格の高い順▼</option>
            </select>
          </div>

          {/* 第二行：カテゴリフィルタ */}
          <div className="mb-4">
            <div className="text-gray-300">
              <span className="mr-4">カテゴリ:</span>
              <div className="inline-flex flex-wrap gap-1">
                {['すべて', 'イラスト', '写真', '動画', '3D', '音楽', '創作物', 'その他'].map((category, index) => (
                  <React.Fragment key={category}>
                    <button
                      onClick={() => handleFilterChange('category', category)}
                      className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 backdrop-blur-sm ${filters.category === category
                        ? 'bg-indigo-500/80 text-white shadow-lg shadow-indigo-500/25'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        }`}
                    >
                      {category}
                    </button>
                    {index < 7 && <span className="text-gray-500/70">・</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* 第三行：価格フィルタ（基本無料のため非表示） */}

          {/* 第四行：タグ例示 */}
          <div className="text-gray-300">
            <span className="mr-4">タグ:</span>
            <div className="inline-flex flex-wrap gap-2 text-sm text-indigo-400/90">
              <span className="px-2 py-1 bg-indigo-900/30 rounded-full backdrop-blur-sm">#デジタルアート</span>
              <span className="px-2 py-1 bg-indigo-900/30 rounded-full backdrop-blur-sm">#風景</span>
              <span className="px-2 py-1 bg-indigo-900/30 rounded-full backdrop-blur-sm">#ポートレート</span>
              <span className="px-2 py-1 bg-indigo-900/30 rounded-full backdrop-blur-sm">#アニメ</span>
            </div>
          </div>
        </div>

        {/* UI/UX設計書準拠：作品グリッド */}
        <div className="border border-gray-600/30 rounded-xl p-6 bg-gray-800/40 backdrop-blur-md">
          {/* 作品グリッド（5列レイアウト） */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6">
            {filteredArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="group border border-gray-600/20 rounded-xl overflow-hidden bg-gray-800/60 backdrop-blur-sm hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                onClick={() => handleArtworkClick(artwork)}
              >
                {/* 画像エリア */}
                <div className="relative overflow-hidden aspect-[4/3] min-h-[180px]">
                  {/* 背景画像 / 動画サムネイル */}
                  {(() => {
                    const fallback = `https://picsum.photos/seed/${artwork.id}/400/300`
                    const src =
                      artwork.imageUrl && artwork.imageUrl.trim() !== ''
                        ? artwork.imageUrl
                        : fallback

                    // 動画プレビュー
                    if (artwork.fileUrl && isVideoUrl(artwork.fileUrl)) {
                      return (
                        <video
                          src={`${artwork.fileUrl}#t=0.1`} // 0.1秒目をサムネイルとして使用
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          muted
                          playsInline
                          preload="metadata"
                          loop
                          controls={false}
                          poster={artwork.imageUrl || undefined}
                          onMouseOver={(e) => {
                            e.currentTarget.play().catch(() => { })
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.pause()
                            e.currentTarget.currentTime = 0
                          }}
                        />
                      )
                    }

                    // 音声プレビュー（波形アニメーション風）
                    if (artwork.fileUrl && isAudioUrl(artwork.fileUrl)) {
                      return (
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 to-indigo-900 flex flex-col items-center justify-center p-6 group-hover:scale-105 transition-transform duration-500">
                          <div className="w-24 h-24 rounded-full bg-black/30 flex items-center justify-center mb-4 relative overflow-hidden ring-2 ring-indigo-500/50">
                            {src !== fallback ? (
                              <img src={src} className="w-full h-full object-cover opacity-80" alt="Album Art" />
                            ) : (
                              <span className="text-4xl">🎵</span>
                            )}
                            {/* Playing indicator overlay */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white">▶️</span>
                            </div>
                          </div>
                          <div className="flex gap-1 h-8 items-end justify-center w-full px-8">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className={`w-2 bg-indigo-500/80 rounded-t-sm transition-all duration-300 group-hover:animate-pulse`} style={{ height: `${30 + Math.random() * 70}%`, animationDelay: `${i * 0.1}s` }}></div>
                            ))}
                          </div>
                          <audio src={artwork.fileUrl} className="hidden group-hover:block absolute bottom-0 w-0 h-0"
                            onMouseOver={(e) => {
                              // Note: Audio autoplay on hover usually blocked by browsers without interaction, 
                              // but we can try or at least show visual feedback.
                              // Ideally we'd play a snippet.
                            }}
                          />
                        </div>
                      )
                    }

                    // TODO: 3Dモデルなどの対応もここに追加可能

                    // 通常画像
                    return (
                      <img
                        src={src}
                        alt={artwork.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = fallback
                        }}
                      />
                    )
                  })()}
                  {/* オーバーレイグラデーション */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  {/* カテゴリバッジ */}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-indigo-600/80 text-white text-xs rounded-full backdrop-blur-sm">
                    {artwork.category}
                  </div>
                  {/* 価格バッジ（基本無料） */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded-full backdrop-blur-sm font-medium">
                    無料
                  </div>
                </div>

                {/* 作品情報 */}
                <div className="p-4 text-sm border-t border-gray-600/30 bg-gray-800/80 backdrop-blur-sm">
                  <h3 className="font-medium text-gray-100 mb-2 truncate group-hover:text-indigo-300 transition-colors">{artwork.title}</h3>
                  <p className="text-gray-400 mb-3 text-xs group-hover:text-gray-300 transition-colors">by {artwork.author}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500/80 mb-3 group-hover:text-gray-400 transition-colors">
                    <span className="flex items-center gap-1">
                      <span className="opacity-70">👤</span>
                      {artwork.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="opacity-70">❤️</span>
                      {artwork.likes}
                    </span>
                  </div>

                  <div className="text-sm font-medium text-indigo-400/90 mb-4 group-hover:text-indigo-300 transition-colors">
                    {formatPrice(artwork.price, artwork.isFree)}
                  </div>

                  {/* アクションボタン */}
                  <div className="flex flex-col gap-2">
                    <button
                      className="w-full px-3 py-2 bg-purple-600/80 backdrop-blur-sm text-white text-xs rounded-lg hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 border border-purple-500/20 group-hover:border-purple-400/50"
                      onClick={handleButtonClick}
                    >
                      <span className="flex items-center justify-center gap-1">
                        👥 <span>ファン登録</span>
                      </span>
                    </button>
                    <button
                      className="w-full px-3 py-2 bg-green-600/80 backdrop-blur-sm text-white text-xs rounded-lg hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 border border-green-500/20 group-hover:border-green-400/50"
                      onClick={handleButtonClick}
                    >
                      <span className="flex items-center justify-center gap-1">
                        🤝 <span>グループ申請</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 検索結果なし */}
          {filteredArtworks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">🔍</div>
              <p className="text-gray-400 mb-6 text-lg">検索条件に一致する作品が見つかりませんでした</p>
              <button
                onClick={() => setFilters({ search: '', category: 'すべて', sortBy: '人気順' })}
                className="px-6 py-3 bg-indigo-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 border border-indigo-400/30"
              >
                フィルターをリセット
              </button>
            </div>
          )}

          {/* ページネーション */}
          {filteredArtworks.length > 0 && (
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-600/30 mt-6">
              <div className="flex gap-2 p-3 bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-600/30">
                <button className="px-4 py-2 text-gray-400 hover:text-gray-300 bg-gray-700/50 backdrop-blur-sm rounded-lg border border-gray-600/40 transition-all duration-300 hover:bg-gray-600/50 hover:border-gray-500/50">
                  前のページ
                </button>
                <span className="px-3 py-2 bg-indigo-500/80 text-white rounded-lg text-sm border border-indigo-400/50 shadow-lg shadow-indigo-500/25 backdrop-blur-sm">1</span>
                <span className="px-3 py-2 text-gray-400 hover:bg-gray-700/50 rounded-lg text-sm cursor-pointer transition-all duration-300 border border-gray-600/40 hover:border-gray-500/50 backdrop-blur-sm">2</span>
                <span className="px-3 py-2 text-gray-400 hover:bg-gray-700/50 rounded-lg text-sm cursor-pointer transition-all duration-300 border border-gray-600/40 hover:border-gray-500/50 backdrop-blur-sm">3</span>
                <span className="px-3 py-2 text-gray-400 hover:bg-gray-700/50 rounded-lg text-sm cursor-pointer transition-all duration-300 border border-gray-600/40 hover:border-gray-500/50 backdrop-blur-sm">4</span>
                <span className="px-3 py-2 text-gray-400 hover:bg-gray-700/50 rounded-lg text-sm cursor-pointer transition-all duration-300 border border-gray-600/40 hover:border-gray-500/50 backdrop-blur-sm">5</span>
                <button className="px-4 py-2 text-gray-400 hover:text-gray-300 bg-gray-700/50 backdrop-blur-sm rounded-lg border border-gray-600/40 transition-all duration-300 hover:bg-gray-600/50 hover:border-gray-500/50">
                  次のページ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Gallery