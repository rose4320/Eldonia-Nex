'use client'

import React from 'react'
import Footer from './Footer'
import Header from './Header'

// UI/UX設計書準拠：レイアウトコンポーネント
interface LayoutProps {
  children: React.ReactNode
  pageTitle?: string
  showHeader?: boolean
  showFooter?: boolean
  headerProps?: React.ComponentProps<typeof Header>
  footerProps?: React.ComponentProps<typeof Footer>
  className?: string
}

// レイアウト構造（固定）
const Layout: React.FC<LayoutProps> = ({
  children,
  pageTitle,
  showHeader = true,
  showFooter = true,
  headerProps = {},
  footerProps = {},
  className = ''
}) => {
  React.useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} - Eldonia-Nex`
    }
  }, [pageTitle])

  return (
    <div className={`min-h-screen flex flex-col bg-gray-900 text-gray-100 ${className}`}>
      {/* Header (固定88px) */}
      {showHeader && <Header {...headerProps} />}
      
      {/* Main Content (可変) */}
      <main className="flex-1 min-h-screen pt-[88px]" style={{ minHeight: 'calc(100vh - 64px - 320px)' }}>
        {children}
      </main>
      
      {/* Footer (最小320px) */}
      {showFooter && <Footer {...footerProps} />}
    </div>
  )
}

export default Layout