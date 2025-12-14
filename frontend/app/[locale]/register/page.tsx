"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

// 国リスト
const countries = [
  { code: "JP", name: "日本", flag: "🇯🇵" },
  { code: "US", name: "アメリカ合衆国", flag: "🇺🇸" },
  { code: "GB", name: "イギリス", flag: "🇬🇧" },
  { code: "CN", name: "中国", flag: "🇨🇳" },
  { code: "KR", name: "韓国", flag: "🇰🇷" },
  { code: "TW", name: "台湾", flag: "🇹🇼" },
  { code: "DE", name: "ドイツ", flag: "🇩🇪" },
  { code: "FR", name: "フランス", flag: "🇫🇷" },
  { code: "CA", name: "カナダ", flag: "🇨🇦" },
  { code: "AU", name: "オーストラリア", flag: "🇦🇺" },
  { code: "SG", name: "シンガポール", flag: "🇸🇬" },
  { code: "TH", name: "タイ", flag: "🇹🇭" },
  { code: "VN", name: "ベトナム", flag: "🇻🇳" },
  { code: "ID", name: "インドネシア", flag: "🇮🇩" },
  { code: "MY", name: "マレーシア", flag: "🇲🇾" },
  { code: "PH", name: "フィリピン", flag: "🇵🇭" },
  { code: "IN", name: "インド", flag: "🇮🇳" },
  { code: "BR", name: "ブラジル", flag: "🇧🇷" },
  { code: "MX", name: "メキシコ", flag: "🇲🇽" },
  { code: "OTHER", name: "その他", flag: "🌍" },
];

// クリエイタータイプ
const creatorTypes = [
  { id: "illustrator", label: "イラストレーター", icon: "🎨" },
  { id: "musician", label: "ミュージシャン", icon: "🎵" },
  { id: "writer", label: "作家・ライター", icon: "✍️" },
  { id: "photographer", label: "フォトグラファー", icon: "📷" },
  { id: "videographer", label: "映像クリエイター", icon: "🎬" },
  { id: "3d_artist", label: "3Dアーティスト", icon: "🎮" },
  { id: "designer", label: "デザイナー", icon: "💎" },
  { id: "animator", label: "アニメーター", icon: "🎞️" },
  { id: "vtuber", label: "VTuber", icon: "🎭" },
  { id: "other", label: "その他", icon: "✨" },
];

// ステップ定義（基本）
const baseSteps = [
  { id: 1, title: "アカウント情報", icon: "📧" },
  { id: 2, title: "お名前", icon: "👤" },
  { id: 3, title: "プロフィール", icon: "🏷️" },
  { id: 4, title: "アバター", icon: "🖼️" },
  { id: 5, title: "国・地域", icon: "🌍" },
  { id: 6, title: "住所", icon: "🏠" },
  { id: 7, title: "連絡先", icon: "📱" },
  { id: 8, title: "追加情報", icon: "✨" },
];

// 支払い方法ステップ（有料プラン用）
const paymentStep = { id: 9, title: "支払い方法", icon: "💳" };

// 確認ステップ
const confirmStep = { id: 10, title: "確認", icon: "✅" };

// 支払い方法一覧
const paymentMethods = [
  { id: "credit_card", label: "クレジットカード", icon: "💳", description: "Visa, Mastercard, JCB, AMEX" },
  { id: "paypal", label: "PayPal", icon: "🅿️", description: "PayPalアカウントで支払い" },
  { id: "bank_transfer", label: "銀行振込", icon: "🏦", description: "請求書発行後にお振込み" },
  { id: "convenience", label: "コンビニ払い", icon: "🏪", description: "ローソン, ファミマ, セブン他" },
];

interface FormData {
  // Step 1: アカウント情報
  email: string;
  password: string;
  passwordConfirm: string;
  
  // Step 2: 氏名
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  
  // Step 3: プロフィール
  username: string;
  displayName: string;
  
  // Step 4: アバター
  avatarUrl: string;
  avatarFile: File | null;
  
  // Step 5: 国
  country: string;
  
  // Step 6: 住所
  postalCode: string;
  prefecture: string;
  city: string;
  address1: string;
  address2: string;
  
  // Step 7: 連絡先
  phoneCountryCode: string;
  phoneNumber: string;
  
  // Step 8: 追加情報
  birthDate: string;
  gender: string;
  bio: string;
  website: string;
  twitterHandle: string;
  creatorTypes: string[];
  preferredLanguage: string;
  
  // Step 9: 支払い方法（有料プラン用）
  paymentMethod: string;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvc: string;
  
  // 共通
  plan: string;
  agree: boolean;
  newsletter: boolean;
}

function RegisterPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'ja';
  
  const plan = searchParams.get("plan") || "free";
  const planName = searchParams.get("planName") || "Free";
  
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
    passwordConfirm: "",
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    username: "",
    displayName: "",
    avatarUrl: "",
    avatarFile: null,
    country: "JP",
    postalCode: "",
    prefecture: "",
    city: "",
    address1: "",
    address2: "",
    phoneCountryCode: "+81",
    phoneNumber: "",
    birthDate: "",
    gender: "",
    bio: "",
    website: "",
    twitterHandle: "",
    creatorTypes: [],
    preferredLanguage: "ja",
    paymentMethod: "credit_card",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
    plan: plan,
    agree: false,
    newsletter: true,
  });
  
  // 有料プランかどうか判定
  const isPaidPlan = plan !== "free" && plan !== "payg-lite";
  
  // ステップリストを動的に生成
  const steps = isPaidPlan 
    ? [...baseSteps, paymentStep, { ...confirmStep, id: 10 }]
    : [...baseSteps, { ...confirmStep, id: 9 }];
  
  const confirmStepId = isPaidPlan ? 10 : 9;
  const paymentStepId = 9;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && "checked" in e.target) {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreatorTypeToggle = (typeId: string) => {
    setForm(prev => ({
      ...prev,
      creatorTypes: prev.creatorTypes.includes(typeId)
        ? prev.creatorTypes.filter(t => t !== typeId)
        : [...prev.creatorTypes, typeId]
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        avatarFile: file,
        avatarUrl: URL.createObjectURL(file)
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    setError("");
    
    switch (step) {
      case 1:
        if (!form.email) { setError("メールアドレスを入力してください"); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("有効なメールアドレスを入力してください"); return false; }
        if (!form.password) { setError("パスワードを入力してください"); return false; }
        if (form.password.length < 8) { setError("パスワードは8文字以上で入力してください"); return false; }
        if (form.password !== form.passwordConfirm) { setError("パスワードが一致しません"); return false; }
        return true;
      case 2:
        if (!form.lastName || !form.firstName) { setError("姓と名を入力してください"); return false; }
        return true;
      case 3:
        if (!form.username) { setError("ユーザー名を入力してください"); return false; }
        if (!/^[a-zA-Z0-9_]+$/.test(form.username)) { setError("ユーザー名は英数字とアンダースコアのみ使用できます"); return false; }
        if (!form.displayName) { setError("表示名を入力してください"); return false; }
        return true;
      case 4:
        return true; // アバターは任意
      case 5:
        if (!form.country) { setError("国を選択してください"); return false; }
        return true;
      case 6:
        return true; // 住所は任意
      case 7:
        return true; // 電話番号は任意
      case 8:
        return true; // 追加情報は任意
      case 9:
        if (isPaidPlan) {
          // 支払いステップ
          if (!form.paymentMethod) { setError("支払い方法を選択してください"); return false; }
          if (form.paymentMethod === "credit_card") {
            if (!form.cardNumber) { setError("カード番号を入力してください"); return false; }
            if (!/^\d{13,19}$/.test(form.cardNumber.replace(/\s/g, ''))) { setError("有効なカード番号を入力してください"); return false; }
            if (!form.cardName) { setError("カード名義を入力してください"); return false; }
            if (!form.cardExpiry) { setError("有効期限を入力してください"); return false; }
            if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) { setError("有効期限はMM/YY形式で入力してください"); return false; }
            if (!form.cardCvc) { setError("セキュリティコードを入力してください"); return false; }
            if (!/^\d{3,4}$/.test(form.cardCvc)) { setError("有効なセキュリティコードを入力してください"); return false; }
          }
          return true;
        } else {
          // 無料プランの確認ステップ
          if (!form.agree) { setError("利用規約に同意してください"); return false; }
          return true;
        }
      case 10:
        if (!form.agree) { setError("利用規約に同意してください"); return false; }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(confirmStepId)) return;
    
    setIsLoading(true);
    try {
      // TODO: API連携
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push(`/${currentLocale}/signin?registered=true&plan=${form.plan}`);
    } catch {
      setError("登録に失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-indigo-300 mb-6 flex items-center gap-2">
              📧 アカウント情報
            </h2>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">メールアドレス <span className="text-red-400">*</span></label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">パスワード <span className="text-red-400">*</span></label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="8文字以上"
                className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">パスワード（確認） <span className="text-red-400">*</span></label>
              <input
                type="password"
                name="passwordConfirm"
                value={form.passwordConfirm}
                onChange={handleChange}
                placeholder="もう一度入力"
                className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-indigo-300 mb-6 flex items-center gap-2">
              👤 お名前
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">姓 <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="山田"
                  className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">名 <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="太郎"
                  className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">姓（フリガナ）</label>
                <input
                  type="text"
                  name="lastNameKana"
                  value={form.lastNameKana}
                  onChange={handleChange}
                  placeholder="ヤマダ"
                  className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">名（フリガナ）</label>
                <input
                  type="text"
                  name="firstNameKana"
                  value={form.firstNameKana}
                  onChange={handleChange}
                  placeholder="タロウ"
                  className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-indigo-300 mb-6 flex items-center gap-2">
              🏷️ プロフィール
            </h2>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">ユーザー名 <span className="text-red-400">*</span></label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">@</span>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="username123"
                  className="flex-1 border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">英数字とアンダースコアのみ使用可能</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">表示名 <span className="text-red-400">*</span></label>
              <input
                type="text"
                name="displayName"
                value={form.displayName}
                onChange={handleChange}
                placeholder="クリエイター太郎"
                className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">他のユーザーに表示される名前</p>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-indigo-300 mb-6 flex items-center gap-2">
              🖼️ アバター画像
            </h2>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full border-4 border-indigo-500/50 overflow-hidden bg-gray-700 mb-4">
                {form.avatarUrl ? (
                  <img src={form.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500">
                    👤
                  </div>
                )}
              </div>
              <label className="cursor-pointer px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">
                📁 画像を選択
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">推奨: 400x400px以上のJPGまたはPNG</p>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-indigo-300 mb-6 flex items-center gap-2">
              🌍 国・地域
            </h2>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">居住国 <span className="text-red-400">*</span></label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-600 rounded-lg bg-gray-800/50">
                {countries.map(country => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, country: country.code }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      form.country === country.code
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <span>{country.flag}</span>
                    <span className="text-sm truncate">{country.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-indigo-300 mb-6 flex items-center gap-2">
              🏠 住所（任意）
            </h2>
            <p className="text-sm text-gray-400 mb-4">販売活動を行う場合は入力をおすすめします</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">郵便番号</label>
                <input
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="123-4567"
                  className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">都道府県</label>
                <input
                  type="text"
                  name="prefecture"
                  value={form.prefecture}
                  onChange={handleChange}
                  placeholder="東京都"
                  className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">市区町村</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="渋谷区"
                className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">番地・建物名</label>
              <input
                type="text"
                name="address1"
                value={form.address1}
                onChange={handleChange}
                placeholder="1-2-3 ○○ビル 101"
                className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        );
      
      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-indigo-300 mb-6 flex items-center gap-2">
              📱 連絡先（任意）
            </h2>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">電話番号</label>
              <div className="flex gap-2">
                <select
                  name="phoneCountryCode"
                  value={form.phoneCountryCode}
                  onChange={handleChange}
                  className="w-24 border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-2 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+82">🇰🇷 +82</option>
                </select>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="090-1234-5678"
                  className="flex-1 border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        );
      
      case 8:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-indigo-300 mb-6 flex items-center gap-2">
              ✨ 追加情報（任意）
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">生年月日</label>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">性別</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">選択しない</option>
                  <option value="M">男性</option>
                  <option value="F">女性</option>
                  <option value="O">その他</option>
                  <option value="N">回答しない</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">自己紹介</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="あなたについて教えてください..."
                rows={3}
                className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">ウェブサイト</label>
              <input
                type="url"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">X（Twitter）</label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">@</span>
                <input
                  type="text"
                  name="twitterHandle"
                  value={form.twitterHandle}
                  onChange={handleChange}
                  placeholder="username"
                  className="flex-1 border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">クリエイタータイプ（複数選択可）</label>
              <div className="grid grid-cols-2 gap-2">
                {creatorTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleCreatorTypeToggle(type.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                      form.creatorTypes.includes(type.id)
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 9:
        if (isPaidPlan) {
          // 支払い方法ステップ（有料プラン）
          return (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-indigo-300 mb-6 flex items-center gap-2">
                💳 支払い方法
              </h2>
              
              {/* プラン情報 */}
              <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-amber-300">選択プラン</span>
                  <span className="text-amber-400 font-bold text-lg">{planName}</span>
                </div>
              </div>
              
              {/* 支払い方法選択 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">支払い方法を選択 <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, paymentMethod: method.id }))}
                      className={`flex items-center gap-3 p-4 rounded-lg border transition-all text-left ${
                        form.paymentMethod === method.id
                          ? "border-indigo-500 bg-indigo-900/30"
                          : "border-gray-600 bg-gray-800/50 hover:border-gray-500"
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <div className="text-gray-200 font-medium">{method.label}</div>
                        <div className="text-xs text-gray-500">{method.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* クレジットカード入力フォーム */}
              {form.paymentMethod === "credit_card" && (
                <div className="space-y-4 mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h3 className="text-gray-200 font-medium flex items-center gap-2">
                    💳 カード情報
                  </h3>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">カード番号 <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={form.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">カード名義（ローマ字） <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      name="cardName"
                      value={form.cardName}
                      onChange={handleChange}
                      placeholder="TARO YAMADA"
                      className="w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">有効期限 <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={form.cardExpiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">セキュリティコード <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        name="cardCvc"
                        value={form.cardCvc}
                        onChange={handleChange}
                        placeholder="123"
                        maxLength={4}
                        className="w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                    <span>🔒</span>
                    <span>SSL暗号化によりカード情報は安全に保護されます</span>
                  </div>
                </div>
              )}
              
              {/* PayPal */}
              {form.paymentMethod === "paypal" && (
                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/50 rounded-lg text-center">
                  <p className="text-blue-300 mb-2">PayPalで支払い</p>
                  <p className="text-sm text-gray-400">登録完了後、PayPalログイン画面に移動します</p>
                </div>
              )}
              
              {/* 銀行振込 */}
              {form.paymentMethod === "bank_transfer" && (
                <div className="mt-6 p-4 bg-gray-800/50 border border-gray-600 rounded-lg">
                  <p className="text-gray-300 mb-2">銀行振込でお支払い</p>
                  <p className="text-sm text-gray-400">登録完了後、振込先情報をメールでお送りします。お振込み確認後、サービスが有効化されます。</p>
                </div>
              )}
              
              {/* コンビニ払い */}
              {form.paymentMethod === "convenience" && (
                <div className="mt-6 p-4 bg-gray-800/50 border border-gray-600 rounded-lg">
                  <p className="text-gray-300 mb-2">コンビニでお支払い</p>
                  <p className="text-sm text-gray-400">登録完了後、お支払い番号をメールでお送りします。お支払い確認後、サービスが有効化されます。</p>
                  <div className="flex gap-2 mt-3 text-2xl">
                    🏪 ローソン・ファミマ・セブン・ミニストップ
                  </div>
                </div>
              )}
            </div>
          );
        } else {
          // 無料プランの確認ステップ
          return renderConfirmStep();
        }
      
      case 10:
        // 有料プランの確認ステップ
        return renderConfirmStep();
      
      default:
        return null;
    }
  };
  
  // 確認ステップの共通レンダリング
  const renderConfirmStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-indigo-300 mb-6 flex items-center gap-2">
        ✅ 登録内容の確認
      </h2>
      
      <div className="bg-gray-800/50 rounded-lg p-4 space-y-3 text-sm">
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">選択プラン</span>
          <span className="text-amber-400 font-bold">{planName}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">メールアドレス</span>
          <span className="text-gray-200">{form.email}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">お名前</span>
          <span className="text-gray-200">{form.lastName} {form.firstName}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">ユーザー名</span>
          <span className="text-gray-200">@{form.username}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">表示名</span>
          <span className="text-gray-200">{form.displayName}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">国</span>
          <span className="text-gray-200">{countries.find(c => c.code === form.country)?.name}</span>
        </div>
        {form.phoneNumber && (
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">電話番号</span>
            <span className="text-gray-200">{form.phoneCountryCode} {form.phoneNumber}</span>
          </div>
        )}
        {form.creatorTypes.length > 0 && (
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">クリエイタータイプ</span>
            <span className="text-gray-200">
              {form.creatorTypes.map(t => creatorTypes.find(ct => ct.id === t)?.icon).join(' ')}
            </span>
          </div>
        )}
        {isPaidPlan && (
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">支払い方法</span>
            <span className="text-gray-200">
              {paymentMethods.find(m => m.id === form.paymentMethod)?.icon} {paymentMethods.find(m => m.id === form.paymentMethod)?.label}
            </span>
          </div>
        )}
        {isPaidPlan && form.paymentMethod === "credit_card" && form.cardNumber && (
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">カード番号</span>
            <span className="text-gray-200">**** **** **** {form.cardNumber.slice(-4)}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3 pt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-300">
            <Link href={`/${currentLocale}/terms`} className="text-indigo-400 underline">利用規約</Link>
            と
            <Link href={`/${currentLocale}/privacy`} className="text-indigo-400 underline">プライバシーポリシー</Link>
            に同意します <span className="text-red-400">*</span>
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="newsletter"
            checked={form.newsletter}
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-300">
            お得な情報やニュースレターを受け取る
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">新規登録</h1>
          <p className="text-gray-400">
            選択プラン: <span className="text-amber-400 font-bold">{planName}</span>
          </p>
        </div>
        
        {/* ステップインジケーター */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* 進捗バー */}
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-700 -z-10"></div>
            <div 
              className="absolute top-4 left-0 h-1 bg-indigo-500 -z-10 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <button
                  onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                  disabled={step.id > currentStep}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step.id === currentStep
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-500/30"
                      : step.id < currentStep
                      ? "bg-green-500 text-white cursor-pointer"
                      : "bg-gray-700 text-gray-500"
                  }`}
                >
                  {step.id < currentStep ? "✓" : step.id}
                </button>
                <span className={`text-xs mt-1 hidden sm:block ${
                  step.id === currentStep ? "text-indigo-400" : "text-gray-500"
                }`}>
                  {step.icon}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* フォームカード */}
        <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
          
          {/* ステップコンテンツ */}
          {renderStepContent()}
          
          {/* エラー表示 */}
          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {/* ナビゲーションボタン */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                currentStep === 1
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              ← 戻る
            </button>
            
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 transition-all"
              >
                次へ →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-8 py-3 rounded-lg font-bold transition-all ${
                  isLoading
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    登録中...
                  </span>
                ) : (
                  "🎉 登録完了"
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* フッターリンク */}
        <div className="mt-6 text-center">
          <Link href={`/${currentLocale}/signin`} className="text-indigo-400 hover:underline">
            すでにアカウントをお持ちの方はこちら
          </Link>
        </div>
      </div>
    </div>
  );
}

const RegisterPage: React.FC = () => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-gray-300">読み込み中...</div>
    </div>
  }>
    <RegisterPageInner />
  </Suspense>
);

export default RegisterPage;
