'use client'

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import PageHero from '../../../components/common/PageHero'
import { VideoArtwork } from '../../../types/artwork'
// import { Comment, Review, ReviewStats } from '../../../types/artwork' // 将来のコメント・レビュー機能用

import { Suspense } from 'react'

const VideoDetailPageInner: React.FC = () => {
  const [artwork, setArtwork] = useState<VideoArtwork | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const searchParams = useSearchParams()
  const artworkId = searchParams.get('id')

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!artworkId) return
      
      setLoading(true)
      try {
        // モックデータ
        const mockArtwork: VideoArtwork = {
          id: artworkId,
          title: 'ショートフィルム作品',
          author: 'ビデオクリエーター',
          authorLevel: 35,
          category: '動画',
          price: 2000,
          isFree: false,
          likes: 123,
          views: 890,
          tags: ['ショートフィルム', 'ドラマ', 'アート'],
          description: 'モノクロームで表現された短編映画作品。',
          license: '商用利用可',
          createdAt: '2024-01-25',
          updatedAt: '2024-01-25',
          videoUrl: '/placeholder-video.mp4',
          thumbnailUrl: '/placeholder-thumbnail.jpg',
          fileFormat: 'MP4',
          fileSize: '45.8MB',
          duration: 300,
          resolution: {
            width: 1280,
            height: 720
          },
          frameRate: 30,
          bitrate: '1000kbps',
          hasSubtitles: true
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

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!document.fullscreenElement) {
      video.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatResolution = () => {
    if (!artwork) return ''
    const { width, height } = artwork.resolution
    if (height >= 2160) return '4K'
    if (height >= 1440) return 'QHD'
    if (height >= 1080) return 'Full HD'
    if (height >= 720) return 'HD'
    return `${width}×${height}`
  }

  const handleDownload = () => {
    if (!artwork) return
    console.log('Downloading video:', artwork.id)
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
          
          {/* 動画プレイヤーエリア */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-6 border border-gray-600/30">
              <div 
                className="relative bg-black rounded-lg overflow-hidden group"
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
              >
                <video
                  ref={videoRef}
                  src={artwork.videoUrl}
                  poster={artwork.thumbnailUrl}
                  className="w-full aspect-video"
                  onClick={togglePlay}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                {/* 動画コントロール */}
                <div 
                  className={`absolute inset-0 bg-linear-to-t from-black/60 to-transparent transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {/* 中央再生ボタン */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={togglePlay}
                      className="p-4 bg-white/20 backdrop-blur-sm rounded-full text-white text-3xl hover:bg-white/30 transition-colors"
                    >
                      {isPlaying ? '⏸️' : '▶️'}
                    </button>
                  </div>

                  {/* 下部コントロールバー */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    
                    <div className="flex-1 text-white text-sm">
                      0:00 / {formatTime(artwork.duration)}
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="text-white hover:text-gray-300 transition-colors">
                        🔊
                      </button>
                      <button className="text-white hover:text-gray-300 transition-colors">
                        ⚙️
                      </button>
                      <button
                        onClick={toggleFullscreen}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        🔳
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 詳細情報エリア */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-6 border border-gray-600/30 mb-6">
              <h3 className="text-xl font-bold text-gray-100 mb-4">動画詳細</h3>
              
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
                <div className="flex justify-between">
                  <span className="text-gray-400">解像度</span>
                  <span className="text-gray-200">{formatResolution()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">実解像度</span>
                  <span className="text-gray-200">{artwork.resolution.width} × {artwork.resolution.height}</span>
                </div>
                {artwork.frameRate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">フレームレート</span>
                    <span className="text-gray-200">{artwork.frameRate} fps</span>
                  </div>
                )}
                {artwork.bitrate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">ビットレート</span>
                    <span className="text-gray-200">{artwork.bitrate}</span>
                  </div>
                )}
                {artwork.hasSubtitles && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">字幕</span>
                    <span className="text-gray-200">あり</span>
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
                  <span className="text-gray-400">📺 再生回数</span>
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
          <h3 className="text-xl font-bold text-gray-100 mb-4">動画について</h3>
          <p className="text-gray-300 leading-relaxed">{artwork.description}</p>
        </div>
      </div>
    </div>
  )
}

const VideoDetailPage: React.FC = () => (
  <Suspense>
    <VideoDetailPageInner />
  </Suspense>
)

export default VideoDetailPage