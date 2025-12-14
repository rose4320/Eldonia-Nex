'use client'

import PageHero from "@/components/common/PageHero";
import { usePathname } from "next/navigation";

const subscriptionPlans = [
  {
    id: "free",
    name: "Free",
    nameJa: "フリー",
    price: "¥0",
    period: "/月",
    features: [
      "月3件まで投稿",
      "10MB以下ファイル",
      "100MBストレージ",
      "Live配信なし",
      "販売手数料15%"
    ],
    trial: false,
    highlight: false,
    icon: "🎁"
  },
  {
    id: "standard",
    name: "Standard",
    nameJa: "スタンダード",
    price: "¥800",
    period: "/月",
    features: [
      "月20件まで投稿",
      "50MB以下ファイル",
      "1GBストレージ",
      "Live配信月5回",
      "販売手数料12%",
      "イベント主催月1回",
      "メールサポート"
    ],
    trial: true,
    highlight: true,
    badge: "おすすめ",
    icon: "⭐"
  },
  {
    id: "pro",
    name: "Pro",
    nameJa: "プロ",
    price: "¥1,500",
    period: "/月",
    features: [
      "投稿無制限",
      "500MB以下ファイル",
      "10GBストレージ",
      "Live配信無制限",
      "販売手数料8%",
      "イベント主催無制限",
      "優先サポート",
      "高度な分析機能"
    ],
    trial: true,
    highlight: true,
    badge: "人気No.1",
    icon: "🚀"
  },
  {
    id: "business",
    name: "Business",
    nameJa: "ビジネス",
    price: "¥10,000",
    period: "/月",
    features: [
      "投稿無制限",
      "2GB以下ファイル",
      "100GBストレージ",
      "Live配信最大1,000人",
      "販売手数料5%",
      "チームアカウント10件",
      "専任担当者",
      "API利用権限"
    ],
    trial: false,
    highlight: false,
    icon: "🏢"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    nameJa: "エンタープライズ",
    price: "要相談",
    period: "",
    features: [
      "投稿無制限",
      "ファイルサイズ無制限",
      "ストレージ無制限",
      "Live配信同時10,000人以上",
      "販売手数料2%〜",
      "チームアカウント無制限",
      "専任カスタマーサクセス",
      "SLA保証 99.9%",
      "カスタム機能開発",
      "オンプレミス対応可",
      "セキュリティ監査対応",
      "24時間365日サポート"
    ],
    trial: false,
    highlight: false,
    badge: "大規模向け",
    icon: "🏛️"
  },
];

const payAsYouGoPlans = [
  {
    id: "payg-lite",
    name: "Pay-As-You-Go Lite",
    nameJa: "従量制ライト",
    basePrice: "¥0",
    period: "基本料金",
    pricing: [
      { item: "投稿", price: "¥50/件" },
      { item: "ストレージ", price: "¥10/100MB/月" },
      { item: "Live配信", price: "¥200/回" },
      { item: "販売手数料", price: "18%" },
    ],
    features: [
      "使った分だけ支払い",
      "50MB以下ファイル",
      "イベント主催¥500/回",
      "メールサポート"
    ],
    bestFor: "不定期に活動するクリエイター向け",
    icon: "💡"
  },
  {
    id: "payg-creator",
    name: "Pay-As-You-Go Creator",
    nameJa: "従量制クリエイター",
    basePrice: "¥300",
    period: "/月",
    pricing: [
      { item: "投稿", price: "¥30/件" },
      { item: "ストレージ", price: "¥5/100MB/月" },
      { item: "Live配信", price: "¥100/回" },
      { item: "販売手数料", price: "12%" },
    ],
    features: [
      "基本料金で割引価格",
      "200MB以下ファイル",
      "イベント主催¥300/回",
      "優先メールサポート"
    ],
    bestFor: "月によって活動量が変わるクリエイター向け",
    highlight: true,
    badge: "柔軟性No.1",
    icon: "🎨"
  },
  {
    id: "payg-studio",
    name: "Pay-As-You-Go Studio",
    nameJa: "従量制スタジオ",
    basePrice: "¥1,000",
    period: "/月",
    pricing: [
      { item: "投稿", price: "¥10/件" },
      { item: "ストレージ", price: "¥2/100MB/月" },
      { item: "Live配信", price: "¥50/回" },
      { item: "販売手数料", price: "8%" },
    ],
    features: [
      "最安の従量課金",
      "500MB以下ファイル",
      "イベント主催¥100/回",
      "チャットサポート",
      "高度な分析機能"
    ],
    bestFor: "複数プロジェクトを抱えるスタジオ向け",
    icon: "🎬"
  },
];

export default function PlansPage() {
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'ja';

  const handlePlanSelect = (planId: string, planName: string) => {
    // プラン情報をURLパラメータに含めて登録ページ（ステップ形式）へ遷移
    window.location.href = `/${currentLocale}/register?plan=${planId}&planName=${encodeURIComponent(planName)}`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        
        {/* ヒーローセクション */}
        <PageHero
          title="PLANS"
          subtitle="Choose Your Creative Journey"
        />

        {/* サブスクリプションプラン */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-100 mb-2">📋 サブスクリプションプラン</h2>
          <p className="text-center text-gray-400 mb-8">月額固定料金でお得に利用</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {subscriptionPlans.map(plan => (
              <div
                key={plan.id}
                className={`relative border rounded-2xl p-6 flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  plan.highlight 
                    ? "border-indigo-500/50 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-gray-800/60 shadow-lg shadow-indigo-500/20" 
                    : "border-gray-600/30 bg-gray-800/60"
                } backdrop-blur-sm`}
              >
                {/* バッジ */}
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    {plan.badge}
                  </span>
                )}
                
                {/* アイコン */}
                <div className="text-4xl text-center mb-4">{plan.icon}</div>
                
                {/* プラン名 */}
                <h3 className={`text-xl font-bold text-center mb-1 ${plan.highlight ? "text-indigo-300" : "text-gray-200"}`}>
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-400 text-center mb-4">{plan.nameJa}</p>
                
                {/* 価格 */}
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold text-amber-400">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                
                {/* 機能リスト */}
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {/* トライアル */}
                {plan.trial && (
                  <div className="text-xs text-emerald-400 text-center mb-4 bg-emerald-900/30 rounded-lg py-2 border border-emerald-600/30">
                    ✨ 14日間無料トライアル
                  </div>
                )}
                
                {/* 選択ボタン */}
                {plan.id === 'enterprise' ? (
                  <a
                    href={`mailto:enterprise@eldonia-nex.com?subject=Enterpriseプランのお問い合わせ`}
                    className="w-full py-3 rounded-lg font-bold transition-all duration-300 bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500 shadow-lg hover:shadow-amber-500/25 text-center block"
                  >
                    📩 お問い合わせ
                  </a>
                ) : (
                  <button
                    onClick={() => handlePlanSelect(plan.id, plan.name)}
                    className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                      plan.highlight 
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-indigo-500/25" 
                        : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    }`}
                  >
                    このプランを選択
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 従量制プラン */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-100 mb-2">⚡ 従量制プラン</h2>
          <p className="text-center text-gray-400 mb-8">使った分だけお支払い・柔軟な料金体系</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {payAsYouGoPlans.map(plan => (
              <div
                key={plan.id}
                className={`relative border rounded-2xl p-6 flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  plan.highlight 
                    ? "border-emerald-500/50 bg-gradient-to-br from-emerald-900/40 via-teal-900/30 to-gray-800/60 shadow-lg shadow-emerald-500/20" 
                    : "border-gray-600/30 bg-gray-800/60"
                } backdrop-blur-sm`}
              >
                {/* バッジ */}
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    {plan.badge}
                  </span>
                )}
                
                {/* アイコン */}
                <div className="text-4xl text-center mb-4">{plan.icon}</div>
                
                {/* プラン名 */}
                <h3 className={`text-xl font-bold text-center mb-1 ${plan.highlight ? "text-emerald-300" : "text-gray-200"}`}>
                  {plan.nameJa}
                </h3>
                <p className="text-xs text-gray-500 text-center mb-4">{plan.name}</p>
                
                {/* 基本料金 */}
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-emerald-400">{plan.basePrice}</span>
                  <span className="text-gray-400 text-sm"> {plan.period}</span>
                </div>
                
                {/* 従量課金表 */}
                <div className="bg-gray-900/50 rounded-lg p-4 mb-4 border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-2 text-center">従量課金</p>
                  <div className="space-y-1">
                    {plan.pricing.map(p => (
                      <div key={p.item} className="flex justify-between text-sm">
                        <span className="text-gray-400">{p.item}</span>
                        <span className="text-amber-400 font-medium">{p.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 機能リスト */}
                <ul className="space-y-2 mb-4 flex-1">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-emerald-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {/* おすすめ対象 */}
                <div className="text-xs text-gray-500 text-center mb-4 italic">
                  {plan.bestFor}
                </div>
                
                {/* 選択ボタン */}
                <button
                  onClick={() => handlePlanSelect(plan.id, plan.nameJa)}
                  className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                    plan.highlight 
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg hover:shadow-emerald-500/25" 
                      : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  }`}
                >
                  このプランを選択
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 比較表へのリンク */}
        <div className="text-center border border-gray-600/30 rounded-xl p-8 bg-gray-800/40 backdrop-blur-md">
          <h3 className="text-xl font-bold text-gray-100 mb-4">🤔 どのプランが最適？</h3>
          <p className="text-gray-400 mb-6">
            月に10件以上投稿する方は<span className="text-indigo-400 font-bold">サブスクリプション</span>がお得！<br/>
            不定期に活動する方は<span className="text-emerald-400 font-bold">従量制</span>がおすすめです。
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handlePlanSelect('free', 'Free')}
              className="px-6 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-all"
            >
              まずは無料で始める
            </button>
            <a
              href={`/${currentLocale}/signin`}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all"
            >
              アカウントをお持ちの方
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
