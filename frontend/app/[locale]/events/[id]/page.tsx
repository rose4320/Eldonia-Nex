'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Event {
  id: number;
  title: string;
  description: string;
  event_type: string;
  venue_name: string;
  venue_address: string;
  start_datetime: string;
  end_datetime: string;
  timezone: string;
  capacity: number;
  is_free: boolean;
  status: string;
  organizer_name: string;
  organizer_id: number;
  tickets: any[];
  created_at: string;
}

export default function EventDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:8001/api/v1/events/${eventId}/`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        } else {
          setError('イベントが見つかりませんでした。');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('イベントの読み込みに失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePublish = async () => {
    if (!event || !user) return;

    try {
      const response = await fetch(`http://localhost:8001/api/v1/events/${event.id}/publish/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setEvent(updatedEvent);
        alert('イベントを公開しました！');
      } else {
        alert('公開に失敗しました。');
      }
    } catch (error) {
      console.error('Error publishing event:', error);
      alert('エラーが発生しました。');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl">{error || 'イベントが見つかりません'}</p>
          <button
            onClick={() => router.push('/events')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            イベント一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  const isOrganizer = user && user.id === event.organizer_id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
          >
            <span>←</span> 戻る
          </button>
        </div>

        {/* イベント情報 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* ステータスバッジ */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">{event.title}</h1>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  event.status === 'published'
                    ? 'bg-green-500 text-white'
                    : event.status === 'cancelled'
                    ? 'bg-red-500 text-white'
                    : 'bg-yellow-500 text-white'
                }`}
              >
                {event.status === 'published'
                  ? '公開中'
                  : event.status === 'cancelled'
                  ? 'キャンセル'
                  : '下書き'}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* 主催者情報 */}
            <div className="flex items-center gap-2 text-gray-600">
              <span>👤</span>
              <span>主催: {event.organizer_name}</span>
            </div>

            {/* 開催情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-sm text-gray-500">開始</p>
                  <p className="text-gray-900 font-medium">{formatDateTime(event.start_datetime)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏁</span>
                <div>
                  <p className="text-sm text-gray-500">終了</p>
                  <p className="text-gray-900 font-medium">{formatDateTime(event.end_datetime)}</p>
                </div>
              </div>
            </div>

            {/* 会場情報 */}
            {event.event_type === 'venue' && (
              <div className="flex items-start gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-sm text-gray-500">会場</p>
                  <p className="text-gray-900 font-medium">{event.venue_name}</p>
                  {event.venue_address && (
                    <p className="text-gray-600 text-sm">{event.venue_address}</p>
                  )}
                </div>
              </div>
            )}

            {event.event_type === 'online' && (
              <div className="flex items-start gap-3">
                <span className="text-2xl">💻</span>
                <div>
                  <p className="text-sm text-gray-500">開催形式</p>
                  <p className="text-gray-900 font-medium">オンライン</p>
                </div>
              </div>
            )}

            {/* 収容人数 */}
            <div className="flex items-start gap-3">
              <span className="text-2xl">👥</span>
              <div>
                <p className="text-sm text-gray-500">収容人数</p>
                <p className="text-gray-900 font-medium">{event.capacity}名</p>
              </div>
            </div>

            {/* 参加費 */}
            <div className="flex items-start gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <p className="text-sm text-gray-500">参加費</p>
                <p className="text-gray-900 font-medium">
                  {event.is_free ? '無料' : '有料'}
                </p>
              </div>
            </div>

            {/* 説明 */}
            {event.description && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">イベント詳細</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
              </div>
            )}

            {/* 主催者用アクション */}
            {isOrganizer && (
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">主催者メニュー</h3>
                <div className="flex gap-4">
                  {event.status === 'draft' && (
                    <button
                      onClick={handlePublish}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      イベントを公開
                    </button>
                  )}
                  <button
                    onClick={() => router.push(`/events/${event.id}/edit`)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    編集
                  </button>
                </div>
              </div>
            )}

            {/* 参加ボタン */}
            {!isOrganizer && event.status === 'published' && (
              <div className="border-t pt-6 mt-6">
                <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold text-lg">
                  このイベントに参加する
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
