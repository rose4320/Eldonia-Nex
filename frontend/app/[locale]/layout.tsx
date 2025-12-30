import type { Metadata } from "next";
import Layout from "../../components/layout/Layout";
import { AuthProvider } from "../context/AuthContext";
import { TranslationProvider } from "../context/TranslationContext";
// メッセージファイルをインポート
import enMessages from '../../messages/en.json';
import jaMessages from '../../messages/ja.json';
import koMessages from '../../messages/ko.json';
import zhCNMessages from '../../messages/zh-CN.json';
import zhTWMessages from '../../messages/zh-TW.json';

const messagesMap: Record<string, typeof jaMessages> = {
  en: enMessages,
  ja: jaMessages,
  ko: koMessages,
  'zh-CN': zhCNMessages,
  'zh-TW': zhTWMessages,
};

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

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = messagesMap[locale] || messagesMap.ja;

  return (
    <html lang={locale}>
      <body>
        <TranslationProvider locale={locale} messages={messages}>
          <AuthProvider>
            <Layout>
              {children}
            </Layout>
          </AuthProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
