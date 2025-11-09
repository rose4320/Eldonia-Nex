'use client'

import React, { useEffect, useMemo, useState } from 'react'
import PageHero from '../../components/common/PageHero'

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
  tags: string[]
  description: string
  fileFormat: string
  fileSize: string
  license: string
  rating: number
  reviewCount: number
}

interface FilterState {
  search: string
  category: string
  priceRange: string
  sortBy: string
}

const Gallery: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'すべて',
    priceRange: 'すべて',
    sortBy: '人気順'
  })
  const [loading, setLoading] = useState(true)
  const [redirectTo, setRedirectTo] = useState<string | null>(null)

  // モックデータ
  useEffect(() => {
    const mockArtworks: Artwork[] = [
      {
        id: '1',
        title: '美しい夕焼けの風景',
        author: 'クリエーター太郎',
        authorLevel: 25,
        category: '写真',
        price: 1000,
        isFree: false,
        likes: 456,
        views: 1234,
        imageUrl: '/api/placeholder/300/200',
        tags: ['風景', '夕焼け', '写真'],
        description: '山から撮影した夕焼けの美しい風景です。',
        fileFormat: 'JPEG (4K)',
        fileSize: '8.5MB',
        license: '商用利用可',
        rating: 4.8,
        reviewCount: 123
      },
      {
        id: '2',
        title: 'デジタルアート作品',
        author: 'アーティスト花子',
        authorLevel: 30,
        category: 'イラスト',
        price: 0,
        isFree: true,
        likes: 789,
        views: 2345,
        imageUrl: '/api/placeholder/300/200',
        tags: ['デジタルアート', 'イラスト', 'ファンタジー'],
        description: 'ファンタジー世界をイメージしたデジタルイラスト。',
        fileFormat: 'PNG',
        fileSize: '12.3MB',
        license: '個人利用のみ',
        rating: 4.9,
        reviewCount: 87
      },
      {
        id: '3',
        title: '3Dモデリング作品',
        author: '3Dクリエーター',
        authorLevel: 28,
        category: '3D',
        price: 2500,
        isFree: false,
        likes: 234,
        views: 567,
        imageUrl: '/api/placeholder/300/200',
        tags: ['3D', 'モデリング', 'キャラクター'],
        description: 'オリジナルキャラクターの3Dモデル。',
        fileFormat: 'OBJ',
        fileSize: '45.2MB',
        license: '商用利用可',
        rating: 4.7,
        reviewCount: 45
      },
      {
        id: '4',
        title: 'アニメ風イラスト',
        author: 'イラストレーター',
        authorLevel: 22,
        category: 'イラスト',
        price: 500,
        isFree: false,
        likes: 567,
        views: 1890,
        imageUrl: '/api/placeholder/300/200',
        tags: ['アニメ', 'イラスト', 'キャラクター'],
        description: 'アニメスタイルのオリジナルキャラクター。',
        fileFormat: 'PNG',
        fileSize: '5.7MB',
        license: '商用利用可',
        rating: 4.6,
        reviewCount: 78
      },
      {
        id: '5',
        title: 'ポートレート写真',
        author: 'フォトグラファー',
        authorLevel: 24,
        category: '写真',
        price: 0,
        isFree: true,
        likes: 678,
        views: 2134,
        imageUrl: '/api/placeholder/300/200',
        tags: ['ポートレート', '写真', '人物'],
        description: 'プロフェッショナルなポートレート写真。',
        fileFormat: 'JPEG',
        fileSize: '15.2MB',
        license: '個人利用のみ',
        rating: 4.8,
        reviewCount: 92
      },
      {
        id: '6',
        title: '自然音楽コレクション',
        author: '音楽プロデューサー',
        authorLevel: 26,
        category: '音楽',
        price: 3000,
        isFree: false,
        likes: 345,
        views: 890,
        imageUrl: '/api/placeholder/300/200',
        tags: ['音楽', '自然', 'ヒーリング'],
        description: '自然の音を取り入れたヒーリングミュージック。',
        fileFormat: 'MP3',
        fileSize: '67.8MB',
        license: '商用利用可',
        rating: 4.9,
        reviewCount: 156
      }
    ]

    setTimeout(() => {
      setArtworks(mockArtworks)
      setLoading(false)
    }, 500)
  }, [])

  // フィルタリング・ソート処理（useMemoで最適化）
  const filteredArtworks = useMemo(() => {
    const filtered = artworks.filter(artwork => {
      const matchesSearch = artwork.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                          artwork.author.toLowerCase().includes(filters.search.toLowerCase()) ||
                          artwork.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))

      const matchesCategory = filters.category === 'すべて' || artwork.category === filters.category

      const matchesPrice = (() => {
        switch (filters.priceRange) {
          case 'すべて': return true
          case '無料': return artwork.isFree
          case '有料': return !artwork.isFree
          case '¥0-1000': return artwork.price <= 1000
          case '¥1000-5000': return artwork.price > 1000 && artwork.price <= 5000
          case '¥5000以上': return artwork.price > 5000
          default: return true
        }
      })()

      return matchesSearch && matchesCategory && matchesPrice
    })

    // ソート処理
    switch (filters.sortBy) {
      case '人気順':
        return filtered.sort((a, b) => b.likes - a.likes)
      case '新着順':
        return filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id))
      case '評価順':
        return filtered.sort((a, b) => b.rating - a.rating)
      case '価格の安い順':
        return filtered.sort((a, b) => a.price - b.price)
      case '価格の高い順':
        return filtered.sort((a, b) => b.price - a.price)
      default:
        return filtered
    }
  }, [artworks, filters])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const formatPrice = (price: number, isFree: boolean) => {
    if (isFree) return '無料'
    return `¥${price.toLocaleString()}`
  }

  const getArtworkRoute = (category: string, id: string) => {
    switch (category) {
      case 'イラスト':
      case '写真':
        return `/artwork/image?id=${id}`
      case '音楽':
        return `/artwork/music?id=${id}`
      case '動画':
        return `/artwork/video?id=${id}`
      case '創作物':
        return `/artwork/novel?id=${id}`
      case '3D':
        return `/artwork/image?id=${id}`
      default:
        return `/artwork/image?id=${id}`
    }
  }

  const handleArtworkClick = (artwork: typeof artworks[0]) => {
    const route = getArtworkRoute(artwork.category, artwork.id)
    setRedirectTo(route)
  }

  // リダイレクト処理
  useEffect(() => {
    if (redirectTo) {
      window.location.href = redirectTo
    }
  }, [redirectTo])

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
                      className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 backdrop-blur-sm ${
                        filters.category === category
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

          {/* 第三行：価格フィルタ */}
          <div className="mb-4">
            <div className="text-gray-300">
              <span className="mr-4">価格:</span>
              <div className="inline-flex flex-wrap gap-2">
                {[
                  { label: '無料', value: '無料' },
                  { label: '有料', value: '有料' },
                  { label: '¥0-1000', value: '¥0-1000' },
                  { label: '¥1000-5000', value: '¥1000-5000' },
                  { label: '¥5000以上', value: '¥5000以上' }
                ].map((price) => (
                  <button
                    key={price.value}
                    onClick={() => handleFilterChange('priceRange', price.value)}
                    className={`px-3 py-1 border rounded-lg text-sm transition-all duration-300 backdrop-blur-sm ${
                      filters.priceRange === price.value
                        ? 'bg-indigo-500/80 text-white border-indigo-400/50 shadow-lg shadow-indigo-500/25'
                        : 'border-gray-600/40 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50'
                    }`}
                  >
                    {price.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

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
                <div className="aspect-4/3 bg-linear-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm flex items-center justify-center text-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">🎨</span>
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
                onClick={() => setFilters({ search: '', category: 'すべて', priceRange: 'すべて', sortBy: '人気順' })}
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