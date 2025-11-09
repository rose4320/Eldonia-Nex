'use client'

import React from 'react'

interface PlaceholderImageProps {
  width?: number
  height?: number
  text?: string
  className?: string
  onClick?: () => void
  style?: React.CSSProperties
}

export default function PlaceholderImage({
  width = 800,
  height = 600,
  text = 'IMAGE PLACEHOLDER',
  className = '',
  onClick,
  style
}: PlaceholderImageProps) {
  // 日本語文字を含むテキストに対応するため、URIエンコードを使用
  const svgContent = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#4a5568"/>
    <text x="${width/2}" y="${height/2}" font-family="Arial" font-size="24" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`
  
  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`

  return (
    // SVG data URLのため、Next.js Imageではなく標準のimgを使用
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={svgDataUrl}
      alt={text}
      className={className}
      onClick={onClick}
      style={style}
    />
  )
}