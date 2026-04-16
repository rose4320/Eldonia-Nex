'use client'

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CommentsSection from '../../../components/artwork/CommentsSection'
import ReviewsSection from '../../../components/artwork/ReviewsSection'
import PageHero from '../../../components/common/PageHero'
import PlaceholderImage from '../../../components/common/PlaceholderImage'
import { Comment, ImageArtwork, Review, ReviewStats } from '../../../types/artwork'

const ImageDetailPage: React.FC = () => {
  const [artwork, setArtwork] = useState<ImageArtwork | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentZoom, setCurrentZoom] = useState(1)
  const [comments, setComments] = useState<Comment[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  })
  const searchParams = useSearchParams()
  const artworkId = searchParams.get('id')

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!artworkId) return
      
      setLoading(true)
      try {
        // モックデータ - 実際のAPIに置き換えてください
        const mockArtwork: ImageArtwork = {
          id: artworkId,
          title: 'デジタルアート作品',
          author: 'アーティスト太郎',
          authorLevel: 25,
          category: 'イラスト',
          price: 1500,
          isFree: false,
          likes: 456,
          views: 1234,
          imageUrl: '/placeholder-image.jpg',
          tags: ['デジタルアート', 'イラスト', 'ファンタジー'],
          description: 'ファンタジー世界をイメージしたデジタルイラスト作品です。',
          fileFormat: 'PNG',
          fileSize: '12.3MB',
          license: '個人利用のみ',
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15',
          dimensions: {
            width: 1920,
            height: 1080
          },
          colorProfile: 'sRGB',
          dpi: 300
        }
        
        setArtwork(mockArtwork)
        
        // コメント・レビューのモックデータ
        const mockComments: Comment[] = [
          {
            id: '1',
            artworkId: artworkId,
            userId: 'user1',
            username: 'ユーザー1',
            userLevel: 15,
            content: '素晴らしい作品ですね！色使いがとても美しいです。',
            createdAt: '2024-01-16T10:30:00Z',
            likes: 12,
            replies: [
              {
                id: '1-1',
                artworkId: artworkId,
                userId: 'author',
                username: 'アーティスト太郎',
                userLevel: 25,
                content: 'ありがとうございます！時間をかけて色調整しました。',
                createdAt: '2024-01-16T11:00:00Z',
                likes: 5,
                isAuthor: true
              }
            ]
          },
          {
            id: '2',
            artworkId: artworkId,
            userId: 'user2',
            username: 'クリエイター花子',
            userLevel: 32,
            content: '構図がとても良いですね。参考にさせていただきます！',
            createdAt: '2024-01-16T14:20:00Z',
            likes: 8
          }
        ]

        const mockReviews: Review[] = [
          {
            id: '1',
            artworkId: artworkId,
            userId: 'user3',
            username: 'レビュアー太郎',
            userLevel: 20,
            rating: 5,
            title: '期待以上の作品でした',
            content: 'ダウンロードした画像の品質が素晴らしく、印刷しても美しく仕上がりました。価格も適正だと思います。',
            createdAt: '2024-01-17T09:00:00Z',
            likes: 15,
            isHelpful: 23
          },
          {
            id: '2',
            artworkId: artworkId,
            userId: 'user4',
            username: 'デザイナー山田',
            userLevel: 28,
            rating: 4,
            title: '商用利用ができれば完璧',
            content: '作品自体は素晴らしいのですが、個人利用のみなのが少し残念です。商用ライセンスがあれば★5でした。',
            createdAt: '2024-01-18T15:30:00Z',
            likes: 7,
            isHelpful: 12
          }
        ]

        const mockReviewStats: ReviewStats = {
          averageRating: 4.5,
          totalReviews: 2,
          ratingDistribution: {
            5: 1,
            4: 1,
            3: 0,
            2: 0,
            1: 0
          }
        }

        setComments(mockComments)
        setReviews(mockReviews)
        setReviewStats(mockReviewStats)
      } catch (error) {
        console.error('Failed to fetch artwork:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArtwork()
  }, [artworkId])

  const handleDownload = () => {
    if (!artwork) return
    // ダウンロード処理の実装
    console.log('Downloading image:', artwork.id)
  }

  // コメント・レビューハンドラー
  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      artworkId: artwork?.id || '',
      userId: 'current-user',
      username: 'あなた',
      userLevel: 10,
      content,
      createdAt: new Date().toISOString(),
      likes: 0
    }
    setComments(prev => [newComment, ...prev])
  }

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ))
  }

  const handleReplyComment = (commentId: string, content: string) => {
    const newReply: Comment = {
      id: `${commentId}-${Date.now()}`,
      artworkId: artwork?.id || '',
      userId: 'current-user',
      username: 'あなた',
      userLevel: 10,
      content,
      createdAt: new Date().toISOString(),
      likes: 0
    }
    
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...(comment.replies || []), newReply] }
        : comment
    ))
  }

  const handleAddReview = (rating: number, title: string, content: string) => {
    const newReview: Review = {
      id: Date.now().toString(),
      artworkId: artwork?.id || '',
      userId: 'current-user',
      username: 'あなた',
      userLevel: 10,
      rating,
      title,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isHelpful: 0
    }
    setReviews(prev => [newReview, ...prev])
    
    // レビュー統計を更新
    setReviewStats(prev => {
      const newTotalReviews = prev.totalReviews + 1
      const newAverage = ((prev.averageRating * prev.totalReviews) + rating) / newTotalReviews
      const newDistribution = { ...prev.ratingDistribution }
      newDistribution[rating as keyof typeof newDistribution]++
      
      return {
        averageRating: newAverage,
        totalReviews: newTotalReviews,
        ratingDistribution: newDistribution
      }
    })
  }

  const handleLikeReview = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, likes: review.likes + 1 }
        : review
    ))
  }

  const handleMarkHelpful = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, isHelpful: review.isHelpful + 1 }
        : review
    ))
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in' && currentZoom < 3) {
      setCurrentZoom(currentZoom + 0.5)
    } else if (direction === 'out' && currentZoom > 0.5) {
      setCurrentZoom(currentZoom - 0.5)
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
          
          {/* 画像表示エリア */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-6 border border-gray-600/30">
              <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                <PlaceholderImage
                  width={800}
                  height={600}
                  text={artwork.title}
                  className="w-full h-auto object-contain cursor-pointer transition-transform duration-300"
                  style={{ transform: `scale(${currentZoom})` }}
                  onClick={toggleFullscreen}
                />
                
                {/* 画像コントロール */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => handleZoom('out')}
                    className="p-2 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700/80 transition-colors"
                    disabled={currentZoom <= 0.5}
                  >
                    🔍-
                  </button>
                  <button
                    onClick={() => handleZoom('in')}
                    className="p-2 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700/80 transition-colors"
                    disabled={currentZoom >= 3}
                  >
                    🔍+
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700/80 transition-colors"
                  >
                    🔳
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

              {/* 技術詳細 */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">形式</span>
                  <span className="text-gray-200">{artwork.fileFormat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">サイズ</span>
                  <span className="text-gray-200">{artwork.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">解像度</span>
                  <span className="text-gray-200">{artwork.dimensions.width} × {artwork.dimensions.height}</span>
                </div>
                {artwork.dpi && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">DPI</span>
                    <span className="text-gray-200">{artwork.dpi}</span>
                  </div>
                )}
                {artwork.colorProfile && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">カラープロファイル</span>
                    <span className="text-gray-200">{artwork.colorProfile}</span>
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
                  <span className="text-gray-400">👀 閲覧数</span>
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
              </div>
            </div>

            {/* タグ */}
            <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-6 border border-gray-600/30">
              <h3 className="text-lg font-bold text-gray-100 mb-4">タグ</h3>
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

        {/* 説明 */}
        <div className="mt-8 bg-gray-800/60 backdrop-blur-md rounded-xl p-6 border border-gray-600/30">
          <h3 className="text-xl font-bold text-gray-100 mb-4">作品について</h3>
          <p className="text-gray-300 leading-relaxed">{artwork.description}</p>
        </div>

        {/* レビューセクション */}
        <div className="mt-8">
          <ReviewsSection
            artworkId={artwork.id}
            reviews={reviews}
            reviewStats={reviewStats}
            onAddReview={handleAddReview}
            onLikeReview={handleLikeReview}
            onMarkHelpful={handleMarkHelpful}
          />
        </div>

        {/* コメントセクション */}
        <div className="mt-8">
          <CommentsSection
            artworkId={artwork.id}
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onReplyComment={handleReplyComment}
          />
        </div>
      </div>

      {/* フルスクリーンモーダル */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center">
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 p-3 text-white hover:text-gray-300 text-2xl z-10"
          >
            ✕
          </button>
          <PlaceholderImage
            width={800}
            height={600}
            text={artwork.title}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  )
}

const __Inner_page = ImageDetailPage

import { Suspense } from 'react'
export default function Page() {
  return <Suspense><__Inner_page /></Suspense>
}
