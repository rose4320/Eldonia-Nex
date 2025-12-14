'use client'

import { ReactNode, createContext, useContext } from 'react'

// 翻訳メッセージの型
type Messages = Record<string, Record<string, string>>

interface TranslationContextType {
  locale: string
  messages: Messages
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | null>(null)

interface TranslationProviderProps {
  children: ReactNode
  locale: string
  messages: Messages
}

export function TranslationProvider({ children, locale, messages }: TranslationProviderProps) {
  // 翻訳関数：'common.welcome' のようなキーを受け取って翻訳を返す
  const t = (key: string): string => {
    const keys = key.split('.')
    if (keys.length === 2) {
      const [namespace, msgKey] = keys
      return messages[namespace]?.[msgKey] || key
    }
    return key
  }

  return (
    <TranslationContext.Provider value={{ locale, messages, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    // コンテキストがない場合のフォールバック
    return {
      locale: 'ja',
      messages: {},
      t: (key: string) => key
    }
  }
  return context
}

