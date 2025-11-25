'use client'

import { usePathname } from 'next/navigation';
import React from 'react';
import { useAuth } from '../../app/context/AuthContext';
import Footer from './Footer';
import Header from './Header';

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
  const { user } = useAuth();
  const pathname = usePathname() || '';
  const hideFooterPaths = [
    '/community/groupwork/deep',
    '/community/groupwork/deep/'
  ];
  const shouldHideFooter = hideFooterPaths.some(p => pathname.startsWith(p));

  React.useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} - Eldonia-Nex`
    }
  }, [pageTitle])

  return (
      <div className={`min-h-screen flex flex-col bg-gray-900 text-gray-100 ${className}`}>
        {/* Header (固定88px) */}
        {showHeader && (
          <Header
            {...headerProps}
            isAuthenticated={!!user}
            user={user ? {
              name: user.username,
              level: 1,
              currentExp: 0,
              maxExp: 100,
              avatar: undefined
            } : undefined}
          />
        )}
        {/* Main Content (可変) */}
        <main
          className={`flex-1 min-h-screen ${shouldHideFooter ? 'pt-0' : 'pt-[95px]'}`}
          style={{ minHeight: 'calc(100vh - 64px - 320px)' }}
        >
          {children}
        </main>
        {/* Footer (最小320px) */}
        {(!shouldHideFooter && showFooter) && <Footer {...footerProps} />}
      </div>
  )
}

export default Layout