import { Metadata } from 'next'
import HomeContent from '../../components/home/HomeContent'

// 要件定義書に基づくメタデータ設定
export const metadata: Metadata = {
  title: 'Eldonia-Nex - クリエイターのための創作プラットフォーム',
  description: 'すべてのクリエイターが自由に表現し、正当な評価と収益を得られる世界の実現',
  keywords: ['creative', 'platform', 'artwork', 'streaming', 'marketplace', 'japan'],
  openGraph: {
    title: 'Eldonia-Nex - Creative Platform',
    description: 'クリエイター向け総合プラットフォーム',
    type: 'website',
    locale: 'ja_JP',
  },
}

// Django APIからシステム状況取得（SSR）
async function getSystemStatus() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
  
  try {
    // タイムアウト設定付きfetch
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3秒タイムアウト
    
    const res = await fetch(`${API_URL}/health/`, {
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
    
    clearTimeout(timeoutId)
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }
    
    const data = await res.json()
    return {
      status: 'healthy',
      message: 'Backend running normally',
      ssr_ready: true,
      timestamp: new Date().toISOString(),
      ...data
    }
  } catch (error: unknown) {
    const err = error as Error
    console.warn('Django API connection error:', err.message)
    
    let message = 'Could not connect to backend'
    if (err.name === 'AbortError') {
      message = 'Backend connection timeout (3s)'
    } else if ('code' in err && (err as NodeJS.ErrnoException).code === 'ECONNREFUSED') {
      message = 'Backend server is not running'
    } else if (err.message.includes('HTTP')) {
      message = `Backend error: ${err.message}`
    }
    
    return { 
      status: 'error', 
      message,
      ssr_ready: false,
      timestamp: new Date().toISOString(),
      error_type: err.name || 'UnknownError'
    }
  }
}

// Eldonia-Nex メインページ（SSR）
export default async function EldoniaNexHomePage() {
  const systemStatus = await getSystemStatus()

  return <HomeContent systemStatus={systemStatus} />
}