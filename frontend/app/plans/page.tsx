

import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "¥0/月",
    features: [
      "月3件まで投稿", "10MB以下ファイル", "100MBストレージ", "Live配信なし", "手数料15%"
    ],
    trial: false,
    color: "from-gray-100 to-gray-200",
    highlight: false,
  },
  {
    name: "Standard",
    price: "¥800/月",
    features: [
      "月20件まで投稿", "50MB以下ファイル", "1GBストレージ", "Live配信月5回", "手数料12%", "イベント主催月1回", "作品プロモーション機能", "メールサポート"
    ],
    trial: true,
    color: "from-blue-100 to-purple-100",
    highlight: true,
    badge: "おすすめ",
  },
  {
    name: "Pro",
    price: "¥1,500/月",
    features: [
      "投稿無制限", "500MB以下ファイル", "10GBストレージ", "Live配信無制限", "手数料8%", "イベント主催無制限", "優先サポート", "高度な分析機能", "カスタムプロフィールURL"
    ],
    trial: true,
    color: "from-purple-100 to-yellow-100",
    highlight: true,
    badge: "人気No.1",
  },
  {
    name: "Business",
    price: "¥10,000/月",
    features: [
      "投稿無制限", "2GB以下ファイル", "100MBストレージ", "Live配信最大1,000人", "手数料5%", "チームアカウント10件", "専任担当者", "API利用権限", "ホワイトラベル対応"
    ],
    trial: false,
    color: "from-yellow-100 to-gray-100",
    highlight: false,
  },
];

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-950 to-purple-950 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-10 tracking-tight text-purple-200 drop-shadow-lg font-pt-serif">サブスクリプションプラン選択</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`relative bg-linear-to-br from-gray-800 via-gray-900 to-purple-900 rounded-2xl shadow-2xl p-8 flex flex-col border-2 transition-transform duration-300 hover:scale-105 ${plan.highlight ? "border-purple-500" : "border-gray-700"}`}
              style={{ minHeight: 420 }}
            >
              {/* バッジ */}
              {plan.badge && (
                <span className="absolute top-4 right-4 bg-linear-to-r from-purple-500 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse font-inter border border-yellow-400">{plan.badge}</span>
              )}
              <h2 className={`text-2xl font-bold mb-2 text-center font-pt-serif ${plan.highlight ? "text-purple-300" : "text-gray-200"}`}>{plan.name}</h2>
              <div className="text-3xl font-extrabold mb-4 text-center text-yellow-200 font-pt-serif">{plan.price}</div>
              <ul className="mb-4 text-sm text-gray-300 space-y-2 font-noto-sans-jp">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 rounded-full bg-linear-to-br from-purple-500 to-yellow-400 mr-1 border border-purple-700"></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {plan.trial && (
                <div className="text-xs text-green-400 mb-2 text-center font-semibold bg-green-950 rounded px-2 py-1 shadow font-inter border border-green-600">14日間無料トライアルあり</div>
              )}
              <Link
                href={{ pathname: '/register', query: { plan: plan.name } }}
                className={`mt-auto py-2 rounded-lg font-bold text-lg transition-all duration-200 shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 font-inter flex items-center justify-center ${plan.highlight ? "bg-linear-to-r from-purple-600 to-yellow-500 text-white hover:from-purple-700 hover:to-yellow-400" : "bg-gray-900 text-purple-200 hover:bg-gray-800"}`}
                tabIndex={0}
                aria-label={`${plan.name}プランを選択`}
              >
                このプランを選択
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/signin" className="inline-block text-purple-300 hover:underline font-semibold text-lg transition-colors duration-200 font-inter">
            サインインページへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
