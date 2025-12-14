'use client';

import { useAuth } from '@/app/context/AuthContext';
import EventForm from '@/components/events/EventForm';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreateEventPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  const handleSubmit = async (eventData: any) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Events API エンドポイント
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      
      const response = await fetch(`${API_BASE_URL}/events/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
        credentials: 'include',
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const createdEvent = await response.json();
        setMessage({ type: 'success', text: 'イベントが作成されました!' });
        setTimeout(() => {
          router.push(`/events/${createdEvent.id}`);
        }, 1500);
      } else if (response.status === 403) {
        // プラン制限エラーの場合
        const errorData = await response.json();
        setMessage({ 
          type: 'error', 
          text: errorData.detail || 'プラン制限によりイベントを作成できません。' 
        });
        // ページをスクロールしてプラン情報を表示
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const errorData = await response.json();
        setMessage({ 
          type: 'error', 
          text: errorData.detail || 'イベントの作成に失敗しました。' 
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setMessage({ type: 'error', text: 'サーバーエラーが発生しました。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 py-12">
      <ThemeToggle />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 mb-4">
            ✨ イベントを作成
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-200">
            新しいイベントを企画して、参加者を募集しましょう
          </p>
        </div>

        {/* メッセージ */}
        {message && (
          <div
            className={`mb-8 p-5 rounded-xl shadow-lg ${
              message.type === 'success'
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 text-green-800 dark:text-green-200 border-2 border-green-300 dark:border-green-600'
                : 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900 dark:to-rose-900 text-red-800 dark:text-red-200 border-2 border-red-300 dark:border-red-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {message.type === 'success' ? '✅' : '❌'}
              </span>
              <span className="text-lg font-semibold">{message.text}</span>
            </div>
          </div>
        )}

        {/* プラン制限情報 */}
        <div className="mb-8">
          <PlanLimitsInfo />
        </div>

        {/* イベント作成フォーム */}

        {/* フォーム */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-8">
          <EventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
