"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";


import { Suspense } from "react";

function RegisterPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get("plan") || "Free";
  const defaultForm = {
    username:
      plan === "Free" ? "free_user_01" :
      plan === "Basic" ? "basic_user_01" :
      plan === "Premium" ? "premium_user_01" :
      plan === "Enterprise" ? "enterprise_user_01" : "",
    email:
      plan === "Free" ? "free01@example.com" :
      plan === "Basic" ? "basic01@example.com" :
      plan === "Premium" ? "premium01@example.com" :
      plan === "Enterprise" ? "enterprise01@example.com" : "",
    password:
      plan === "Free" ? "freepass" :
      plan === "Basic" ? "basicpass" :
      plan === "Premium" ? "premiumpass" :
      plan === "Enterprise" ? "enterprisepass" : "",
    displayName:
      plan === "Free" ? "Freeユーザー" :
      plan === "Basic" ? "Basicユーザー" :
      plan === "Premium" ? "Premiumユーザー" :
      plan === "Enterprise" ? "Enterpriseユーザー" : "",
    bio:
      plan === "Free" ? "Freeプランのユーザーです。" :
      plan === "Basic" ? "Basicプランのユーザーです。" :
      plan === "Premium" ? "Premiumプランのユーザーです。" :
      plan === "Enterprise" ? "Enterpriseプランのユーザーです。" : "",
    birthDate: "",
    gender: "",
    location: "",
    agree: false,
    plan,
  };
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === "checkbox" && "checked" in e.target) {
      fieldValue = (e.target as HTMLInputElement).checked;
    }
    setForm(prev => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.displayName || !form.agree) {
      setError("必須項目をすべて入力し、規約に同意してください。");
      return;
    }
    setError("");
    setSuccess(true);
    // TODO: API連携（form.planも送信）
    setTimeout(() => router.push("/signin?plan=" + encodeURIComponent(form.plan)), 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-900 via-gray-950 to-purple-950">
      <div className="w-full max-w-lg bg-linear-to-br from-gray-800 via-gray-900 to-purple-900 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-purple-200 drop-shadow-lg font-pt-serif">新規登録</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="plan" value={form.plan} />
          <div className="mb-2 text-xs text-purple-300 text-right">選択プラン: <span className="font-bold">{form.plan}</span></div>
          <div>
            <label className="block text-sm font-medium mb-1 text-purple-100">ユーザー名 *</label>
            <input type="text" name="username" value={form.username} onChange={handleChange} className="w-full border border-purple-400 bg-gray-950 text-purple-100 rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-purple-100">表示名 *</label>
            <input type="text" name="displayName" value={form.displayName} onChange={handleChange} className="w-full border border-purple-400 bg-gray-950 text-purple-100 rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-purple-100">メールアドレス *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-purple-400 bg-gray-950 text-purple-100 rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-purple-100">パスワード *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full border border-purple-400 bg-gray-950 text-purple-100 rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-purple-100">自己紹介</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full border border-purple-400 bg-gray-950 text-purple-100 rounded px-3 py-2" rows={2} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-purple-100">生年月日</label>
              <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} className="w-full border border-purple-400 bg-gray-950 text-purple-100 rounded px-3 py-2" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-purple-100">性別</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full border border-purple-400 bg-gray-950 text-purple-100 rounded px-3 py-2">
                <option value="">選択しない</option>
                <option value="M">男性</option>
                <option value="F">女性</option>
                <option value="O">その他</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-purple-100">居住地</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full border border-purple-400 bg-gray-950 text-purple-100 rounded px-3 py-2" />
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} className="mr-2" required />
            <span className="text-xs text-purple-100"> <Link href="/terms" className="underline text-purple-300">利用規約</Link> に同意します *</span>
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {success && <div className="text-green-400 text-sm">登録が完了しました。サインインしてください。</div>}
          <button type="submit" className="w-full bg-linear-to-r from-purple-600 to-purple-400 text-white py-2 rounded hover:from-purple-700 hover:to-purple-500 font-semibold shadow-lg transition-colors duration-200">登録してサインインへ</button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/signin" className="text-purple-300 hover:underline">すでにアカウントをお持ちの方はこちら</Link>
        </div>
      </div>
    </div>
  );
}

const RegisterPage: React.FC = () => (
  <Suspense>
    <RegisterPageInner />
  </Suspense>
);

export default RegisterPage
