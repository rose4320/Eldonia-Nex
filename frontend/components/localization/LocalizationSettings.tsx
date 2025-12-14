'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Language {
  code: string;
  name: string;
  native_name: string;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export default function LocalizationSettings() {
  const t = useTranslations('settings');
  const router = useRouter();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('ja');
  const [selectedCurrency, setSelectedCurrency] = useState('JPY');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocalizationData();
  }, []);

  const fetchLocalizationData = async () => {
    try {
      // Fetch languages
      const langResponse = await fetch('http://localhost:8000/api/v1/localization/languages/');
      const langData = await langResponse.json();
      setLanguages(langData);

      // Fetch currencies
      const currResponse = await fetch('http://localhost:8000/api/v1/localization/currencies/');
      const currData = await currResponse.json();
      setCurrencies(currData);

      // Fetch user's current settings
      const token = localStorage.getItem('authToken');
      if (token) {
        const userResponse = await fetch('http://localhost:8000/api/v1/localization/users/me/locale/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setSelectedLanguage(userData.preferred_language);
          setSelectedCurrency(userData.preferred_currency);
        }
      }
    } catch (error) {
      console.error('Failed to fetch localization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please login to change language');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/localization/users/me/language/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ language: languageCode }),
      });

      if (response.ok) {
        setSelectedLanguage(languageCode);
        // Refresh the page with new locale
        router.push(`/${languageCode}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update language');
      }
    } catch (error) {
      console.error('Failed to update language:', error);
      alert('Failed to update language');
    }
  };

  const handleCurrencyChange = async (currencyCode: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please login to change currency');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/localization/users/me/currency/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ currency: currencyCode }),
      });

      if (response.ok) {
        setSelectedCurrency(currencyCode);
        // Refresh the page to update currency displays
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update currency');
      }
    } catch (error) {
      console.error('Failed to update currency:', error);
      alert('Failed to update currency');
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">{t('title')}</h2>

      {/* Language Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {t('language')}
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.native_name} ({lang.name})
            </option>
          ))}
        </select>
      </div>

      {/* Currency Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {t('currency')}
        </label>
        <select
          value={selectedCurrency}
          onChange={(e) => handleCurrencyChange(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {currencies.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.symbol} {curr.name} ({curr.code})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
