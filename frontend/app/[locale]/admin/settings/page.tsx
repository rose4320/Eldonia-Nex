'use client';

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { FiAlertTriangle, FiBell, FiBox, FiCalendar, FiCheckCircle, FiCpu, FiDollarSign, FiEdit3, FiFileText, FiInfo, FiPlus, FiSave, FiSearch, FiSettings, FiShield, FiTarget, FiTool, FiTrash2, FiZap } from 'react-icons/fi';

interface SystemSetting {
  id: number;
  key: string;
  value: any;
  category: string;
  data_type: 'STRING' | 'BOOLEAN' | 'INTEGER' | 'FLOAT' | 'JSON';
  description: string;
  is_public: boolean;
}

const CATEGORIES = [
  { id: 'ALL', label: 'すべての設定', icon: <FiBox /> },
  { id: 'CHALLENGE', label: '今週・今月のお題', icon: <FiZap /> },
  { id: 'SITE', label: 'サイト基本設定', icon: <FiSettings /> },
  { id: 'SECURITY', label: 'セキュリティ', icon: <FiShield /> },
  { id: 'FEATURES', label: '機能フラグ', icon: <FiCpu /> },
  { id: 'MAINTENANCE', label: 'メンテナンス', icon: <FiTool /> },
  { id: 'GAMIFICATION', label: 'ゲーミフィケーション', icon: <FiTarget /> },
  { id: 'FINANCE', label: '財務・手数料', icon: <FiDollarSign /> },
  { id: 'CONTENT', label: 'コンテンツ・UI', icon: <FiFileText /> },
];

export default function AdminSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const { locale } = use(params);
  const [activeTab, setActiveTab] = useState<'SETTINGS' | 'PAGES' | 'NOTIFICATIONS' | 'USERS'>('SETTINGS');
  const [noteType, setNoteType] = useState<'BROADCAST' | 'INDIVIDUAL' | 'CONDITIONAL'>('BROADCAST');
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [savingId, setSavingId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [showNewPageForm, setShowNewPageForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const createPage = async (payload: any) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/settings/pages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setPages(prev => [data, ...prev]);
        setShowNewPageForm(false);
        showNotification('success', '新しいページを作成しました');
      } else {
        showNotification('error', '作成に失敗しました');
      }
    } catch (e) {
      showNotification('error', 'ネットワークエラー');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    if (!token) {
      router.push(`/${locale}/signin`);
      return;
    }

    try {
      let endpoint = '';
      if (activeTab === 'SETTINGS') endpoint = '/api/v1/settings/admin/?page_size=100';
      else if (activeTab === 'PAGES') endpoint = '/api/v1/settings/pages/?page_size=100';
      else if (activeTab === 'NOTIFICATIONS') endpoint = '/api/v1/settings/notifications/?page_size=100';
      else if (activeTab === 'USERS') endpoint = '/api/v1/users/admin/management/?page_size=100';

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const results = Array.isArray(data) ? data : (data.results || []);

        if (activeTab === 'SETTINGS') setSettings(results);
        else if (activeTab === 'PAGES') setPages(results);
        else if (activeTab === 'NOTIFICATIONS') setNotifications(results);
        else if (activeTab === 'USERS') setUsers(results);
      } else if (res.status === 401 || res.status === 403) {
        router.push(`/${locale}/signin`);
      }
    } catch (err) {
      console.error(`Fetch error for ${activeTab}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (setting: SystemSetting, newValue: any) => {
    setSavingId(setting.id);
    try {
      const token = localStorage.getItem('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/v1/settings/admin/${setting.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ value: newValue })
      });

      if (res.ok) {
        const updated = await res.json();
        setSettings(prev => prev.map(s => s.id === updated.id ? updated : s));
        showNotification('success', `${setting.key} を保存しました`);
      } else {
        showNotification('error', `${setting.key} の保存に失敗しました`);
      }
    } catch (error) {
      showNotification('error', 'ネットワークエラーが発生しました');
    } finally {
      setSavingId(null);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateUser = async (user: any, fields: any) => {
    setSavingId(user.id);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/users/admin/management/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(fields)
      });

      if (res.ok) {
        const updated = await res.json();
        setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
        showNotification('success', `${user.username} を更新しました`);
      } else {
        showNotification('error', `更新に失敗しました`);
      }
    } catch (error) {
      showNotification('error', 'ネットワークエラー');
    } finally {
      setSavingId(null);
    }
  };

  const deletePage = async (id: number) => {
    if (!confirm('本当にこのページを削除しますか？')) return;
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/settings/pages/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      });
      if (res.ok) {
        setPages(prev => prev.filter(p => p.id !== id));
        showNotification('success', 'ページを削除しました');
      }
    } catch (e) { showNotification('error', '削除に失敗しました'); }
  };

  const filteredSettings = settings.filter(s => {
    const sCat = (s.category || '').trim().toUpperCase();
    const activeCat = activeCategory.trim().toUpperCase();

    const matchesCategory = activeCat === 'ALL' || sCat === activeCat;
    const matchesSearch = s.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  console.log('Filter Update:', { activeCategory, count: filteredSettings.length });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1b] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1b] text-gray-100 p-8 font-sans selection:bg-indigo-500/30">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter" style={{ fontFamily: 'var(--font-inter), sans-serif', textTransform: 'uppercase' }}>
                MASTER <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">CONTROL</span>
              </h1>
              <p className="text-gray-400 font-medium">マスターコントロールセンター - システム構成と監視</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-gray-900/50 p-1 rounded-2xl border border-gray-700/50 backdrop-blur-xl shrink-0">
              {(['SETTINGS', 'PAGES', 'NOTIFICATIONS', 'USERS'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    console.log('Tab Switched to:', tab);
                    setActiveTab(tab);
                  }}
                  className={`
                  px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300
                  ${activeTab === tab
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-gray-400 hover:text-gray-200'}
                `}
                >
                  {tab === 'SETTINGS' ? 'システム設定' : tab === 'PAGES' ? 'カスタムページ' : tab === 'NOTIFICATIONS' ? '通知管理' : 'ユーザー管理'}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Controls based on Tab */}
          {activeTab === 'SETTINGS' && (
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="relative group">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  placeholder="キーまたは説明で検索..."
                  className="bg-gray-800/40 border border-gray-700/50 rounded-2xl py-3 pl-12 pr-6 w-full md:w-80 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-gray-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>


        {activeTab === 'SETTINGS' ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 space-y-4">
              <div className="bg-gray-800/20 border border-gray-700/30 rounded-3xl p-4 backdrop-blur-xl">
                <div className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        console.log('Category Selection:', cat.id);
                        setActiveCategory(cat.id);
                      }}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300
                        ${activeCategory === cat.id
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                          : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-200 border border-transparent'}
                        ${activeCategory === cat.id ? 'ring-2 ring-indigo-500/40' : ''}
                      `}
                    >
                      <span className={`text-lg ${activeCategory === cat.id ? 'text-indigo-400' : 'text-gray-500'}`}>
                        {cat.icon}
                      </span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Settings Grid */}
            <main className="flex-1 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {CATEGORIES.find(c => c.id === activeCategory)?.label || 'すべての設定'}
                  <span className="text-xs font-normal text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700">
                    {filteredSettings.length} 件
                  </span>
                </h2>
              </div>

              {/* Special Challenge Editor for CHALLENGE category */}
              {(activeCategory === 'CHALLENGE' || (activeCategory === 'ALL' && !searchQuery)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {['CHALLENGE_WEEKLY', 'CHALLENGE_MONTHLY'].map(key => {
                    const setting = settings.find(s => s.key === key);
                    if (!setting) return null;
                    const isWeekly = key === 'CHALLENGE_WEEKLY';

                    const announceTheme = async (theme: string) => {
                      const token = localStorage.getItem('authToken');
                      const title = isWeekly ? '今週のお題が更新されました' : '今月のお題が更新されました';
                      const message = `新しいお題は「${theme}」です！あなたの作品をお待ちしています。`;

                      try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/settings/notifications/`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${token}`
                          },
                          body: JSON.stringify({ title, message, notification_type: 'INFO' })
                        });
                        if (res.ok) {
                          showNotification('success', 'お題を全ユーザーに告知しました');
                          fetchData();
                        }
                      } catch (e) {
                        showNotification('error', '告知に失敗しました');
                      }
                    };

                    return (
                      <div key={key} className="relative group bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-[2.5rem] p-8 backdrop-blur-xl overflow-hidden transition-all hover:border-indigo-400/50 shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                          {isWeekly ? <FiZap className="text-6xl text-indigo-400" /> : <FiCalendar className="text-6xl text-purple-400" />}
                        </div>
                        <div className="relative z-10">
                          <span className={`inline-block px-3 py-1 ${isWeekly ? 'bg-indigo-500/20 text-indigo-300' : 'bg-purple-500/20 text-purple-300'} text-[10px] font-black uppercase tracking-widest rounded-full mb-4 border border-indigo-500/20`}>
                            {isWeekly ? '今週のお題' : '今月のお題'}
                          </span>
                          <div className="space-y-4">
                            <textarea
                              id={`textarea-${key}`}
                              defaultValue={setting.value}
                              placeholder="お題を入力..."
                              className="w-full bg-black/40 border border-gray-700/50 rounded-2xl p-4 text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600 resize-none h-24"
                            />

                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const val = (document.getElementById(`textarea-${key}`) as HTMLTextAreaElement).value;
                                  updateSetting(setting, val);
                                }}
                                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                              >
                                <FiSave /> 保存する
                              </button>
                              <button
                                onClick={() => {
                                  const val = (document.getElementById(`textarea-${key}`) as HTMLTextAreaElement).value;
                                  announceTheme(val);
                                }}
                                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                              >
                                <FiBell /> 告知を送信
                              </button>
                            </div>

                            {savingId === setting.id && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[2rem]">
                                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSettings
                  .filter(s => !['CHALLENGE_WEEKLY', 'CHALLENGE_MONTHLY'].includes(s.key) || (activeCategory !== 'CHALLENGE' && activeCategory !== 'ALL'))
                  .map(setting => (
                    <div
                      key={setting.id}
                      className="group bg-gray-800/30 border border-gray-700/50 rounded-3xl p-6 backdrop-blur-xl hover:border-gray-600/50 transition-all hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400/80 mb-1 block">
                            {setting.category}
                          </span>
                          <h3 className="text-lg font-bold text-gray-100">{setting.key}</h3>
                        </div>
                        {setting.is_public && (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full border border-green-500/20">
                            公開設定
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                        {setting.description || '説明がありません。'}
                      </p>

                      <div className="flex items-center gap-4">
                        {/* Control Rendering based on Data Type */}
                        <div className="flex-1">
                          {setting.data_type === 'BOOLEAN' ? (
                            <button
                              onClick={() => updateSetting(setting, !setting.value)}
                              className={`
                              relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none
                              ${setting.value ? 'bg-indigo-500' : 'bg-gray-700'}
                            `}
                            >
                              <span className={`
                              inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                              ${setting.value ? 'translate-x-[1.75rem]' : 'translate-x-1'}
                            `} />
                            </button>
                          ) : setting.data_type === 'STRING' || setting.data_type === 'INTEGER' || setting.data_type === 'FLOAT' ? (
                            <input
                              type={setting.data_type === 'STRING' ? 'text' : 'number'}
                              step={setting.data_type === 'FLOAT' ? 'any' : '1'}
                              defaultValue={setting.value}
                              onBlur={(e) => {
                                let val;
                                if (setting.data_type === 'INTEGER') val = parseInt(e.target.value);
                                else if (setting.data_type === 'FLOAT') val = parseFloat(e.target.value);
                                else val = e.target.value;

                                if (val !== setting.value && !isNaN(val as any)) updateSetting(setting, val);
                              }}
                              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none transition-all"
                            />
                          ) : (
                            <textarea
                              defaultValue={JSON.stringify(setting.value, null, 2)}
                              onBlur={(e) => {
                                try {
                                  const val = JSON.parse(e.target.value);
                                  if (JSON.stringify(val) !== JSON.stringify(setting.value)) updateSetting(setting, val);
                                } catch (e) {
                                  showNotification('error', '無効なJSON形式です');
                                }
                              }}
                              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2 text-xs font-mono h-24 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                            />
                          )}
                        </div>

                        <div className="w-8 h-8 flex items-center justify-center">
                          {savingId === setting.id ? (
                            <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FiSave className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {filteredSettings.length === 0 && (
                <div className="text-center py-20 bg-gray-800/10 rounded-3xl border border-dashed border-gray-700">
                  <FiInfo className="text-4xl text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">条件に一致する設定が見つかりません。</p>
                </div>
              )}
            </main>
          </div>
        ) : activeTab === 'PAGES' ? (
          <div className="bg-gray-800/20 border border-gray-700/50 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">カスタムページ管理</h2>
              <button
                onClick={() => setShowNewPageForm(true)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
              >
                <FiPlus /> 新規ページ作成
              </button>
            </div>

            {showNewPageForm && (
              <div className="mb-8 bg-gray-900/60 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FiPlus className="text-indigo-400" /> 新しい固定ページの作成
                </h3>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  createPage({
                    title: formData.get('title'),
                    slug: formData.get('slug'),
                    content: formData.get('content'),
                    is_published: true
                  });
                }}>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ページタイトル</label>
                    <input name="title" required placeholder="例: 利用規約" className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:border-indigo-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">スラッグ (URL)</label>
                    <input name="slug" required placeholder="例: terms-of-service" className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:border-indigo-500 outline-none" />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">内容 (Markdown対応)</label>
                    <textarea name="content" required className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none h-48 resize-none" />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowNewPageForm(false)} className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">キャンセル</button>
                    <button type="submit" className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all">作成を保存</button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {pages.map(page => (
                <div key={page.id} className="bg-gray-900/40 border border-gray-700/50 rounded-2xl p-4 flex items-center justify-between hover:border-indigo-500/30 transition-all">
                  <div>
                    <h3 className="font-bold text-gray-100">{page.title}</h3>
                    <p className="text-xs text-gray-500">/{page.slug} • 最終更新: {new Date(page.updated_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-all">
                      <FiEdit3 size={16} />
                    </button>
                    <button
                      onClick={() => deletePage(page.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-all"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {pages.length === 0 && <p className="text-center text-gray-500 py-10">カスタムページはまだ作成されていません。</p>}
            </div>
          </div>
        ) : activeTab === 'USERS' ? (
          <div className="bg-gray-800/20 border border-gray-700/50 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold text-white">ユーザー管理 & EXP調整</h2>
              <div className="relative w-full md:w-64 group">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  placeholder="ユーザー名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-4 py-4">ユーザー</th>
                    <th className="px-4 py-4">レベル</th>
                    <th className="px-4 py-4">累計EXP</th>
                    <th className="px-4 py-4">ステータス</th>
                    <th className="px-4 py-4">プラン</th>
                    <th className="px-4 py-4 text-right">アクション</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {users.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                    <tr key={u.id} className="hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">
                            {u.username[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-gray-100">{u.username}</div>
                            <div className="text-[10px] text-gray-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="number"
                          defaultValue={u.current_level}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            if (val !== u.current_level) updateUser(u, { current_level: val });
                          }}
                          className="w-16 bg-gray-900/50 border border-gray-700 rounded-lg px-2 py-1 text-sm outline-none focus:border-indigo-500/50"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="number"
                          defaultValue={u.total_exp}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            if (val !== u.total_exp) updateUser(u, { total_exp: val });
                          }}
                          className="w-24 bg-gray-900/50 border border-gray-700 rounded-lg px-2 py-1 text-sm outline-none focus:border-indigo-500/50"
                        />
                      </td>
                      <td className="px-4 py-4 uppercase text-[10px] font-bold">
                        <span className={`px-2 py-0.5 rounded-full ${u.account_status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {u.account_status}
                        </span>
                      </td>
                      <td className="px-4 py-4 uppercase text-[10px] font-bold text-indigo-300">
                        {u.subscription}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="w-8 h-8 inline-flex items-center justify-center">
                          {savingId === u.id ? (
                            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FiSave className="text-gray-600 opacity-0 group-hover:opacity-100" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-center text-gray-500 py-10 font-medium">ユーザーが見つかりません。</p>}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gray-800/20 border border-gray-700/50 rounded-3xl p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-8">通知履歴</h2>
              <div className="space-y-4">
                {notifications.map(note => (
                  <div key={note.id} className="bg-gray-900/40 border border-gray-700/50 rounded-2xl p-4 flex items-center justify-between hover:border-gray-600 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${note.notification_type === 'ALERT' ? 'bg-red-500' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`} />
                      <div>
                        <h3 className="font-bold text-gray-100">{note.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">{note.message}</p>
                        <p className="text-[10px] text-gray-600 mt-2 font-mono">
                          {new Date(note.created_at).toLocaleString()}
                          {note.recipient && <span className="ml-2 text-indigo-400/60">対象: User#{note.recipient}</span>}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-800/80 px-2 py-1 rounded-md border border-gray-700/50">
                      {note.recipient ? '個別' : note.criteria ? '条件指定' : '全体'}
                    </span>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center py-20 bg-gray-900/20 rounded-2xl border border-dashed border-gray-800">
                    <p className="text-gray-600">通知履歴がありません。</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-6">新規通知作成</h2>
              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const type = formData.get('type') as string;
                const body: any = {
                  title: formData.get('title'),
                  message: formData.get('message'),
                  notification_type: 'INFO',
                };

                if (type === 'INDIVIDUAL') body.recipient = formData.get('user_id');
                if (type === 'CONDITIONAL') body.criteria = JSON.parse(formData.get('criteria') as string || '{}');

                const token = localStorage.getItem('authToken');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/settings/notifications/`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                  },
                  body: JSON.stringify(body)
                });
                if (res.ok) {
                  showNotification('success', '通知を送信しました');
                  fetchData();
                } else {
                  showNotification('error', '送信に失敗しました');
                }
              }}>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 shadow-sm block">通知タイプ</label>
                  <select
                    name="type"
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value as any)}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:border-indigo-500 outline-none"
                  >
                    <option value="BROADCAST">全体通知 (全員)</option>
                    <option value="INDIVIDUAL">個別通知 (ユーザー指定)</option>
                    <option value="CONDITIONAL">条件指定 (メタデータ)</option>
                  </select>
                </div>
                {noteType === 'INDIVIDUAL' && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">ユーザーID</label>
                    <input name="user_id" placeholder="123" required className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:border-indigo-500 outline-none" />
                  </div>
                )}
                {noteType === 'CONDITIONAL' && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">条件 (JSON)</label>
                    <textarea name="criteria" placeholder='{"min_level": 5}' required className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:border-indigo-500 outline-none h-20 font-mono" />
                  </div>
                )}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">タイトル</label>
                  <input name="title" required className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">メッセージ</label>
                  <textarea name="message" required className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:border-indigo-500 outline-none h-32 resize-none" />
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all">
                    送信を実行
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div >

      {/* Persistence Notification */}
      {
        notification && (
          <div className={`
          fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-2xl border flex items-center gap-4 animate-in slide-in-from-bottom-5 fade-in duration-300
          ${notification.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-300'
              : 'bg-red-500/10 border-red-500/20 text-red-300'}
        `}>
            {notification.type === 'success' ? <FiCheckCircle /> : <FiAlertTriangle />}
            <span className="font-semibold">{notification.message}</span>
          </div>
        )
      }
    </div >
  );
}
