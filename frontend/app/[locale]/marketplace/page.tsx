'use client'

import PageHero from '@/components/common/PageHero'
import React, { useEffect, useMemo, useState } from 'react'

// マーケットプレイスページ - UI/UX設計書準拠
interface Product {
  id: string
  title: string
  seller: string
  sellerLevel: number
  category: string
  price: number
  originalPrice?: number
  likes: number
  sales: number
  imageUrl: string
  tags: string[]
  description: string
  rating: number
  reviewCount: number
}

interface FilterState {
  search: string
  category: string
  priceRange: string
  sortBy: string
}

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'すべて',
    priceRange: 'すべて',
    sortBy: '人気順'
  })
  const [loading, setLoading] = useState(true)

  // モックデータ
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        title: 'プロ仕様イラスト素材パック',
        seller: 'デザイナー太郎',
        sellerLevel: 28,
        category: 'イラスト',
        price: 2980,
        originalPrice: 4980,
        likes: 234,
        sales: 89,
        imageUrl: '/api/placeholder/300/200',
        tags: ['イラスト', '素材', 'プロ向け'],
        description: '商用利用可能な高品質イラスト素材100点セット',
        rating: 4.8,
        reviewCount: 45
      },
      {
        id: '2',
        title: '3Dキャラクターモデル',
        seller: '3Dアーティスト',
        sellerLevel: 32,
        category: '3Dモデル',
        price: 5980,
        likes: 156,
        sales: 34,
        imageUrl: '/api/placeholder/300/200',
        tags: ['3D', 'キャラクター', 'Unity対応'],
        description: 'Unity/Unreal対応の高品質3Dキャラクター',
        rating: 4.9,
        reviewCount: 28
      },
      {
        id: '3',
        title: 'BGM音源コレクション',
        seller: 'サウンドクリエーター',
        sellerLevel: 25,
        category: '音楽',
        price: 1980,
        likes: 345,
        sales: 156,
        imageUrl: '/api/placeholder/300/200',
        tags: ['BGM', 'ゲーム', '動画向け'],
        description: 'ゲーム・動画制作に最適なBGM50曲セット',
        rating: 4.7,
        reviewCount: 89
      },
      {
        id: '4',
        title: 'UIデザインテンプレート',
        seller: 'UIデザイナー',
        sellerLevel: 30,
        category: 'デザイン',
        price: 3980,
        originalPrice: 5980,
        likes: 189,
        sales: 67,
        imageUrl: '/api/placeholder/300/200',
        tags: ['UI', 'Figma', 'テンプレート'],
        description: 'Figma対応のモダンUIテンプレート',
        rating: 4.6,
        reviewCount: 34
      },
      {
        id: '5',
        title: 'フォトストック100枚パック',
        seller: 'フォトグラファー',
        sellerLevel: 22,
        category: '写真',
        price: 980,
        likes: 567,
        sales: 234,
        imageUrl: '/api/placeholder/300/200',
        tags: ['写真', 'ストックフォト', '商用可'],
        description: '高解像度ストックフォト100枚セット',
        rating: 4.5,
        reviewCount: 112
      },
      {
        id: '6',
        title: 'エフェクト素材パック',
        seller: 'VFXアーティスト',
        sellerLevel: 27,
        category: 'エフェクト',
        price: 4980,
        likes: 123,
        sales: 45,
        imageUrl: '/api/placeholder/300/200',
        tags: ['VFX', 'エフェクト', '動画素材'],
        description: '動画制作用エフェクト素材50点セット',
        rating: 4.8,
        reviewCount: 23
      }
    ]

    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 500)
  }, [])

  // フィルタリング・ソート処理
  const filteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                          product.seller.toLowerCase().includes(filters.search.toLowerCase()) ||
                          product.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))

      const matchesCategory = filters.category === 'すべて' || product.category === filters.category

      const matchesPrice = (() => {
        switch (filters.priceRange) {
          case 'すべて': return true
          case '¥0-1000': return product.price <= 1000
          case '¥1000-3000': return product.price > 1000 && product.price <= 3000
          case '¥3000-5000': return product.price > 3000 && product.price <= 5000
          case '¥5000以上': return product.price > 5000
          default: return true
        }
      })()

      return matchesSearch && matchesCategory && matchesPrice
    })

    switch (filters.sortBy) {
      case '人気順':
        return filtered.sort((a, b) => b.sales - a.sales)
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
  }, [products, filters])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">マーケットプレイスを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        
        {/* ヒーローセクション */}
        <PageHero
          title="SHOP"
          subtitle="Digital Marketplace"
          backgroundOpacity={5}
        />
        
        {/* フィルター・検索バー */}
        <div className="border border-gray-600/30 rounded-xl p-6 mb-8 bg-gray-800/60 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="商品・キーワード検索"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-2 border border-gray-600/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent bg-gray-700/50 backdrop-blur-sm text-gray-100 placeholder-gray-400 transition-all duration-300"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors">
                🔍
              </button>
            </div>
            
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

          {/* カテゴリフィルタ */}
          <div className="mb-4">
            <div className="text-gray-300">
              <span className="mr-4">カテゴリ:</span>
              <div className="inline-flex flex-wrap gap-1">
                {['すべて', 'イラスト', '3Dモデル', '音楽', 'デザイン', '写真', 'エフェクト'].map((category, index) => (
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
                    {index < 6 && <span className="text-gray-500/70">・</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* 価格フィルタ */}
          <div className="mb-4">
            <div className="text-gray-300">
              <span className="mr-4">価格:</span>
              <div className="inline-flex flex-wrap gap-2">
                {[
                  { label: 'すべて', value: 'すべて' },
                  { label: '¥0-1000', value: '¥0-1000' },
                  { label: '¥1000-3000', value: '¥1000-3000' },
                  { label: '¥3000-5000', value: '¥3000-5000' },
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
        </div>

        {/* 商品グリッド */}
        <div className="border border-gray-600/30 rounded-xl p-6 bg-gray-800/40 backdrop-blur-md">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group border border-gray-600/20 rounded-xl overflow-hidden bg-gray-800/60 backdrop-blur-sm hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                {/* 画像エリア */}
                <div className="aspect-4/3 relative overflow-hidden">
                  {/* 背景画像 */}
                  <img 
                    src={`https://picsum.photos/seed/shop-${product.id}/400/300`}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* オーバーレイグラデーション */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  {/* SALEバッジ */}
                  {product.originalPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold z-10">
                      SALE
                    </div>
                  )}
                  {/* カテゴリバッジ */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-indigo-600/80 text-white text-xs rounded-full backdrop-blur-sm">
                    {product.category}
                  </div>
                </div>
                
                {/* 商品情報 */}
                <div className="p-4 text-sm border-t border-gray-600/30 bg-gray-800/80 backdrop-blur-sm">
                  <h3 className="font-medium text-gray-100 mb-2 truncate group-hover:text-indigo-300 transition-colors">{product.title}</h3>
                  <p className="text-gray-400 mb-3 text-xs group-hover:text-gray-300 transition-colors">by {product.seller}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500/80 mb-3">
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      {product.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      📦 {product.sales}件
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-lg font-bold text-indigo-400">¥{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through ml-2">¥{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>

                  <button className="w-full px-3 py-2 bg-indigo-600/80 backdrop-blur-sm text-white text-xs rounded-lg hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 border border-indigo-500/20">
                    🛒 カートに追加
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 検索結果なし */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">🔍</div>
              <p className="text-gray-400 mb-6 text-lg">検索条件に一致する商品が見つかりませんでした</p>
              <button
                onClick={() => setFilters({ search: '', category: 'すべて', priceRange: 'すべて', sortBy: '人気順' })}
                className="px-6 py-3 bg-indigo-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 border border-indigo-400/30"
              >
                フィルターをリセット
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Marketplace




