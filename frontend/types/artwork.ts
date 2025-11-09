// 作品の共通型定義
export interface BaseArtwork {
  id: string
  title: string
  author: string
  authorLevel: number
  category: string
  price: number
  isFree: boolean
  likes: number
  views: number
  tags: string[]
  description: string
  license: string
  createdAt: string
  updatedAt: string
}

// 画像作品の型定義
export interface ImageArtwork extends BaseArtwork {
  category: 'イラスト' | '写真'
  imageUrl: string
  fileFormat: 'JPEG' | 'PNG' | 'GIF' | 'WEBP' | 'SVG'
  fileSize: string
  dimensions: {
    width: number
    height: number
  }
  colorProfile?: string
  dpi?: number
}

// 音楽作品の型定義
export interface MusicArtwork extends BaseArtwork {
  category: '音楽'
  audioUrl: string
  fileFormat: 'MP3' | 'WAV' | 'FLAC' | 'OGG' | 'AAC'
  fileSize: string
  duration: number // 秒
  bitrate?: string
  sampleRate?: string
  genre?: string
  bpm?: number
  key?: string
}

// 動画作品の型定義
export interface VideoArtwork extends BaseArtwork {
  category: '動画'
  videoUrl: string
  thumbnailUrl: string
  fileFormat: 'MP4' | 'AVI' | 'MOV' | 'MKV' | 'WEBM'
  fileSize: string
  duration: number // 秒
  resolution: {
    width: number
    height: number
  }
  frameRate?: number
  bitrate?: string
  hasSubtitles?: boolean
}

// 小説作品の型定義
export interface NovelArtwork extends BaseArtwork {
  category: '創作物'
  content: string
  excerpt: string
  wordCount: number
  chapterCount?: number
  language: string
  genre?: string[]
  isCompleted: boolean
  lastChapter?: {
    number: number
    title: string
    publishedAt: string
  }
}

// すべての作品型のユニオン型
export type Artwork = ImageArtwork | MusicArtwork | VideoArtwork | NovelArtwork

// 作品詳細ページのProps型
export interface ArtworkDetailProps {
  artwork: Artwork
  relatedArtworks?: Artwork[]
}

// コメント・レビュー関連の型定義
export interface Comment {
  id: string
  artworkId: string
  userId: string
  username: string
  userLevel: number
  userAvatar?: string
  content: string
  createdAt: string
  updatedAt?: string
  likes: number
  replies?: Comment[]
  isAuthor?: boolean
}

export interface Review {
  id: string
  artworkId: string
  userId: string
  username: string
  userLevel: number
  userAvatar?: string
  rating: number // 1-5の評価
  title: string
  content: string
  createdAt: string
  updatedAt?: string
  likes: number
  isHelpful: number
  isAuthor?: boolean
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}