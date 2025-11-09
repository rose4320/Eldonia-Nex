'use client'

import Link from 'next/link'
import React from 'react'
import { Artwork } from '../../types/artwork'

interface ArtworkRoutingProps {
  artwork: Artwork
}

const ArtworkRouting: React.FC<ArtworkRoutingProps> = ({ artwork }) => {
  const getRouteByCategory = (category: string, id: string) => {
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
        return `/artwork/image?id=${id}` // 3Dも画像ビューアーで表示
      default:
        return `/artwork/image?id=${id}` // デフォルトは画像
    }
  }

  const route = getRouteByCategory(artwork.category, artwork.id)

  return (
    <Link 
      href={route}
      className="block w-full h-full transition-transform hover:scale-105 duration-300"
    >
      {/* 既存の作品カードコンテンツをここに配置 */}
    </Link>
  )
}

export default ArtworkRouting

// 作品カードクリック時のルーティングヘルパー関数
export const navigateToArtworkDetail = (artwork: Artwork) => {
  const route = getArtworkRoute(artwork.category, artwork.id)
  window.location.href = route
}

export const getArtworkRoute = (category: string, id: string) => {
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