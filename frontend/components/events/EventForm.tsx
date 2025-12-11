'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// 動的インポート（SSR無効化）
const VenueMapSearch = dynamic(() => import('./VenueMapSearch'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />,
});

interface VenueRecommendation {
  name: string;
  address: string;
  capacity: number;
  rating: number;
  distance: string;
  price_range: string;
}

interface EventSuccessPrediction {
  success_rate: number;
  factors: {
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
  recommendations: string[];
}

interface FinancialProjection {
  total_revenue: number;
  total_costs: number;
  profit: number;
  break_even_attendance: number;
  profit_margin: number;
  expected_attendance: number;
  warnings: string[];
  fan_count?: number;
  calculation_method?: string;
  past_events_count?: number;
}

interface EventFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export default function EventForm({ onSubmit, isSubmitting }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'venue',
    venue_name: '',
    venue_address: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    timezone: 'Asia/Tokyo',
    capacity: '',
    purpose: '',
    location: '',
    is_free: true,
    status: 'draft',
    // 予算関連
    budget: '',
    ticket_price: '',
    venue_cost: '',
    marketing_cost: '',
    other_costs: '',
  });

  const [venueRecommendations, setVenueRecommendations] = useState<VenueRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [successPrediction, setSuccessPrediction] = useState<EventSuccessPrediction | null>(null);
  const [showPrediction, setShowPrediction] = useState(false);
  const [financialProjection, setFinancialProjection] = useState<FinancialProjection | null>(null);
  const [showFinancial, setShowFinancial] = useState(false);
  const [showMapSearch, setShowMapSearch] = useState(false);

  // 会場選択ハンドラ
  const handleVenueSelect = (venue: {
    name: string;
    address: string;
    placeId: string;
    lat: number;
    lng: number;
  }) => {
    setFormData(prev => ({
      ...prev,
      venue_name: venue.name,
      venue_address: venue.address,
      location: venue.address.split(',')[0], // 最初の部分を場所として使用
    }));
    setShowMapSearch(false);
  };

  // フォーム入力の変更ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 会場推薦を取得
  const fetchVenueRecommendations = () => {
    if (!formData.capacity || !formData.location || !formData.purpose) {
      alert('収容人数、場所、用途を入力してください。');
      return;
    }

    // モックデータ（実際にはバックエンドAPIを呼び出す）
    const mockRecommendations: VenueRecommendation[] = [
      {
        name: '東京コンベンションセンター',
        address: '東京都千代田区',
        capacity: parseInt(formData.capacity) + 50,
        rating: 4.5,
        distance: '2.5km',
        price_range: '¥50,000 - ¥100,000',
      },
      {
        name: 'クリエイティブスペース渋谷',
        address: '東京都渋谷区',
        capacity: parseInt(formData.capacity) + 20,
        rating: 4.2,
        distance: '3.8km',
        price_range: '¥30,000 - ¥60,000',
      },
      {
        name: 'アートギャラリー新宿',
        address: '東京都新宿区',
        capacity: parseInt(formData.capacity),
        rating: 4.0,
        distance: '5.2km',
        price_range: '¥25,000 - ¥50,000',
      },
    ];

    setVenueRecommendations(mockRecommendations);
    setShowRecommendations(true);
  };

  // イベント成功率を予測
  const predictEventSuccess = () => {
    if (!formData.title || !formData.start_date || !formData.capacity) {
      alert('タイトル、日付、収容人数を入力してください。');
      return;
    }

    // 成功率計算ロジック（実際にはMLモデルやより複雑なロジックを使用）
    let baseRate = 60;
    const factors = [];

    // タイトルの長さ
    if (formData.title.length > 10 && formData.title.length < 50) {
      baseRate += 10;
      factors.push({
        name: 'タイトルの長さ',
        impact: 'positive' as const,
        description: '適切な長さのタイトルは注目を集めやすいです',
      });
    }

    // 収容人数
    const capacity = parseInt(formData.capacity);
    if (capacity > 20 && capacity < 100) {
      baseRate += 5;
      factors.push({
        name: '収容人数',
        impact: 'positive' as const,
        description: '適切な規模で管理しやすいイベントです',
      });
    } else if (capacity > 200) {
      baseRate -= 5;
      factors.push({
        name: '収容人数',
        impact: 'negative' as const,
        description: '大規模イベントは運営が難しくなります',
      });
    }

    // 開催日までの期間
    const startDate = new Date(formData.start_date);
    const today = new Date();
    const daysUntilEvent = Math.floor((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilEvent > 30) {
      baseRate += 10;
      factors.push({
        name: '準備期間',
        impact: 'positive' as const,
        description: '十分な準備期間があります',
      });
    } else if (daysUntilEvent < 7) {
      baseRate -= 10;
      factors.push({
        name: '準備期間',
        impact: 'negative' as const,
        description: '準備期間が短すぎます',
      });
    }

    // 説明文の充実度
    if (formData.description.length > 100) {
      baseRate += 5;
      factors.push({
        name: '説明文の充実度',
        impact: 'positive' as const,
        description: '詳細な説明は参加者の信頼を得られます',
      });
    }

    // 無料イベント
    if (formData.is_free) {
      baseRate += 8;
      factors.push({
        name: '参加費',
        impact: 'positive' as const,
        description: '無料イベントは参加しやすいです',
      });
    }

    const successRate = Math.min(95, Math.max(20, baseRate));

    const recommendations = [];
    if (successRate < 60) {
      recommendations.push('開催日を延期して準備期間を確保することをお勧めします');
      recommendations.push('イベントの詳細説明を充実させましょう');
    }
    if (capacity > 150) {
      recommendations.push('大規模イベントの場合、スタッフを増員することを検討してください');
    }
    if (!formData.description || formData.description.length < 50) {
      recommendations.push('イベントの魅力を伝える詳細な説明を追加しましょう');
    }

    setSuccessPrediction({
      success_rate: successRate,
      factors,
      recommendations: recommendations.length > 0 ? recommendations : ['現在の設定は良好です！'],
    });
    setShowPrediction(true);
  };

  // 収支予測計算
  const calculateFinancialProjection = async () => {
    if (!formData.capacity) {
      alert('収容人数を入力してください。');
      return;
    }

    try {
      const response = await fetch('http://localhost:8001/api/v1/events/financial-projection/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          capacity: parseInt(formData.capacity),
          ticket_price: parseFloat(formData.ticket_price) || 0,
          venue_cost: parseFloat(formData.venue_cost) || 0,
          marketing_cost: parseFloat(formData.marketing_cost) || 0,
          other_costs: parseFloat(formData.other_costs) || 0,
          is_free: formData.is_free,
        }),
      });

      if (!response.ok) {
        throw new Error('収支予測の計算に失敗しました');
      }

      const data = await response.json();
      setFinancialProjection({
        total_revenue: data.total_revenue,
        total_costs: data.total_costs,
        profit: data.profit,
        break_even_attendance: data.break_even_attendance,
        profit_margin: data.profit_margin,
        expected_attendance: data.expected_attendance,
        warnings: data.warnings,
        fan_count: data.fan_count,
        calculation_method: data.calculation_method,
        past_events_count: data.past_events_count,
      });
      setShowFinancial(true);
    } catch (error) {
      console.error('収支予測エラー:', error);
      alert('収支予測の計算に失敗しました。もう一度お試しください。');
    }
  };

  // 会場選択ハンドラ
  const selectVenue = (venue: VenueRecommendation) => {
    setFormData(prev => ({
      ...prev,
      venue_name: venue.name,
      venue_address: venue.address,
    }));
    setShowRecommendations(false);
  };

  // フォーム送信
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 日時を結合してISO形式に変換
    const start_datetime = `${formData.start_date}T${formData.start_time}:00`;
    const end_datetime = `${formData.end_date}T${formData.end_time}:00`;

    const eventData = {
      title: formData.title,
      description: formData.description,
      event_type: formData.event_type,
      venue_name: formData.venue_name,
      venue_address: formData.venue_address,
      start_datetime,
      end_datetime,
      timezone: formData.timezone,
      capacity: parseInt(formData.capacity),
      is_free: formData.is_free,
      status: formData.status,
    };

    onSubmit(eventData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 基本情報セクション */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="text-3xl">📋</span>
          基本情報
        </h2>
        
        {/* タイトル */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
            イベントタイトル <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 text-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="例: クリエイターミートアップ 2025"
          />
        </div>

        {/* 説明 */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
            イベント説明
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="イベントの詳細を入力してください"
          />
        </div>

        {/* 用途とイベントタイプ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="purpose" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              用途 <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <select
              id="purpose"
              name="purpose"
              required
              value={formData.purpose}
              onChange={handleChange}
              className="w-full px-4 py-3 text-lg font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors cursor-pointer"
            >
              <option value="" className="text-gray-900 dark:text-white bg-white dark:bg-gray-700">選択してください</option>
              <option value="networking" className="text-gray-900 dark:text-white bg-white dark:bg-gray-700">🤝 ネットワーキング</option>
              <option value="workshop" className="text-gray-900 dark:text-white bg-white dark:bg-gray-700">🛠️ ワークショップ</option>
              <option value="exhibition" className="text-gray-900 dark:text-white bg-white dark:bg-gray-700">🎨 展示会</option>
              <option value="conference" className="text-gray-900 dark:text-white bg-white dark:bg-gray-700">🎤 カンファレンス</option>
              <option value="seminar" className="text-gray-900 dark:text-white bg-white dark:bg-gray-700">📚 セミナー</option>
              <option value="party" className="text-gray-900 dark:text-white bg-white dark:bg-gray-700">🎉 パーティー</option>
              <option value="other" className="text-gray-900 dark:text-white bg-white dark:bg-gray-700">📌 その他</option>
            </select>
          </div>

          <div>
            <label htmlFor="event_type" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              開催形式 <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <select
              id="event_type"
              name="event_type"
              required
              value={formData.event_type}
              onChange={handleChange}
              className="w-full px-4 py-3 text-lg font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors cursor-pointer"
            >
              <option value="venue" className="text-gray-900 dark:text-white bg-white dark:bg-gray-700">🏢 会場開催</option>
              <option value="online" className="text-gray-900 dark:text-white bg-white dark:bg-gray-700">💻 オンライン</option>
            </select>
          </div>
        </div>
      </div>

      {/* 日時セクション */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="text-3xl">📅</span>
          開催日時
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="start_date" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              開始日 <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              required
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="start_time" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              開始時刻 <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="time"
              id="start_time"
              name="start_time"
              required
              value={formData.start_time}
              onChange={handleChange}
              className="w-full px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="end_date" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              終了日 <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              required
              value={formData.end_date}
              onChange={handleChange}
              className="w-full px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="end_time" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              終了時刻 <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="time"
              id="end_time"
              name="end_time"
              required
              value={formData.end_time}
              onChange={handleChange}
              className="w-full px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 会場・収容人数セクション */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="text-3xl">🏢</span>
          会場情報
        </h2>
        
        {/* 収容人数 */}
        <div className="mb-6">
          <label htmlFor="capacity" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
            収容人数 <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            required
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            className="w-full px-4 py-3 text-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="例: 50"
          />
        </div>

        {/* 場所 */}
        {formData.event_type === 'venue' && (
          <div className="mb-6">
            <label htmlFor="location" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              場所（地域） <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="例: 東京都渋谷区"
            />
          </div>
        )}

        {/* 会場推薦ボタン */}
        {formData.event_type === 'venue' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={fetchVenueRecommendations}
              className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              🏢 推薦会場を表示
            </button>
            <button
              type="button"
              onClick={() => setShowMapSearch(!showMapSearch)}
              className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              🗺️ 地図で会場を探す
            </button>
          </div>
        )}
      </div>

      {/* Google Maps 会場検索 */}
      {showMapSearch && formData.event_type === 'venue' && (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>🗺️</span>
              Google Maps で会場を検索
            </h3>
            <button
              type="button"
              onClick={() => setShowMapSearch(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              ✕
            </button>
          </div>
          <VenueMapSearch
            onVenueSelect={handleVenueSelect}
            initialLocation={formData.location || '東京都'}
          />
        </div>
      )}

      {/* 会場推薦リスト */}
      {showRecommendations && venueRecommendations.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">推薦会場</h3>
          <div className="space-y-3">
            {venueRecommendations.map((venue, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => selectVenue(venue)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{venue.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{venue.address}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>収容: {venue.capacity}名</span>
                      <span>⭐ {venue.rating}</span>
                      <span>📍 {venue.distance}</span>
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{venue.price_range}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => selectVenue(venue)}
                    className="ml-4 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    選択
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 選択された会場 */}
      {formData.venue_name && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-2 border-blue-300 dark:border-blue-600 p-6 rounded-xl shadow-md">
          <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <span>✅</span> 選択された会場
          </h4>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{formData.venue_name}</p>
          <p className="text-base text-gray-600 dark:text-gray-300 mt-1">{formData.venue_address}</p>
        </div>
      )}

      {/* 予算・収支セクション */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="text-3xl">💰</span>
          予算・収支管理
        </h2>
        
        {/* 参加費 */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="is_free"
              name="is_free"
              checked={formData.is_free}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="is_free" className="ml-3 block text-base font-semibold text-gray-800 dark:text-gray-200">
              無料イベント
            </label>
          </div>
        </div>

        {!formData.is_free && (
          <div className="mb-6">
            <label htmlFor="ticket_price" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              チケット価格（円）
            </label>
            <input
              type="number"
              id="ticket_price"
              name="ticket_price"
              min="0"
              value={formData.ticket_price}
              onChange={handleChange}
              className="w-full px-4 py-3 text-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="例: 3000"
            />
          </div>
        )}

        {/* 予算内訳 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="venue_cost" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              🏢 会場費（円）
            </label>
            <input
              type="number"
              id="venue_cost"
              name="venue_cost"
              min="0"
              value={formData.venue_cost}
              onChange={handleChange}
              className="w-full px-3 py-2 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="marketing_cost" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              📊 宣伝費（円）
            </label>
            <input
              type="number"
              id="marketing_cost"
              name="marketing_cost"
              min="0"
              value={formData.marketing_cost}
              onChange={handleChange}
              className="w-full px-3 py-2 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="other_costs" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              💼 その他費用（円）
            </label>
            <input
              type="number"
              id="other_costs"
              name="other_costs"
              min="0"
              value={formData.other_costs}
              onChange={handleChange}
              className="w-full px-3 py-2 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="0"
            />
          </div>
        </div>

        {/* 収支予測ボタン */}
        <button
          type="button"
          onClick={calculateFinancialProjection}
          className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-lg rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl font-semibold mb-6"
        >
          📊 収支予測を計算
        </button>

        {/* 収支予測結果 */}
        {showFinancial && financialProjection && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-100 border-2 border-orange-400 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>📊</span> 収支予測
            </h3>
            
            {/* サマリー */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm font-semibold text-gray-700 mb-1">予想売上</p>
                <p className="text-2xl font-bold text-blue-700">¥{financialProjection.total_revenue.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm font-semibold text-gray-700 mb-1">総コスト</p>
                <p className="text-2xl font-bold text-red-700">¥{financialProjection.total_costs.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm font-semibold text-gray-700 mb-1">予想利益</p>
                <p className={`text-2xl font-bold ${financialProjection.profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ¥{financialProjection.profit.toLocaleString()}
                </p>
              </div>
            </div>

            {/* 詳細情報 */}
            <div className="space-y-3 mb-4">
              {/* 集客数の説明 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-2 border-blue-400 dark:border-blue-600 p-5 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-base text-gray-900 dark:text-white mb-1">
                      <span className="font-bold text-blue-700 dark:text-blue-300">👥 予想集客数:</span>
                    </p>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                      {financialProjection.expected_attendance}人
                    </p>
                  </div>
                  {financialProjection.fan_count !== undefined && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-300">あなたのファン</p>
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">{financialProjection.fan_count}人</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-white dark:bg-gray-800 bg-opacity-60 dark:bg-opacity-60 p-3 rounded-lg mb-2">
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                    💡 <span className="font-bold">計算ロジック:</span>
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100 mt-1 leading-relaxed">
                    {financialProjection.calculation_method || 'ファン情報に基づいて集客数を予測しています'}
                  </p>
                </div>
                
                <div className="bg-indigo-50 dark:bg-indigo-900 p-3 rounded-lg">
                  <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">
                    <span className="font-semibold">⚡ 予測ロジック:</span><br/>
                    ・ ファン数が多いほど集客力が向上<br/>
                    ・ 過去のイベント開催実績で経験値ボーナス<br/>
                    ・ コミュニティ規模に応じた参加率を適用<br/>
                    ・ 収容人数を上限とした現実的な予測
                  </p>
                </div>
              </div>
              
              {!formData.is_free && financialProjection.break_even_attendance > 0 && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <p className="text-base text-gray-900 dark:text-white">
                    <span className="font-semibold">損益分岐点:</span> {financialProjection.break_even_attendance}人
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(収容人数の{((financialProjection.break_even_attendance / parseInt(formData.capacity || '1')) * 100).toFixed(0)}%)</span>
                  </p>
                </div>
              )}
              {financialProjection.total_revenue > 0 && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <p className="text-base text-gray-900 dark:text-white">
                    <span className="font-semibold">利益率:</span> {financialProjection.profit_margin.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>

            {/* 警告・推奨 */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">分析結果</h4>
              <ul className="space-y-2">
                {financialProjection.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-2 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <span className="flex-shrink-0 text-xl">{warning.includes('⚠️') ? '⚠️' : warning.includes('✅') ? '✅' : 'ℹ️'}</span>
                    <span className="font-medium">{warning.replace(/[⚠️✅ℹ️]/g, '').trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 成功率予測セクション */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="text-3xl">🎯</span>
          成功率予測
        </h2>
        
        <button
          type="button"
          onClick={predictEventSuccess}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-lg rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          🎯 イベント成功率を予測
        </button>

        {/* 成功率予測結果 */}
        {showPrediction && successPrediction && (
          <div className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 border-2 border-purple-400 dark:border-purple-600 rounded-xl p-6 shadow-lg mt-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span>🎯</span> 予測結果
            </h3>
          
            {/* 成功率メーター */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-900 dark:text-white">予測成功率</span>
                <span className="text-4xl font-bold text-purple-700 dark:text-purple-300">
                  {successPrediction.success_rate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 shadow-inner">
                <div
                  className={`h-6 rounded-full transition-all shadow-md ${
                    successPrediction.success_rate >= 70
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                      : successPrediction.success_rate >= 50
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                      : 'bg-gradient-to-r from-red-400 to-rose-500'
                  }`}
                  style={{ width: `${successPrediction.success_rate}%` }}
                />
              </div>
              <p className="text-base font-bold text-gray-900 dark:text-white mt-2 text-center">
                {successPrediction.success_rate >= 70 ? '✅ 優良' : successPrediction.success_rate >= 50 ? '⚠️ 普通' : '❌ 要改善'}
              </p>
            </div>

            {/* 影響要因 */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">影響要因</h4>
              <div className="space-y-3">
                {successPrediction.factors.map((factor, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-white p-4 rounded-lg shadow"
                  >
                    <span className="text-2xl flex-shrink-0">
                      {factor.impact === 'positive' ? '✅' : factor.impact === 'negative' ? '⚠️' : 'ℹ️'}
                    </span>
                    <div>
                      <span className="font-bold text-base text-gray-900">{factor.name}</span>
                      <p className="text-sm text-gray-800 mt-1 font-medium">{factor.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 推奨事項 */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">推奨事項</h4>
              <ul className="space-y-3">
                {successPrediction.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow">
                    <span className="text-purple-700 text-2xl flex-shrink-0">💡</span>
                    <span className="text-base text-gray-900 font-medium">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 送信ボタン */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-8 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-bold"
        >
          {isSubmitting ? '🔄 作成中...' : '✨ イベントを作成'}
        </button>
      </div>
    </form>
  );
}
