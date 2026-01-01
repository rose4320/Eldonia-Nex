"use client";

import { useRouter } from 'next/navigation';
import { use, useEffect, useMemo, useState } from 'react';

interface Props {
  params: Promise<{ locale: string; category: string; id: string }>
}

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const getMediaHost = () =>
  process.env.NEXT_PUBLIC_MEDIA_HOST || 'http://localhost:8000';

const getFullMediaUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const host = getMediaHost().replace(/\/$/, '');
  return `${host}${url.startsWith('/') ? url : `/${url}`}`;
};

export default function ArtworkDetailPage({ params }: Props) {
  const { id, locale, category } = use(params);
  const router = useRouter();
  const [artwork, setArtwork] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<{ id?: number; name: string; text: string; createdAt: string }[]>([]);
  const [commentForm, setCommentForm] = useState({ text: '' });
  const [isFan, setIsFan] = useState(false);
  const [isGroupRequested, setIsGroupRequested] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE_URL = getApiBaseUrl();
        const res = await fetch(`${API_BASE_URL}/artworks/${id}/`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        setArtwork(data || null);
      } catch (_) {
        setArtwork(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ローカルステータスのみ復元（コメントはAPI共有）
  useEffect(() => {
    const fanKey = `artwork_fan_${id}`;
    const groupKey = `artwork_group_${id}`;
    const savedFan = typeof window !== 'undefined' ? localStorage.getItem(fanKey) : null;
    const savedGroup = typeof window !== 'undefined' ? localStorage.getItem(groupKey) : null;
    setIsFan(savedFan === '1');
    setIsGroupRequested(savedGroup === '1');
  }, [id]);

  // コメントをAPIから取得
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const API_BASE_URL = getApiBaseUrl();
        const res = await fetch(`${API_BASE_URL}/artworks/${id}/comments/`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        setComments(data.comments || []);
      } catch (_) {
        setComments([]);
      }
    };
    fetchComments();
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.text.trim()) return;
    const defaultName =
      artwork?.viewer_name ||
      artwork?.creator?.display_name ||
      artwork?.creator?.username ||
      'ゲスト';
    const name = defaultName;
    try {
      const API_BASE_URL = getApiBaseUrl();
      const res = await fetch(`${API_BASE_URL}/artworks/${id}/comments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, text: commentForm.text.trim() }),
      });
      if (res.ok) {
        const added = await res.json();
        setComments((prev) => [added, ...(prev || [])]);
        setCommentForm({ text: '' });
      }
    } catch (_) {
      // ignore
    }
  };

  const toggleFan = () => {
    const next = !isFan;
    setIsFan(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`artwork_fan_${id}`, next ? '1' : '0');
    }
  };

  const toggleGroup = () => {
    const next = !isGroupRequested;
    setIsGroupRequested(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`artwork_group_${id}`, next ? '1' : '0');
    }
  };

  const fileUrl = useMemo(
    () => getFullMediaUrl(artwork?.file_url),
    [artwork?.file_url]
  );
  const imageUrl = useMemo(() => {
    return (
      getFullMediaUrl(
        artwork?.image_url || artwork?.thumbnail_url || ''
      ) ||
      getFullMediaUrl(artwork?.file_url) ||
      `https://picsum.photos/seed/${artwork?.id || 'ph'}/800/600`
    );
  }, [artwork?.file_url, artwork?.image_url, artwork?.thumbnail_url]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 gap-4">
        <p>作品が見つかりませんでした。</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          ← 戻る
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <button
          onClick={() => router.back()}
          className="mb-6 text-indigo-400 hover:underline"
        >
          ← 戻る
        </button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* 左2カラム: メディア + 情報 */}
          <div className="md:col-span-2 space-y-6">
            <div className="overflow-hidden rounded-xl border border-gray-700/60 bg-black">
              {fileUrl && fileUrl.match(/\.(mp4|mov|avi|mkv|webm|flv)(\?|#|$)/i) ? (
                <video
                  src={`${fileUrl}#t=0.1`}
                  poster={imageUrl}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                />
              ) : (
                <img
                  src={imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="space-y-4 bg-gray-800/60 border border-gray-700/60 rounded-2xl p-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/30 text-indigo-200 text-sm">
                {artwork.category || 'その他'}
              </div>
              <h1 className="text-3xl font-bold">{artwork.title}</h1>
              <p className="text-sm text-gray-400">
                by {artwork.creator?.display_name || artwork.creator?.username || 'Unknown'}
              </p>
              <p className="text-lg text-indigo-300">
                {artwork.is_free || artwork.price === 0
                  ? '無料'
                  : `¥${Number(artwork.price || 0).toLocaleString()}`}
              </p>
              <p className="text-gray-300 whitespace-pre-wrap">
                {artwork.description || '説明がありません'}
              </p>
              {artwork.tags && artwork.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-900/40 text-purple-200 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* アクションボタン */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={toggleFan}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isFan
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                    }`}
                >
                  {isFan ? '✅ ファン登録済み' : '🫶 ファン登録'}
                </button>
                <button
                  onClick={toggleGroup}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isGroupRequested
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                    }`}
                >
                  {isGroupRequested ? '✅ グループ申請済み' : '🤝 グループ申請'}
                </button>
              </div>
            </div>
          </div>

          {/* 右カラム: コメント */}
          <div className="bg-gray-800/70 border border-gray-700/60 rounded-2xl p-6 space-y-4 md:sticky md:top-8 h-fit">
            <h2 className="text-xl font-bold text-indigo-200">コメント</h2>
            <form onSubmit={handleSubmitComment} className="space-y-3">
              <textarea
                rows={3}
                placeholder="コメントを入力"
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100"
                value={commentForm.text}
                onChange={(e) => setCommentForm({ text: e.target.value })}
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold"
              >
                コメントを投稿
              </button>
            </form>

            <div className="space-y-3">
              {comments.length === 0 && (
                <p className="text-gray-400 text-sm">まだコメントはありません。</p>
              )}
              {comments.map((c, idx) => (
                <div
                  key={`${c.id || idx}-${c.createdAt}-${idx}`}
                  className="p-3 rounded-lg bg-gray-900 border border-gray-700"
                >
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>{c.name || 'ゲスト'}</span>
                    <span>{new Date(c.createdAt).toLocaleString('ja-JP')}</span>
                  </div>
                  <p className="text-gray-100 whitespace-pre-wrap text-sm">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

