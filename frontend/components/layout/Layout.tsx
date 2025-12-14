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

  // アバターURLを絶対URLに変換する関数
  const getFullAvatarUrl = (avatarUrl: string | undefined): string | undefined => {
    if (!avatarUrl) return undefined;
    // 既に絶対URLの場合はそのまま返す
    if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
      return avatarUrl;
    }
    // 相対パスの場合はバックエンドのURLを付加
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const backendHost = hostname === 'localhost' || hostname === '127.0.0.1' 
        ? 'http://localhost:8000' 
        : `http://${hostname}:8000`;
      return `${backendHost}${avatarUrl}`;
    }
    return `http://localhost:8000${avatarUrl}`;
  };

  // #region agent log
  React.useEffect(() => {
    const fullAvatarUrl = getFullAvatarUrl(user?.avatar_url);
    fetch('http://127.0.0.1:7242/ingest/2148f5d5-b79c-45af-b96a-f0f3df0f7982',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Layout.tsx:useEffect',message:'User data in Layout',data:{hasUser:!!user,avatar_url:user?.avatar_url,fullAvatarUrl,username:user?.username,display_name:user?.display_name},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
  }, [user]);
  // #endregion
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
              name: user.display_name || user.username,
              level: user.level || 1,
              currentExp: user.exp || 0,
              maxExp: 100,
              avatar: getFullAvatarUrl(user.avatar_url)
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