'use client'

import React from 'react'

interface PageHeroProps {
  title: string
  subtitle?: string
  description?: string
  backgroundOpacity?: number
}

const PageHero: React.FC<PageHeroProps> = ({ 
  title, 
  subtitle, 
  description,
  backgroundOpacity = 5 
}) => {
  return (
    <div className="relative mb-12 text-center">
      {/* 背景装飾 */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-900/5 via-blue-900/5 to-emerald-900/5 rounded-2xl backdrop-blur-xl"></div>
      <div className="absolute top-2 left-1/3 w-16 h-16 bg-amber-400/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-2 right-1/3 w-20 h-20 bg-orange-400/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-yellow-400/10 rounded-full blur-xl"></div>
      
      <div className="relative z-10 py-8">
        {/* メインタイトル - 黄色→オレンジのグラデーション */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <h1 className="page-title text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
        </div>
        
        {/* サブタイトル（オプショナル） */}
        {subtitle && (
          <div className="page-subtitle text-base md:text-lg text-gray-300/90 leading-relaxed mb-4">
            {subtitle}
          </div>
        )}
        
        {/* ディスクリプション（オプショナル） */}
        {description && (
          <div className="max-w-3xl mx-auto">
            <p className="text-sm md:text-base text-gray-400 leading-relaxed">
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PageHero
