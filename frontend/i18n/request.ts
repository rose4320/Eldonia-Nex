import { getRequestConfig } from 'next-intl/server';

// サポートされる言語のリスト
export const locales = ['en', 'ja', 'ko', 'zh-CN', 'zh-TW'];

export default getRequestConfig(async ({ locale }) => {
  // ロケールの検証
  if (!locale || !locales.includes(locale as any)) {
    locale = 'ja'; // デフォルトロケール
  }

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
