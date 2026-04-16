'use client'

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import PageHero from '../../../components/common/PageHero'
import PlaceholderImage from '../../../components/common/PlaceholderImage'
import { NovelArtwork } from '../../../types/artwork'
// import { Comment, Review, ReviewStats } from '../../../types/artwork' // 将来のコメント・レビュー機能用

const NovelDetailPage: React.FC = () => {
  const [artwork, setArtwork] = useState<NovelArtwork | null>(null)
  const [loading, setLoading] = useState(true)
  const [fontSize, setFontSize] = useState(16)
  const [isReading, setIsReading] = useState(false)
  const searchParams = useSearchParams()
  const artworkId = searchParams.get('id')

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!artworkId) return
      
      setLoading(true)
      try {
        // モックデータ
        const mockArtwork: NovelArtwork = {
          id: artworkId,
          title: '幻想の森',
          author: '小説家三郎',
          authorLevel: 40,
          category: '創作物',
          price: 1200,
          isFree: false,
          likes: 345,
          views: 1567,
          tags: ['ファンタジー', '冒険', '魔法'],
          description: '魔法の森で繰り広げられる冒険ファンタジー小説。',
          license: '個人利用のみ',
          createdAt: '2024-01-30',
          updatedAt: '2024-01-30',
          content: `第一章　森への扉\n\n朝霧が立ち込める森の中、エルフの少女アリアは静かに歩いていた。彼女の足音は苔むした地面に吸い込まれ、まるで森が彼女を歓迎しているかのようだった。\n\n「また、この場所に戻ってきてしまった...」\n\nアリアは立ち止まり、目の前に現れた巨大な樹を見上げた。この樹は「世界樹」と呼ばれ、すべての生命の源とされている。しかし、最近その輝きが弱くなっているのが気になっていた。\n\n第二章　失われた光\n\n世界樹の根元に近づくと、アリアは小さな光る石を発見した。それは「星の欠片」と呼ばれる、非常に希少な魔法石だった。\n\n「なぜこんなところに...」\n\n石を手に取った瞬間、アリアの頭に鮮明な映像が流れ込んだ。それは古い時代の記憶で、世界樹が満開の花を咲かせていた頃の光景だった。`,
          excerpt: '魔法の森で繰り広げられる冒険ファンタジー小説。エルフの少女アリアが世界樹の謎を解く物語。',
          wordCount: 15000,
          chapterCount: 12,
          language: 'ja',
          genre: ['ファンタジー', '冒険'],
          isCompleted: true
        }
        
        setArtwork(mockArtwork)
      } catch (error) {
        console.error('Failed to fetch artwork:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArtwork()
  }, [artworkId])

  const handleFontSizeChange = (direction: 'increase' | 'decrease') => {
    if (direction === 'increase' && fontSize < 24) {
      setFontSize(fontSize + 2)
    } else if (direction === 'decrease' && fontSize > 12) {
      setFontSize(fontSize - 2)
    }
  }

  const toggleReading = () => {
    setIsReading(!isReading)
  }

  const handleDownload = () => {
    if (!artwork) return
    console.log('Downloading novel:', artwork.id)
  }

  const getReadingTime = () => {
    if (!artwork) return ''
    // 平均読書速度: 1分間に400文字として計算
    const readingTimeMinutes = Math.ceil(artwork.wordCount / 400)
    if (readingTimeMinutes < 60) {
      return `約${readingTimeMinutes}分`
    } else {
      const hours = Math.floor(readingTimeMinutes / 60)
      const minutes = readingTimeMinutes % 60
      return `約${hours}時間${minutes > 0 ? minutes + '分' : ''}`
    }
  }

  // ローディング状態
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-gray-300">作品を読み込み中...</p>
        </div>
      </div>
    )
  }

  // データが見つからない場合
  if (!artwork) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 text-xl mb-4">作品が見つかりませんでした</p>
          <a 
            href="/gallery" 
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            ギャラリーに戻る
          </a>
        </div>
      </div>
    )
  }

  if (isReading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          {/* 読書ヘッダー */}
          <div className="flex items-center justify-between mb-6 bg-gray-800/60 backdrop-blur-md rounded-xl p-4 border border-gray-600/30">
            <button
              onClick={toggleReading}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← 戻る
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-100">{artwork.title}</h1>
              <p className="text-sm text-gray-400">by {artwork.author}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFontSizeChange('decrease')}
                className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                disabled={fontSize <= 12}
              >
                A-
              </button>
              <span className="text-gray-300 text-sm min-w-8 text-center">{fontSize}</span>
              <button
                onClick={() => handleFontSizeChange('increase')}
                className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                disabled={fontSize >= 24}
              >
                A+
              </button>
            </div>
          </div>

          {/* プログレスバー */}
          <div className="mb-6">
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: '0%' }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>0% 完了</span>
              <span>{getReadingTime()}</span>
            </div>
          </div>

          {/* 本文 */}
          <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-8 border border-gray-600/30">
            <div 
              className="text-gray-100 leading-relaxed whitespace-pre-wrap"
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              {artwork.content}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        
        {/* ヒーローセクション */}
        <PageHero
          title={artwork.title}
          subtitle={`by ${artwork.author}`}
          backgroundOpacity={3}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 小説プレビューエリア */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-8 border border-gray-600/30">
              
              {/* ブックカバー */}
              <div className="w-full max-w-sm mx-auto mb-8">
                <div className="aspect-3/4 relative">
                  <PlaceholderImage
                    width={300}
                    height={400}
                    text={`${artwork.title}\nby ${artwork.author}`}
                    className="aspect-3/4 rounded-xl object-cover w-full h-full"
                  />
                  {artwork.genre && artwork.genre.length > 0 && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-sm text-white bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                        {artwork.genre.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* プレビュー */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-100">あらすじ</h3>
                <p className="text-gray-300 leading-relaxed">{artwork.excerpt}</p>
                
                <div className="pt-4">
                  <button
                    onClick={toggleReading}
                    className="w-full px-6 py-3 bg-indigo-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 text-lg font-medium"
                  >
                    📖 読み始める
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 詳細情報エリア */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-6 border border-gray-600/30 mb-6">
              <h3 className="text-xl font-bold text-gray-100 mb-4">作品詳細</h3>
              
              {/* 価格とアクション */}
              <div className="mb-6">
                <div className="text-2xl font-bold text-indigo-400 mb-4">
                  {artwork.isFree ? '無料' : `¥${artwork.price.toLocaleString()}`}
                </div>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleDownload}
                    className="w-full px-4 py-3 bg-indigo-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                  >
                    {artwork.isFree ? 'ダウンロード' : '購入・ダウンロード'}
                  </button>
                  <button className="w-full px-4 py-3 bg-purple-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                    👥 ファン登録
                  </button>
                  <button className="w-full px-4 py-3 bg-green-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300">
                    🤝 コラボ申請
                  </button>
                </div>
              </div>

              {/* 作品詳細 */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">文字数</span>
                  <span className="text-gray-200">{artwork.wordCount.toLocaleString()}文字</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">読了時間</span>
                  <span className="text-gray-200">{getReadingTime()}</span>
                </div>
                {artwork.chapterCount && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">章数</span>
                    <span className="text-gray-200">{artwork.chapterCount}章</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">言語</span>
                  <span className="text-gray-200">{artwork.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">状態</span>
                  <span className={`text-sm font-medium ${artwork.isCompleted ? 'text-green-400' : 'text-yellow-400'}`}>
                    {artwork.isCompleted ? '完結' : '連載中'}
                  </span>
                </div>
                {artwork.lastChapter && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">最新話</span>
                    <span className="text-gray-200">第{artwork.lastChapter.number}話</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">ライセンス</span>
                  <span className="text-gray-200">{artwork.license}</span>
                </div>
              </div>
            </div>

            {/* 統計情報 */}
            <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-6 border border-gray-600/30 mb-6">
              <h3 className="text-lg font-bold text-gray-100 mb-4">統計</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">📚 読者数</span>
                  <span className="text-gray-200">{artwork.views.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">❤️ いいね</span>
                  <span className="text-gray-200">{artwork.likes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">📅 公開日</span>
                  <span className="text-gray-200">{new Date(artwork.createdAt).toLocaleDateString('ja-JP')}</span>
                </div>
                {artwork.lastChapter && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">📅 最終更新</span>
                    <span className="text-gray-200">{new Date(artwork.lastChapter.publishedAt).toLocaleDateString('ja-JP')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ジャンル・タグ */}
            <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-6 border border-gray-600/30">
              <h3 className="text-lg font-bold text-gray-100 mb-4">ジャンル・タグ</h3>
              
              {/* ジャンル */}
              {artwork.genre && artwork.genre.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm text-gray-400 mb-2">ジャンル</h4>
                  <div className="flex flex-wrap gap-2">
                    {artwork.genre.map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full backdrop-blur-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* タグ */}
              <div>
                <h4 className="text-sm text-gray-400 mb-2">タグ</h4>
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-900/30 text-indigo-300 text-sm rounded-full backdrop-blur-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 説明 */}
        <div className="mt-8 bg-gray-800/60 backdrop-blur-md rounded-xl p-6 border border-gray-600/30">
          <h3 className="text-xl font-bold text-gray-100 mb-4">作品について</h3>
          <p className="text-gray-300 leading-relaxed">{artwork.description}</p>
        </div>
      </div>
    </div>
  )
}

const __Inner_page = NovelDetailPage
import { Suspense } from 'react'
export default function Page() {
  return <Suspense><__Inner_page /></Suspense>
}
