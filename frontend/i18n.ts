import { getRequestConfig } from 'next-intl/server';

// サポートされる言語のリスト
export const locales = ['en', 'ja', 'ko', 'zh-CN', 'zh-TW'];

export default getRequestConfig(async ({ locale }) => {
  // ロケールの検証
  const validLocale = (locale && locales.includes(locale)) ? locale : 'ja';

  return {
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
});
