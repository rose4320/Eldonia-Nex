'use client'

import PageHero from "@/components/common/PageHero"
import React, { useEffect, useMemo, useState } from 'react'

// イベントページ - UI/UX設計書準拠
interface Event {
  id: string
  title: string
  organizer: string
  organizerLevel: number
  category: string
  date: string
  endDate?: string
  venue: string
  isOnline: boolean
  price: number
  isFree: boolean
  capacity: number
  participants: number
  tags: string[]
  description: string
  isActive: boolean
  isUpcoming: boolean
}

interface FilterState {
  search: string
  category: string
  eventType: string
  priceType: string
  sortBy: string
}

export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'すべて',
    eventType: 'すべて',
    priceType: 'すべて',
    sortBy: '開催日順'
  })
  const [loading, setLoading] = useState(true)

  // モックデータ
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Eldonia Art Festival 2025',
        organizer: 'Eldonia運営チーム',
        organizerLevel: 50,
        category: '展示会',
        date: '2025/12/10',
        endDate: '2025/12/12',
        venue: 'オンライン',
        isOnline: true,
        price: 0,
        isFree: true,
        capacity: 1000,
        participants: 456,
        tags: ['アート', '展示', 'ライブ配信'],
        description: 'クリエイターによる作品展示・ライブ配信・ワークショップ多数',
        isActive: true,
        isUpcoming: false
      },
      {
        id: '2',
        title: 'デジタルイラスト講座',
        organizer: 'イラスト研究会',
        organizerLevel: 28,
        category: 'ワークショップ',
        date: '2025/01/15',
        venue: '東京・渋谷',
        isOnline: false,
        price: 3000,
        isFree: false,
        capacity: 30,
        participants: 24,
        tags: ['イラスト', '講座', '初心者向け'],
        description: '初心者向けデジタルイラスト基礎講座。ペンタブ貸出あり。',
        isActive: false,
        isUpcoming: true
      },
      {
        id: '3',
        title: '3Dモデリング勉強会',
        organizer: '3D研究部',
        organizerLevel: 32,
        category: '勉強会',
        date: '2025/01/20',
        venue: 'オンライン',
        isOnline: true,
        price: 0,
        isFree: true,
        capacity: 50,
        participants: 38,
        tags: ['3D', 'Blender', '勉強会'],
        description: 'Blenderを使った3Dモデリングの基礎から応用まで。',
        isActive: false,
        isUpcoming: true
      },
      {
        id: '4',
        title: 'クリエイター交流会',
        organizer: 'コミュニティ運営',
        organizerLevel: 40,
        category: '交流会',
        date: '2025/02/01',
        venue: '大阪・梅田',
        isOnline: false,
        price: 2000,
        isFree: false,
        capacity: 100,
        participants: 67,
        tags: ['交流会', 'ネットワーキング', 'クリエイター'],
        description: '関西圏のクリエイターが集まる交流イベント。軽食付き。',
        isActive: false,
        isUpcoming: true
      },
      {
        id: '5',
        title: 'ゲーム音楽制作セミナー',
        organizer: 'サウンドクリエーターズ',
        organizerLevel: 35,
        category: 'セミナー',
        date: '2025/02/10',
        venue: 'オンライン',
        isOnline: true,
        price: 1500,
        isFree: false,
        capacity: 200,
        participants: 89,
        tags: ['音楽', 'ゲーム', 'DTM'],
        description: 'プロのゲーム音楽クリエイターが教える作曲テクニック。',
        isActive: false,
        isUpcoming: true
      }
    ]

    setTimeout(() => {
      setEvents(mockEvents)
      setLoading(false)
    }, 500)
  }, [])

  // フィルタリング・ソート処理
  const filteredEvents = useMemo(() => {
    const filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                          event.organizer.toLowerCase().includes(filters.search.toLowerCase()) ||
                          event.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))

      const matchesCategory = filters.category === 'すべて' || event.category === filters.category

      const matchesEventType = (() => {
        switch (filters.eventType) {
          case 'すべて': return true
          case 'オンライン': return event.isOnline
          case 'オフライン': return !event.isOnline
          default: return true
        }
      })()

      const matchesPriceType = (() => {
        switch (filters.priceType) {
          case 'すべて': return true
          case '無料': return event.isFree
          case '有料': return !event.isFree
          default: return true
        }
      })()

      return matchesSearch && matchesCategory && matchesEventType && matchesPriceType
    })

    switch (filters.sortBy) {
      case '開催日順':
        return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      case '参加者数順':
        return filtered.sort((a, b) => b.participants - a.participants)
      case '新着順':
        return filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id))
      default:
        return filtered
    }
  }, [events, filters])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">イベントを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        
        {/* ヒーローセクション */}
        <PageHero
          title="EVENTS"
          subtitle="Create & Manage Your Events"
        />
        
        {/* フィルター・検索バー */}
        <div className="border border-gray-600/30 rounded-xl p-6 mb-8 bg-gray-800/60 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="イベント・キーワード検索"
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
              <option value="開催日順">ソート: 開催日順▼</option>
              <option value="参加者数順">ソート: 参加者数順▼</option>
              <option value="新着順">ソート: 新着順▼</option>
            </select>

            <button className="px-6 py-2 bg-indigo-600/80 text-white rounded-lg font-bold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 border border-indigo-500/20">
              + 新規イベント作成
            </button>
          </div>

          {/* カテゴリフィルタ */}
          <div className="mb-4">
            <div className="text-gray-300">
              <span className="mr-4">カテゴリ:</span>
              <div className="inline-flex flex-wrap gap-1">
                {['すべて', '展示会', 'ワークショップ', '勉強会', '交流会', 'セミナー', 'ライブ'].map((category, index) => (
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

          {/* 開催形式・料金フィルタ */}
          <div className="flex flex-wrap gap-6">
            <div className="text-gray-300">
              <span className="mr-4">開催:</span>
              <div className="inline-flex flex-wrap gap-2">
                {['すべて', 'オンライン', 'オフライン'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterChange('eventType', type)}
                    className={`px-3 py-1 border rounded-lg text-sm transition-all duration-300 backdrop-blur-sm ${
                      filters.eventType === type
                        ? 'bg-green-500/80 text-white border-green-400/50'
                        : 'border-gray-600/40 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-gray-300">
              <span className="mr-4">料金:</span>
              <div className="inline-flex flex-wrap gap-2">
                {['すべて', '無料', '有料'].map((price) => (
                  <button
                    key={price}
                    onClick={() => handleFilterChange('priceType', price)}
                    className={`px-3 py-1 border rounded-lg text-sm transition-all duration-300 backdrop-blur-sm ${
                      filters.priceType === price
                        ? 'bg-indigo-500/80 text-white border-indigo-400/50'
                        : 'border-gray-600/40 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    {price}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* イベントリスト */}
        <div className="border border-gray-600/30 rounded-xl p-6 bg-gray-800/40 backdrop-blur-md">
          <div className="space-y-4 mb-6">
            {filteredEvents.map((event) => (
              <div 
                key={event.id} 
                className="group border border-gray-600/20 rounded-xl p-6 bg-gray-800/60 backdrop-blur-sm hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {event.isActive && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">開催中</span>
                      )}
                      {event.isUpcoming && (
                        <span className="bg-blue-500/80 text-white text-xs px-2 py-1 rounded-full">開催予定</span>
                      )}
                      {event.isOnline ? (
                        <span className="bg-purple-500/80 text-white text-xs px-2 py-1 rounded-full">オンライン</span>
                      ) : (
                        <span className="bg-orange-500/80 text-white text-xs px-2 py-1 rounded-full">オフライン</span>
                      )}
                      {event.isFree && (
                        <span className="bg-emerald-500/80 text-white text-xs px-2 py-1 rounded-full">無料</span>
                      )}
                      <span className="text-gray-500 text-xs">
                        {event.date}{event.endDate ? ` 〜 ${event.endDate}` : ''}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-100 text-lg mb-2 group-hover:text-indigo-300 transition-colors">{event.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{event.organizer} (Lv.{event.organizerLevel}) • {event.venue}</p>
                    <p className="text-gray-500 text-sm mb-3">{event.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-indigo-900/30 rounded-full text-xs text-indigo-300/90">#{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="lg:text-right space-y-2">
                    {!event.isFree && (
                      <div className="text-xl font-bold text-indigo-400">¥{event.price.toLocaleString()}</div>
                    )}
                    <div className="text-gray-400 text-sm">
                      参加者: {event.participants} / {event.capacity}人
                    </div>
                    <div className="w-full lg:w-32 bg-gray-700/50 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full" 
                        style={{ width: `${Math.min((event.participants / event.capacity) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <button className="px-6 py-2 bg-indigo-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 border border-indigo-500/20">
                      詳細を見る
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 検索結果なし */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">📅</div>
              <p className="text-gray-400 mb-6 text-lg">検索条件に一致するイベントが見つかりませんでした</p>
              <button
                onClick={() => setFilters({ search: '', category: 'すべて', eventType: 'すべて', priceType: 'すべて', sortBy: '開催日順' })}
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
