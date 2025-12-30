/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSR最適化設定
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000'],
    },
  },

  // Django APIバックエンドとの連携
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*', // Django API
      },
    ];
  },

  // 画像最適化 (remotePatterns使用)
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '172.16.0.2',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // パフォーマンス最適化
  compress: true,
  poweredByHeader: false,

  // 環境変数
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://127.0.0.1:3000',
  },
};

export default nextConfig;

