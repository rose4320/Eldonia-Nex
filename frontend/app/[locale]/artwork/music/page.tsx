'use client'

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import PageHero from '../../../components/common/PageHero'
import PlaceholderImage from '../../../components/common/PlaceholderImage'
import { MusicArtwork } from '../../../types/artwork'
// import { Comment, Review, ReviewStats } from '../../../types/artwork' // 将来のコメント・レビュー機能用

import { Suspense } from 'react'

const MusicDetailPageInner: React.FC = () => {
  const [artwork, setArtwork] = useState<MusicArtwork | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  // const [comments, setComments] = useState<Comment[]>([]) // 将来のコメント機能用
  // const [reviews, setReviews] = useState<Review[]>([]) // 将来のレビュー機能用
  // const [reviewStats, setReviewStats] = useState<ReviewStats>({ // 将来のレビュー統計用
  //   averageRating: 0,
  //   totalReviews: 0,
  //   ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  // })
  const audioRef = useRef<HTMLAudioElement>(null)
  const searchParams = useSearchParams()
  const artworkId = searchParams.get('id')

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!artworkId) return
      
      setLoading(true)
      try {
        // モックデータ
        const mockArtwork: MusicArtwork = {
          id: artworkId,
          title: '夜の街角',
          author: 'ミュージシャン花子',
          authorLevel: 30,
          category: '音楽',
          price: 800,
          isFree: false,
          likes: 789,
          views: 2345,
          tags: ['ジャズ', '夜', 'アンビエント'],
          description: '静寂な夜の街角をイメージしたジャズ楽曲です。',
          license: '個人利用のみ',
          createdAt: '2024-01-20',
          updatedAt: '2024-01-20',
          audioUrl: '/placeholder-audio.mp3',
          duration: 180,
          fileFormat: 'MP3',
          fileSize: '8.5MB',
          bitrate: '320kbps',
          sampleRate: '44.1kHz',
          genre: 'Jazz',
          bpm: 85,
          key: 'A minor'
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

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const handleEnd = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('ended', handleEnd)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('ended', handleEnd)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const time = parseFloat(e.target.value)
    audio.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleDownload = () => {
    if (!artwork) return
    console.log('Downloading music:', artwork.id)
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
          
          {/* 音楽プレイヤーエリア */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-8 border border-gray-600/30">
              
              {/* アルバムアートワーク */}
              <div className="w-full max-w-md mx-auto mb-8">
                <PlaceholderImage
                  width={400}
                  height={400}
                  text={artwork.title}
                  className="aspect-square rounded-xl object-cover"
                />
              </div>

              {/* 音楽コントロール */}
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-100 mb-2">{artwork.title}</h2>
                  <p className="text-lg text-gray-400">by {artwork.author}</p>
                  {artwork.genre && (
                    <p className="text-sm text-indigo-400 mt-1">{artwork.genre}</p>
                  )}
                </div>

                {/* プログレスバー */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={artwork.duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(artwork.duration)}</span>
                  </div>
                </div>

                {/* 再生コントロール */}
                <div className="flex items-center justify-center gap-6">
                  <button className="p-3 text-gray-400 hover:text-white transition-colors">
                    ⏮️
                  </button>
                  <button
                    onClick={togglePlay}
                    className="p-4 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors text-xl"
                  >
                    {isPlaying ? '⏸️' : '▶️'}
                  </button>
                  <button className="p-3 text-gray-400 hover:text-white transition-colors">
                    ⏭️
                  </button>
                </div>

                {/* ボリューム */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-gray-400 text-sm w-8">{Math.round(volume * 100)}</span>
                </div>
              </div>

              {/* 隠しオーディオ要素 */}
              <audio ref={audioRef} src={artwork.audioUrl} preload="metadata" />
            </div>
          </div>

          {/* 詳細情報エリア */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-6 border border-gray-600/30 mb-6">
              <h3 className="text-xl font-bold text-gray-100 mb-4">楽曲詳細</h3>
              
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
                  <span className="text-gray-400">長さ</span>
                  <span className="text-gray-200">{formatTime(artwork.duration)}</span>
                </div>
                {artwork.bitrate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">ビットレート</span>
                    <span className="text-gray-200">{artwork.bitrate}</span>
                  </div>
                )}
                {artwork.sampleRate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">サンプルレート</span>
                    <span className="text-gray-200">{artwork.sampleRate}</span>
                  </div>
                )}
                {artwork.bpm && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">BPM</span>
                    <span className="text-gray-200">{artwork.bpm}</span>
                  </div>
                )}
                {artwork.key && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">キー</span>
                    <span className="text-gray-200">{artwork.key}</span>
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
                  <span className="text-gray-400">🎧 再生回数</span>
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
          <h3 className="text-xl font-bold text-gray-100 mb-4">楽曲について</h3>
          <p className="text-gray-300 leading-relaxed">{artwork.description}</p>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #6366f1;
          border-radius: 50%;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #6366f1;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}

const MusicDetailPage: React.FC = () => (
  <Suspense>
    <MusicDetailPageInner />
  </Suspense>
)

export default MusicDetailPage