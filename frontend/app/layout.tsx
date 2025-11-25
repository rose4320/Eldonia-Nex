import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_JP, PT_Serif } from "next/font/google";

import Layout from "../components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";

// UI/UX設計書準拠：ブランドフォント
const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// UI/UX設計書準拠：プライマリフォント
const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// UI/UX設計書準拠：コードフォント
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eldonia-Nex - クリエイターのための創作プラットフォーム",
  description: "すべてのクリエイターが自由に表現し、正当な評価と収益を得られる世界の実現",
  keywords: ["creative", "platform", "artwork", "streaming", "marketplace", "japan"],
  openGraph: {
    title: "Eldonia-Nex - Creative Platform",
    description: "クリエイター向け総合プラットフォーム",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <body
        className={`${ptSerif.variable} ${notoSansJP.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased bg-gray-900 text-gray-100`}
      >
        <AuthProvider>
          <Layout>
            {children}
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
