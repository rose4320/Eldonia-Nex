import PageHero from "@/components/common/PageHero";

// イベント一覧・新規作成・管理ページ（要件定義書3.1, 3.2参照）
export default function EventPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <PageHero title="イベント管理" subtitle="イベントの作成・編集・告知・チケット販売まで一元管理" />
      <div className="max-w-5xl mx-auto p-6">
        {/* イベント新規作成ボタン */}
        <div className="flex justify-end mb-6">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition">+ 新規イベント作成</button>
        </div>
        {/* イベント一覧（サンプル） */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* イベントカード例 */}
          <div className="bg-gray-800 rounded-xl shadow p-6 flex flex-col gap-2">
            <div className="text-xl font-bold text-indigo-300">Eldonia Art Festival 2025</div>
            <div className="text-sm text-gray-400">2025/12/10 〜 2025/12/12 オンライン</div>
            <div className="text-gray-200">クリエイターによる作品展示・ライブ配信・ワークショップ多数</div>
            <div className="flex gap-2 mt-2">
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">開催中</span>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">オンライン</span>
            </div>
            <div className="flex gap-4 mt-4">
              <button className="px-4 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm">詳細</button>
              <button className="px-4 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm">編集</button>
              <button className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">削除</button>
            </div>
          </div>
          {/* 他イベントも同様にカード表示 */}
        </div>
        {/* ページネーション */}
        <div className="flex justify-center mt-8">
          <button className="px-4 py-2 bg-gray-700 text-white rounded-l hover:bg-gray-600">前へ</button>
          <span className="px-4 py-2 bg-gray-800 text-gray-300">1 / 3</span>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-r hover:bg-gray-600">次へ</button>
        </div>
      </div>
    </div>
  );
}
