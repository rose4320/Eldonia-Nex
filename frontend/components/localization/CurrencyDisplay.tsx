'use client';

import { useEffect, useState } from 'react';

interface CurrencyDisplayProps {
  amount: number;
  fromCurrency?: string;
}

export default function CurrencyDisplay({ amount, fromCurrency = 'JPY' }: CurrencyDisplayProps) {
  const [displayAmount, setDisplayAmount] = useState(amount);
  const [currencySymbol, setCurrencySymbol] = useState('¥');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency]);

  const convertCurrency = async () => {
    try {
      const token = localStorage.getItem('authToken');
      let userCurrency = 'JPY';

      // Get user's preferred currency
      if (token) {
        const response = await fetch('http://localhost:8000/api/v1/localization/users/me/locale/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          userCurrency = data.preferred_currency;
        }
      }

      // If same currency, no conversion needed
      if (fromCurrency === userCurrency) {
        setDisplayAmount(amount);
        setCurrencySymbol(getCurrencySymbol(userCurrency));
        setLoading(false);
        return;
      }

      // Convert currency
      const convertResponse = await fetch('http://localhost:8000/api/v1/localization/currencies/convert/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          from_currency: fromCurrency,
          to_currency: userCurrency,
        }),
      });

      if (convertResponse.ok) {
        const data = await convertResponse.json();
        setDisplayAmount(parseFloat(data.converted_amount));
        setCurrencySymbol(getCurrencySymbol(userCurrency));
      } else {
        // Fallback to original amount
        setDisplayAmount(amount);
        setCurrencySymbol(getCurrencySymbol(fromCurrency));
      }
    } catch (error) {
      console.error('Currency conversion failed:', error);
      setDisplayAmount(amount);
      setCurrencySymbol(getCurrencySymbol(fromCurrency));
    } finally {
      setLoading(false);
    }
  };

  const getCurrencySymbol = (code: string): string => {
    const symbols: { [key: string]: string } = {
      'JPY': '¥',
      'USD': '$',
      'EUR': '€',
      'KRW': '₩',
      'CNY': '¥',
      'TWD': 'NT$',
    };
    return symbols[code] || code;
  };

  const formatAmount = (value: number, currency: string): string => {
    const decimals = ['JPY', 'KRW', 'TWD'].includes(currency) ? 0 : 2;
    return value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  if (loading) {
    return <span className="text-gray-400">...</span>;
  }

  return (
    <span className="font-semibold">
      {currencySymbol}{formatAmount(displayAmount, fromCurrency)}
    </span>
  );
}
