'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const languages = [
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'ja', flag: '🇯🇵', name: '日本語' },
  { code: 'ko', flag: '🇰🇷', name: '한국어' },
  { code: 'zh-CN', flag: '🇨🇳', name: '简体中文' },
  { code: 'zh-TW', flag: '🇹🇼', name: '繁體中文' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Get current locale from pathname or default to 'ja'
  const pathParts = pathname.split('/').filter(Boolean);
  const possibleLocale = pathParts[0];
  const isLocaleInPath = ['en', 'ja', 'ko', 'zh-CN', 'zh-TW'].includes(possibleLocale);
  const currentLocale = isLocaleInPath ? possibleLocale : 'ja';
  const currentLang = languages.find((lang) => lang.code === currentLocale) || languages[1]; // Default to Japanese

  const handleLanguageChange = (langCode: string) => {
    // Remove current locale from pathname if it exists
    let pathWithoutLocale = pathname;
    if (isLocaleInPath) {
      pathWithoutLocale = '/' + pathParts.slice(1).join('/');
    }
    if (!pathWithoutLocale || pathWithoutLocale === '/') {
      pathWithoutLocale = '/';
    }
    
    // For Japanese (default), no prefix needed
    // For other languages, add prefix
    if (langCode === 'ja') {
      router.push(pathWithoutLocale);
    } else {
      router.push(`/${langCode}${pathWithoutLocale}`);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        <span className="text-2xl">{currentLang.flag}</span>
        <span className="text-white text-sm font-medium">{currentLang.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-20">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  lang.code === currentLang.code ? 'bg-gray-700' : ''
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="text-white text-sm font-medium">{lang.name}</span>
                  <span className="text-gray-400 text-xs">{lang.code}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
