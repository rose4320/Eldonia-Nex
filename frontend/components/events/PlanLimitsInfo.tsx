'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface PlanLimits {
  subscription_plan: string;
  max_events_per_month: number | null;
  events_created_this_month: number;
  remaining_events_this_month: number | null;
  max_capacity: number | null;
  can_use_paid_events: boolean;
  can_use_advanced_features: boolean;
  description: string;
}

export default function PlanLimitsInfo() {
  const t = useTranslations('plan');
  const [limits, setLimits] = useState<PlanLimits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlanLimits();
  }, []);

  const fetchPlanLimits = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${API_BASE_URL}/users/plan-limits/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLimits(data);
      }
    } catch (error) {
      console.error('Failed to fetch plan limits:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-700 rounded-xl animate-pulse">
        <div className="w-3/4 h-6 mb-2 bg-blue-200 rounded dark:bg-blue-700"></div>
        <div className="w-1/2 h-4 bg-blue-200 rounded dark:bg-blue-700"></div>
      </div>
    );
  }

  if (!limits) {
    return null;
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'pro':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'premium':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getProgressColor = () => {
    if (limits.remaining_events_this_month === null) return 'bg-green-500';
    const percentage = (limits.events_created_this_month / (limits.max_events_per_month || 1)) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const isLimitReached = limits.remaining_events_this_month !== null && limits.remaining_events_this_month <= 0;

  return (
    <div className={`rounded-xl p-6 border-2 shadow-lg ${
      isLimitReached 
        ? 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700' 
        : 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
          <span>💎</span>
          {t('currentPlan')}
        </h3>
        <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${getPlanBadgeColor(limits.subscription_plan)}`}>
          {t(limits.subscription_plan as 'free' | 'premium' | 'pro')}
        </span>
      </div>

      {/* 月間イベント作成数 */}
      {limits.max_events_per_month !== null ? (
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('thisMonth')}
            </span>
            <span className={`text-sm font-bold ${isLimitReached ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
              {limits.events_created_this_month} / {limits.max_events_per_month}
            </span>
          </div>
          <div className="w-full h-3 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className={`h-full ${getProgressColor()} transition-all duration-300`}
              style={{ width: `${Math.min((limits.events_created_this_month / limits.max_events_per_month) * 100, 100)}%` }}
            ></div>
          </div>
          {isLimitReached && (
            <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400">
              ⚠️ {t('limitReached')}
            </p>
          )}
        </div>
      ) : (
        <div className="mb-4">
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
            ✨ {t('unlimited')}のイベント作成が可能です
          </span>
        </div>
      )}

      {/* プラン制限の詳細 */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400">{t('maxCapacity')}:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {limits.max_capacity === null ? t('unlimited') : `${limits.max_capacity}名`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400">{t('paidEventsAllowed')}:</span>
          <span className={`font-semibold ${limits.can_use_paid_events ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {limits.can_use_paid_events ? '✅ 可能' : '❌ 不可'}
          </span>
        </div>
      </div>

      {/* アップグレード促進 */}
      {limits.subscription_plan === 'free' && (
        <div className="pt-4 mt-4 border-t-2 border-blue-300 dark:border-blue-700">
          <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
            より多くのイベントを作成したいですか？
          </p>
          <button className="w-full px-4 py-2 font-bold text-white transition-all duration-200 transform rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105">
            {t('upgrade')}
          </button>
        </div>
      )}
    </div>
  );
}
