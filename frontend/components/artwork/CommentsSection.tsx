'use client'

import React, { useState } from 'react'
import { Comment } from '../../types/artwork'

interface CommentsSectionProps {
  artworkId: string
  comments: Comment[]
  onAddComment: (content: string) => void
  onLikeComment: (commentId: string) => void
  onReplyComment: (commentId: string, content: string) => void
}

export default function CommentsSection({
  artworkId, // eslint-disable-line @typescript-eslint/no-unused-vars
  comments,
  onAddComment,
  onLikeComment,
  onReplyComment
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onAddComment(newComment.trim())
      setNewComment('')
    }
  }

  const handleSubmitReply = (commentId: string) => {
    if (replyContent.trim()) {
      onReplyComment(commentId, replyContent.trim())
      setReplyContent('')
      setReplyingTo(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div 
      key={comment.id} 
      className={`bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 ${isReply ? 'ml-6 mt-3' : 'mb-4'}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {comment.username.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-100 font-medium">{comment.username}</span>
            <span className="text-xs text-indigo-400 bg-indigo-900/30 px-2 py-0.5 rounded-full">
              Lv.{comment.userLevel}
            </span>
            {comment.isAuthor && (
              <span className="text-xs text-yellow-400 bg-yellow-900/30 px-2 py-0.5 rounded-full">
                作者
              </span>
            )}
            <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
          </div>
          
          <p className="text-gray-300 mb-3 leading-relaxed">{comment.content}</p>
          
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={() => onLikeComment(comment.id)}
              className="flex items-center gap-1 text-gray-400 hover:text-indigo-400 transition-colors"
            >
              <span>👍</span>
              <span>{comment.likes}</span>
            </button>
            
            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-gray-400 hover:text-indigo-400 transition-colors"
              >
                返信
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* 返信フォーム */}
      {replyingTo === comment.id && (
        <div className="mt-4 ml-11">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={`${comment.username}への返信...`}
            className="w-full bg-gray-700/50 text-gray-100 rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setReplyingTo(null)}
              className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={() => handleSubmitReply(comment.id)}
              disabled={!replyContent.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              返信
            </button>
          </div>
        </div>
      )}
      
      {/* 返信コメント */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-6 border border-gray-600/30">
      <h3 className="text-xl font-bold text-gray-100 mb-6 flex items-center gap-2">
        <span>💬</span>
        コメント ({comments.length})
      </h3>
      
      {/* 新しいコメント投稿フォーム */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="作品についてコメントしてみませんか？"
          className="w-full bg-gray-700/50 text-gray-100 rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-3"
          rows={4}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            コメント投稿
          </button>
        </div>
      </form>
      
      {/* コメント一覧 */}
      <div className="space-y-0">
        {comments.length > 0 ? (
          comments.map((comment) => renderComment(comment))
        ) : (
          <div className="text-center py-8 text-gray-500">
            まだコメントがありません。最初のコメントを投稿してみませんか？
          </div>
        )}
      </div>
    </div>
  )
}