'use client'

import React, { useState } from 'react'
import { Review, ReviewStats } from '../../types/artwork'

interface ReviewsSectionProps {
  artworkId: string
  reviews: Review[]
  reviewStats: ReviewStats
  onAddReview: (rating: number, title: string, content: string) => void
  onLikeReview: (reviewId: string) => void
  onMarkHelpful: (reviewId: string) => void
}

export default function ReviewsSection({
  artworkId, // eslint-disable-line @typescript-eslint/no-unused-vars
  reviews,
  reviewStats,
  onAddReview,
  onLikeReview,
  onMarkHelpful
}: ReviewsSectionProps) {
  const [isWritingReview, setIsWritingReview] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: ''
  })

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (newReview.title.trim() && newReview.content.trim()) {
      onAddReview(newReview.rating, newReview.title.trim(), newReview.content.trim())
      setNewReview({ rating: 5, title: '', content: '' })
      setIsWritingReview(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-500'
            } ${interactive ? 'hover:text-yellow-300 cursor-pointer' : ''}`}
            disabled={!interactive}
          >
            ⭐
          </button>
        ))}
      </div>
    )
  }

  const renderRatingDistribution = () => {
    // const maxCount = Math.max(...Object.values(reviewStats.ratingDistribution)) // 将来の使用に備えて保持
    
    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution]
          const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0
          
          return (
            <div key={rating} className="flex items-center gap-2 text-sm">
              <span className="w-3 text-gray-400">{rating}</span>
              <span className="text-yellow-400">⭐</span>
              <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-yellow-400 h-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-right text-gray-400">{count}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-6 border border-gray-600/30">
      <h3 className="text-xl font-bold text-gray-100 mb-6 flex items-center gap-2">
        <span>⭐</span>
        レビュー ({reviewStats.totalReviews})
      </h3>
      
      {/* レビュー統計 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            {reviewStats.averageRating.toFixed(1)}
          </div>
          {renderStars(Math.round(reviewStats.averageRating))}
          <div className="text-sm text-gray-400 mt-1">
            {reviewStats.totalReviews}件のレビュー
          </div>
        </div>
        
        <div>
          {renderRatingDistribution()}
        </div>
      </div>
      
      {/* レビュー投稿ボタン */}
      {!isWritingReview && (
        <button
          onClick={() => setIsWritingReview(true)}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors mb-6"
        >
          レビューを書く
        </button>
      )}
      
      {/* レビュー投稿フォーム */}
      {isWritingReview && (
        <form onSubmit={handleSubmitReview} className="bg-gray-700/30 rounded-lg p-4 mb-6">
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">評価</label>
            {renderStars(newReview.rating, true, (rating) => 
              setNewReview(prev => ({ ...prev, rating }))
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">タイトル</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
              placeholder="レビューのタイトルを入力..."
              className="w-full bg-gray-700/50 text-gray-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">詳細</label>
            <textarea
              value={newReview.content}
              onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
              placeholder="この作品についての詳しい感想やコメントを書いてください..."
              className="w-full bg-gray-700/50 text-gray-100 rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              rows={5}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsWritingReview(false)}
              className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!newReview.title.trim() || !newReview.content.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              レビュー投稿
            </button>
          </div>
        </form>
      )}
      
      {/* レビュー一覧 */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {review.username.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-100 font-medium">{review.username}</span>
                    <span className="text-xs text-indigo-400 bg-indigo-900/30 px-2 py-0.5 rounded-full">
                      Lv.{review.userLevel}
                    </span>
                    {review.isAuthor && (
                      <span className="text-xs text-yellow-400 bg-yellow-900/30 px-2 py-0.5 rounded-full">
                        作者
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                  </div>
                  
                  <h4 className="text-gray-100 font-medium mb-2">{review.title}</h4>
                  <p className="text-gray-300 leading-relaxed mb-3">{review.content}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <button
                      onClick={() => onLikeReview(review.id)}
                      className="flex items-center gap-1 text-gray-400 hover:text-indigo-400 transition-colors"
                    >
                      <span>👍</span>
                      <span>{review.likes}</span>
                    </button>
                    
                    <button
                      onClick={() => onMarkHelpful(review.id)}
                      className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition-colors"
                    >
                      <span>✓</span>
                      <span>参考になった ({review.isHelpful})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            まだレビューがありません。最初のレビューを投稿してみませんか？
          </div>
        )}
      </div>
    </div>
  )
}