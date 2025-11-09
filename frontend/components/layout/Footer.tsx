'use client'

import Image from 'next/image'
import React from 'react'

// UI/UX設計書準拠：フッターコンポーネント
interface FooterProps {
  showTechStack?: boolean
  showSiteMap?: boolean
  showPartners?: boolean
  compactMode?: boolean
}

const Footer: React.FC<FooterProps> = ({
  showTechStack = true,
  showSiteMap = true,
  showPartners = true,
  compactMode = false
}) => {
  // TODO: compactMode機能は将来実装予定
  console.log('compactMode:', compactMode); // 一時的な使用
  
  return (
    <footer className="bg-linear-to-r from-gray-900 to-purple-900 text-white py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* 第一段：ブランド・SNS */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Image 
              src="/assets/logo/eldonia-nex-logo.png" 
              alt="Eldonia-Nex Logo" 
              width={48}
              height={48}
              className="object-contain"
            />
            <h4 className="brand-title text-4xl">Eldonia-Nex</h4>
          </div>
          
          {/* SNSリンク */}
          <div className="flex items-center justify-center space-x-6">
            <a href="https://facebook.com" className="text-blue-400 hover:text-blue-300 transition-colors text-2xl" aria-label="Facebook">
              📘
            </a>
            <a href="https://twitter.com" className="text-blue-400 hover:text-blue-300 transition-colors text-2xl" aria-label="Twitter">
              🐦
            </a>
            <a href="https://instagram.com" className="text-pink-400 hover:text-pink-300 transition-colors text-2xl" aria-label="Instagram">
              📷
            </a>
            <a href="https://youtube.com" className="text-red-400 hover:text-red-300 transition-colors text-2xl" aria-label="YouTube">
              📺
            </a>
          </div>
        </div>

        {/* 第二段：3カラム情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 ml-0 md:ml-48">
          {/* 技術スタック */}
          {showTechStack && (
            <div className="px-4 py-2 text-center md:text-left lg:relative">
              <h5 className="text-lg font-bold mb-4 text-yellow-400 lg:-ml-48">🛠️ 技術スタック</h5>
              <div className="space-y-2 text-sm text-gray-300 inline-block md:block max-w-xs md:transform md:-translate-x-48 lg:relative lg:left-12 lg:text-left lg:transform-none">
                <div>
                  <h6 className="font-semibold text-white mb-2">Frontend:</h6>
                  <div className="space-y-1">
                    <div>⚛️ React 18.3+</div>
                    <div>⚡ Next.js 15.0+</div>
                    <div>🎨 TypeScript 5.7+</div>
                    <div>💨 Tailwind CSS</div>
                  </div>
                </div>
                <div className="mt-4">
                  <h6 className="font-semibold text-white mb-2">Backend:</h6>
                  <div className="space-y-1">
                    <div>🟢 Node.js 22 LTS</div>
                    <div>� Django 5.1+</div>
                    <div>�🐘 PostgreSQL 17+</div>
                    <div>⚡ Redis 7.4+</div>
                  </div>
                </div>
                <div className="mt-4">
                  <h6 className="font-semibold text-white mb-2">Infrastructure:</h6>
                  <div className="space-y-1">
                    <div>☁️ AWS/Azure</div>
                    <div>🐳 Docker 27.3+</div>
                    <div>♾️ Kubernetes</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* サイトマップ */}
          {showSiteMap && (
            <div className="px-6 py-2 text-center md:text-left lg:relative">
              <h5 className="text-lg font-bold mb-4 text-blue-400 lg:-ml-48">🗺️ サポート</h5>
              <div className="space-y-2 text-sm text-gray-300 inline-block md:block max-w-xs md:transform md:-translate-x-48 lg:relative lg:left-12 lg:text-left lg:transform-none">
                  <div className="space-y-1">
                    <a href="/contact" className="block hover:text-purple-400 transition-colors">� お問い合わせ</a>
                    <a href="/faq" className="block hover:text-purple-400 transition-colors">❓ よくある質問</a>
                    <a href="/help" className="block hover:text-purple-400 transition-colors">� ヘルプセンター</a>
                    <a href="/tutorials" className="block hover:text-purple-400 transition-colors">🎓 チュートリアル</a>
                    <a href="/community-support" className="block hover:text-purple-400 transition-colors">� コミュニティサポート</a>
                    <a href="/feedback" className="block hover:text-purple-400 transition-colors">� フィードバック</a>
                    <a href="/terms" className="block hover:text-purple-400 transition-colors">� 利用規約</a>
                    <a href="/privacy" className="block hover:text-purple-400 transition-colors">� プライバシーポリシー</a>
                    <a href="/guidelines" className="block hover:text-purple-400 transition-colors">� ガイドライン</a>
                    <a href="/api-docs" className="block hover:text-purple-400 transition-colors">⚡ API ドキュメント</a>
                  </div>
              </div>
            </div>
          )}

          {/* 協力パートナー */}
          {showPartners && (
            <div className="px-6 py-2 text-center md:text-left lg:relative">
              <h5 className="text-lg font-bold mb-4 text-green-400 lg:-ml-48">🤝 協力パートナー</h5>
              <div className="space-y-2 text-sm text-gray-300 inline-block md:block max-w-xs md:transform md:-translate-x-48 lg:relative lg:left-12 lg:text-left lg:transform-none">
                <div>
                  <h6 className="font-semibold text-white mb-2">企業パートナー:</h6>
                  <div className="space-y-1">
                    <div>🏢 テック株式会社</div>
                    <div>🎨 クリエイト合同会社</div>
                    <div>💻 デザインスタジオZ</div>
                  </div>
                </div>
                <div className="mt-4">
                  <h6 className="font-semibold text-white mb-2">個人開発者:</h6>
                  <div className="space-y-1">
                    <div>👤 田中 太郎 (UI/UX)</div>
                    <div>👤 佐藤 花子 (Backend)</div>
                    <div>👤 山田 次郎 (DevOps)</div>
                  </div>
                </div>
                <div className="mt-4">
                  <h6 className="font-semibold text-white mb-2">技術アドバイザー:</h6>
                  <div className="space-y-1">
                    <div>👤 鈴木 三郎 (AI/ML)</div>
                    <div>👤 高橋 四子 (Security)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* コピーライト */}
        <div className="text-center border-t border-gray-600 pt-8">
          <p className="text-gray-400 mb-2">
            © 2025 Eldonia-Nex. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Made with ❤️ by Creative Technology Team
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer