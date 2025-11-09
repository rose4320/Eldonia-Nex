'use client'

import React from 'react'

// UI/UX設計書準拠：EXPバーコンポーネント
interface ExperienceBarProps {
  level: number
  current: number
  max: number
  showDetails?: boolean
  className?: string
}

const ExperienceBar: React.FC<ExperienceBarProps> = ({
  level,
  current,
  max,
  showDetails = true,
  className = ''
}) => {
  // 進捗率計算（0-1）
  const progress = Math.min(current / max, 1)
  const progressPercentage = Math.round(progress * 100)

  // 次レベルまでの残りEXP
  const remainingExp = Math.max(max - current, 0)

  // プログレスバー用の視覚的表現
  const getProgressBlocks = (total: number = 10) => {
    const filledBlocks = Math.floor(progress * total)
    const blocks = []
    
    for (let i = 0; i < total; i++) {
      blocks.push(i < filledBlocks ? '■' : '□')
    }
    
    return blocks.join('')
  }

  return (
    <div className={`exp-bar-container ${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between text-xs mb-1">
          {/* レベル表示 */}
          <span className="text-purple-400 font-bold">
            Lv.{level}
          </span>
          
          {/* EXP数値 */}
          <span className="text-gray-400">
            {current.toLocaleString()}/{max.toLocaleString()} EXP
          </span>
        </div>
      )}

      {/* プログレスバー */}
      <div className="exp-bar">
        <div 
          className="exp-bar-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {showDetails && (
        <div className="flex items-center justify-between text-xs mt-1 text-gray-500">
          {/* 視覚的プログレス */}
          <span className="font-mono text-[10px] tracking-wider">
            {getProgressBlocks()}
          </span>
          
          {/* 残りEXP */}
          <span>
            残り{remainingExp.toLocaleString()} EXP
          </span>
        </div>
      )}

      {/* レベルアップ予告 */}
      {remainingExp <= max * 0.1 && remainingExp > 0 && (
        <div className="mt-1 text-xs text-yellow-400 flex items-center space-x-1">
          <span>⭐</span>
          <span>レベルアップまであと少し！</span>
        </div>
      )}
    </div>
  )
}

export default ExperienceBar