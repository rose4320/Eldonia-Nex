'use client'

import { useAuth } from '@/app/context/AuthContext'
import PageHero from '@/components/common/PageHero'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

// APIベースURL取得
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000/api/v1';
    }
    return `http://${hostname}:8000/api/v1`;
  }
  return 'http://localhost:8000/api/v1';
};

// 画像URLを絶対URLに変換
const getFullImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const backendHost = hostname === 'localhost' || hostname === '127.0.0.1' 
      ? 'http://localhost:8000' 
      : `http://${hostname}:8000`;
    return `${backendHost}${url}`;
  }
  return `http://localhost:8000${url}`;
};

// ポートフォリオ型（クリエイター検索用）
interface Portfolio {
  id: number
  user_id: number
  username: string
  display_name: string
  avatar_url: string
  title: string
  description: string
  work_type: string
  thumbnail_url: string
  tags: string[] | null
  tools_used: string[] | null
  is_featured: boolean
  view_count: number
  like_count: number
  created_at: string
}

// 求人型
interface Job {
  id: string
  title: string
  company: string
  companyLevel: number
  category: string
  budget: string
  budgetType: '固定報酬' | '時給' | '要相談'
  deadline: string
  applicants: number
  tags: string[]
  description: string
  isUrgent: boolean
  isRemote: boolean
}

// 自分のポートフォリオ型
interface MyPortfolio {
  id: number
  title: string
  work_type: string
  thumbnail_url: string
  visibility: 'public' | 'unlisted' | 'private'
}

interface FilterState {
  search: string
  category: string
  budgetType: string
  workStyle: string
  sortBy: string
}

const Jobs: React.FC = () => {
  const { user } = useAuth()
  const pathname = usePathname()
  const currentLocale = pathname?.split('/')[1] || 'ja'
  const [activeTab, setActiveTab] = useState<'jobs' | 'creators'>('jobs')
  const [jobs, setJobs] = useState<Job[]>([])
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [myPortfolios, setMyPortfolios] = useState<MyPortfolio[]>([])
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'すべて',
    budgetType: 'すべて',
    workStyle: 'すべて',
    sortBy: '新着順'
  })
  const [creatorFilter, setCreatorFilter] = useState<string>('すべて')
  const [creatorSearch, setCreatorSearch] = useState<string>('')
  const [loading, setLoading] = useState(true)
  
  // 応募モーダル
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [applyMessage, setApplyMessage] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  
  // オファーモーダル
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [selectedCreator, setSelectedCreator] = useState<Portfolio | null>(null)
  const [offerMessage, setOfferMessage] = useState('')
  const [offerBudget, setOfferBudget] = useState('')

  // クリエイター一覧（ポートフォリオベース）取得
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const API_BASE_URL = getApiBaseUrl();
        const res = await fetch(`${API_BASE_URL}/portfolios/`);
        if (res.ok) {
          const data = await res.json();
          setPortfolios(data.portfolios || []);
        }
      } catch (error) {
        console.error('Portfolio fetch error:', error);
      }
    };
    fetchPortfolios();
  }, []);

  // 自分のポートフォリオ取得（応募時に使用）
  useEffect(() => {
    if (user) {
      const fetchMyPortfolios = async () => {
        try {
          const authToken = localStorage.getItem('authToken');
          const API_BASE_URL = getApiBaseUrl();
          const res = await fetch(`${API_BASE_URL}/portfolios/me/`, {
            headers: { 'Authorization': `Token ${authToken}` },
            credentials: 'include',
          });
          if (res.ok) {
            const data = await res.json();
            setMyPortfolios(data);
          }
        } catch (error) {
          console.error('My portfolio fetch error:', error);
        }
      };
      fetchMyPortfolios();
    }
  }, [user]);

  // モック求人データ
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'ゲームキャラクターイラスト制作',
        company: 'ゲーム開発スタジオA',
        companyLevel: 30,
        category: 'イラスト',
        budget: '¥50,000 - ¥100,000',
        budgetType: '固定報酬',
        deadline: '2024/02/28',
        applicants: 12,
        tags: ['イラスト', 'ゲーム', 'キャラクター'],
        description: 'スマホゲーム用のキャラクターイラスト10点の制作依頼です。',
        isUrgent: true,
        isRemote: true
      },
      {
        id: '2',
        title: 'YouTube動画編集スタッフ募集',
        company: 'クリエイター事務所B',
        companyLevel: 25,
        category: '動画編集',
        budget: '¥2,000/時間',
        budgetType: '時給',
        deadline: '2024/03/15',
        applicants: 8,
        tags: ['動画編集', 'YouTube', '継続案件'],
        description: 'YouTuberの動画編集を継続的にお願いできる方を募集。',
        isUrgent: false,
        isRemote: true
      },
      {
        id: '3',
        title: '3Dアバター制作',
        company: 'VTuber事務所C',
        companyLevel: 28,
        category: '3Dモデル',
        budget: '¥200,000 - ¥300,000',
        budgetType: '固定報酬',
        deadline: '2024/03/31',
        applicants: 5,
        tags: ['3D', 'VTuber', 'Live2D'],
        description: 'VTuber用のLive2D対応3Dアバター制作。',
        isUrgent: false,
        isRemote: true
      },
      {
        id: '4',
        title: 'BGM・効果音制作',
        company: 'インディーゲーム開発者',
        companyLevel: 20,
        category: '音楽',
        budget: '要相談',
        budgetType: '要相談',
        deadline: '2024/04/30',
        applicants: 15,
        tags: ['BGM', '効果音', 'ゲーム'],
        description: 'インディーゲーム用のBGMと効果音の制作依頼。',
        isUrgent: false,
        isRemote: true
      },
    ];
    setTimeout(() => {
      setJobs(mockJobs);
      setLoading(false);
    }, 300);
  }, []);

  // 求人フィルタリング
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                          job.company.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'すべて' || job.category === filters.category;
      const matchesBudgetType = filters.budgetType === 'すべて' || job.budgetType === filters.budgetType;
      const matchesWorkStyle = filters.workStyle === 'すべて' || 
                               (filters.workStyle === 'リモート' && job.isRemote) ||
                               (filters.workStyle === 'オンサイト' && !job.isRemote);
      return matchesSearch && matchesCategory && matchesBudgetType && matchesWorkStyle;
    });
  }, [jobs, filters]);

  // クリエイターフィルタリング
  const filteredCreators = useMemo(() => {
    let result = portfolios;
    
    // カテゴリフィルター
    if (creatorFilter !== 'すべて') {
      const typeMap: Record<string, string> = {
        'イラスト': 'illustration',
        '3Dモデル': '3d',
        '動画': 'video',
        '音楽': 'music',
        'デザイン': 'design',
        '漫画': 'manga',
      };
      result = result.filter(p => p.work_type === typeMap[creatorFilter]);
    }
    
    // 検索フィルター
    if (creatorSearch) {
      result = result.filter(p => 
        p.display_name.toLowerCase().includes(creatorSearch.toLowerCase()) ||
        p.title.toLowerCase().includes(creatorSearch.toLowerCase()) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(creatorSearch.toLowerCase())))
      );
    }
    
    return result;
  }, [portfolios, creatorFilter, creatorSearch]);

  // 作品タイプの日本語変換
  const getWorkTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'illustration': 'イラスト',
      'manga': '漫画',
      'animation': 'アニメーション',
      '3d': '3Dモデル',
      'music': '音楽',
      'video': '動画',
      'novel': '小説',
      'game': 'ゲーム',
      'design': 'デザイン',
      'photo': '写真',
      'other': 'その他',
    };
    return labels[type] || type;
  };

  // レベルから称号を計算
  const getTitleFromLevel = (level: number): string => {
    if (level >= 100) return '🏆 レジェンド';
    if (level >= 80) return '👑 マスター';
    if (level >= 60) return '⭐ エキスパート';
    if (level >= 40) return '💎 アドバンス';
    if (level >= 20) return '🌟 インターミディエイト';
    if (level >= 10) return '✨ ビギナー';
    return '🌱 ルーキー';
  };

  // 応募モーダルを開く
  const openApplyModal = (job: Job) => {
    if (!user) {
      alert('応募するにはログインが必要です');
      return;
    }
    setSelectedJob(job);
    setApplyMessage('');
    setShowApplyModal(true);
  };

  // 公開設定のポートフォリオのみ取得（ダッシュボードの設定に基づく）
  const publicPortfolios = myPortfolios.filter(p => p.visibility === 'public');

  // 応募を送信（自動でポートフォリオとユーザー情報が添付される）
  const submitApplication = async () => {
    if (!selectedJob || !user) return;
    setIsApplying(true);

    // 応募データを構築（公開設定のポートフォリオのみ自動添付）
    const applicationData = {
      job_id: selectedJob.id,
      message: applyMessage,
      // 自動添付されるユーザー情報
      applicant: {
        user_id: user.id,
        username: user.username,
        display_name: user.display_name || user.username,
        avatar_url: user.avatar_url,
        level: user.level || 1,
        exp: user.exp || 0,
        title: getTitleFromLevel(user.level || 1),
      },
      // 自動添付されるポートフォリオ（公開設定のみ）
      portfolios: publicPortfolios.map(p => ({
        id: p.id,
        title: p.title,
        work_type: p.work_type,
        thumbnail_url: p.thumbnail_url,
      })),
    };

    // TODO: API実装時にここでPOST
    console.log('Application data:', applicationData);

    setTimeout(() => {
      setIsApplying(false);
      setShowApplyModal(false);
      alert(`「${selectedJob.title}」に応募しました！\n\n【自動添付情報】\n・ユーザーLv: ${user.level || 1}\n・称号: ${getTitleFromLevel(user.level || 1)}\n・公開ポートフォリオ: ${publicPortfolios.length}件`);
    }, 500);
  };

  // オファーモーダルを開く
  const openOfferModal = (creator: Portfolio) => {
    setSelectedCreator(creator);
    setOfferMessage('');
    setOfferBudget('');
    setShowOfferModal(true);
  };

  // オファーを送信
  const submitOffer = async () => {
    if (!selectedCreator) return;
    // TODO: API実装
    alert(`${selectedCreator.display_name}さんにオファーを送信しました！`);
    setShowOfferModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        
        {/* ヒーローセクション */}
        <PageHero
          title="WORKS"
          subtitle="Find Projects & Talents"
          backgroundOpacity={5}
        />

        {/* タブ切り替え */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'jobs'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-700/60'
            }`}
          >
            💼 求人・案件を探す
          </button>
          <button
            onClick={() => setActiveTab('creators')}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'creators'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                : 'bg-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-700/60'
            }`}
          >
            🎨 クリエイターを探す
          </button>
        </div>

        {/* 求人・案件タブ */}
        {activeTab === 'jobs' && (
          <>
            {/* フィルター */}
            <div className="border border-gray-600/30 rounded-xl p-6 mb-8 bg-gray-800/60 backdrop-blur-md">
              <div className="flex flex-col lg:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="案件・キーワード検索"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-600/40 rounded-lg bg-gray-700/50 text-gray-100 placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['すべて', 'イラスト', '3Dモデル', '動画編集', '音楽', 'デザイン'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilters({ ...filters, category: cat })}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      filters.category === cat
                        ? 'bg-indigo-500/80 text-white'
                        : 'text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 求人リスト */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="group border border-gray-600/20 rounded-xl p-6 bg-gray-800/60 hover:border-indigo-500/50 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {job.isUrgent && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">急募</span>
                        )}
                        {job.isRemote && (
                          <span className="bg-green-500/80 text-white text-xs px-2 py-1 rounded-full">リモート可</span>
                        )}
                        <span className="text-gray-500 text-xs">締切: {job.deadline}</span>
                      </div>
                      <h3 className="font-bold text-gray-100 text-lg mb-2 group-hover:text-indigo-300 transition-colors">{job.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{job.company} (Lv.{job.companyLevel})</p>
                      <p className="text-gray-500 text-sm mb-3">{job.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-indigo-900/30 rounded-full text-xs text-indigo-300">#{tag}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="lg:text-right space-y-2">
                      <div className="text-xl font-bold text-indigo-400">{job.budget}</div>
                      <div className="text-gray-500 text-sm">{job.budgetType}</div>
                      <div className="text-gray-400 text-sm">応募者: {job.applicants}人</div>
                      <button 
                        onClick={() => openApplyModal(job)}
                        className="px-6 py-2 bg-indigo-600/80 text-white rounded-lg hover:bg-indigo-600 transition-all"
                      >
                        応募する
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* クリエイター検索タブ */}
        {activeTab === 'creators' && (
          <>
            {/* フィルター */}
            <div className="border border-gray-600/30 rounded-xl p-6 mb-8 bg-gray-800/60 backdrop-blur-md">
              <div className="flex flex-col lg:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="クリエイター名・スキル・タグで検索"
                    value={creatorSearch}
                    onChange={(e) => setCreatorSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-600/40 rounded-lg bg-gray-700/50 text-gray-100 placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="text-gray-300">
                <span className="mr-4">スキル:</span>
                <div className="inline-flex flex-wrap gap-2">
                  {['すべて', 'イラスト', '漫画', '3Dモデル', '動画', '音楽', 'デザイン'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCreatorFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-sm transition-all ${
                        creatorFilter === cat
                          ? 'bg-purple-500/80 text-white'
                          : 'text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* クリエイターグリッド */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCreators.map((portfolio) => (
                <div
                  key={portfolio.id}
                  className="group border border-gray-600/20 rounded-xl overflow-hidden bg-gray-800/60 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all cursor-pointer"
                >
                  {/* サムネイル */}
                  <div className="aspect-video bg-gray-700/50 relative overflow-hidden">
                    {portfolio.thumbnail_url ? (
                      <img
                        src={getFullImageUrl(portfolio.thumbnail_url)}
                        alt={portfolio.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">
                        🎨
                      </div>
                    )}
                    <span className="absolute top-2 right-2 bg-purple-600/80 text-white text-xs px-2 py-1 rounded-full">
                      {getWorkTypeLabel(portfolio.work_type)}
                    </span>
                  </div>
                  
                  {/* クリエイター情報 */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-100 mb-2 group-hover:text-purple-300 transition-colors line-clamp-1">
                      {portfolio.title}
                    </h3>
                    
                    {/* クリエイター */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm text-white overflow-hidden">
                        {portfolio.avatar_url ? (
                          <img src={getFullImageUrl(portfolio.avatar_url)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          portfolio.display_name?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <div>
                        <span className="text-gray-200 text-sm font-semibold">{portfolio.display_name}</span>
                        <span className="text-gray-500 text-xs block">@{portfolio.username}</span>
                      </div>
                    </div>
                    
                    {/* タグ */}
                    {portfolio.tags && portfolio.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {portfolio.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-purple-900/30 rounded-full text-xs text-purple-300">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* 統計 & オファーボタン */}
                    <div className="flex items-center justify-between">
                      <div className="text-gray-500 text-xs">
                        <span className="mr-2">👁 {portfolio.view_count}</span>
                        <span>❤️ {portfolio.like_count}</span>
                      </div>
                      <button
                        onClick={() => openOfferModal(portfolio)}
                        className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        オファー
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* クリエイターがいない場合 */}
            {filteredCreators.length === 0 && (
              <div className="text-center py-16 border border-gray-600/30 rounded-xl bg-gray-800/40">
                <div className="text-6xl mb-4 opacity-50">🔍</div>
                <p className="text-gray-400 mb-4">条件に合うクリエイターが見つかりませんでした</p>
                <button
                  onClick={() => { setCreatorFilter('すべて'); setCreatorSearch(''); }}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  フィルターをリセット
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 応募モーダル */}
      {showApplyModal && selectedJob && user && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">求人に応募</h2>
                <button onClick={() => setShowApplyModal(false)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
              </div>
            </div>

            <div className="p-6">
              {/* 求人情報 */}
              <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-white mb-1">{selectedJob.title}</h3>
                <p className="text-gray-400 text-sm">{selectedJob.company}</p>
                <p className="text-indigo-400 font-bold mt-2">{selectedJob.budget}</p>
              </div>

              {/* 自動添付されるユーザー情報 */}
              <div className="mb-6">
                <label className="block text-gray-300 font-semibold mb-3">👤 応募者情報（自動添付）</label>
                <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-4 border border-indigo-500/30">
                  <div className="flex items-center gap-4">
                    {/* アバター */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl text-white overflow-hidden">
                      {user.avatar_url ? (
                        <img src={getFullImageUrl(user.avatar_url)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        (user.display_name || user.username)?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    {/* ユーザー情報 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-lg">{user.display_name || user.username}</span>
                        <span className="text-gray-400 text-sm">@{user.username}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        {/* レベル */}
                        <div className="flex items-center gap-1 bg-indigo-600/50 px-2 py-1 rounded-full">
                          <span className="text-yellow-400 text-sm">⚡</span>
                          <span className="text-white text-sm font-bold">Lv.{user.level || 1}</span>
                        </div>
                        {/* EXP */}
                        <div className="flex items-center gap-1 bg-purple-600/50 px-2 py-1 rounded-full">
                          <span className="text-green-400 text-sm">✦</span>
                          <span className="text-white text-sm">{(user.exp || 0).toLocaleString()} EXP</span>
                        </div>
                        {/* 称号 */}
                        <div className="bg-gradient-to-r from-yellow-600/50 to-orange-600/50 px-3 py-1 rounded-full">
                          <span className="text-white text-sm font-semibold">{getTitleFromLevel(user.level || 1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 自動添付されるポートフォリオ（公開設定のみ） */}
              <div className="mb-6">
                <label className="block text-gray-300 font-semibold mb-3">
                  📁 添付ポートフォリオ（公開設定のみ自動添付: {publicPortfolios.length}件）
                </label>
                {publicPortfolios.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {publicPortfolios.map((p) => (
                      <div key={p.id} className="relative group">
                        <div className="aspect-video bg-gray-600 rounded-lg overflow-hidden border-2 border-green-500/50">
                          {p.thumbnail_url ? (
                            <img src={getFullImageUrl(p.thumbnail_url)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl opacity-30">🎨</div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-green-600/20 rounded-lg flex items-center justify-center">
                          <span className="text-white text-lg">✓</span>
                        </div>
                        <p className="text-white text-xs mt-1 line-clamp-1 text-center">{p.title}</p>
                      </div>
                    ))}
                  </div>
                ) : myPortfolios.length > 0 ? (
                  <div className="text-center py-6 bg-gray-700/30 rounded-lg border border-dashed border-gray-600">
                    <p className="text-gray-400 mb-2">公開設定のポートフォリオがありません</p>
                    <p className="text-gray-500 text-sm mb-3">
                      {myPortfolios.length}件のポートフォリオがありますが、すべて限定公開または非公開に設定されています
                    </p>
                    <a href={`/${currentLocale}/dashboard?tab=portfolio`} className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      公開設定を変更する
                    </a>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-700/30 rounded-lg border border-dashed border-gray-600">
                    <p className="text-gray-400 mb-2">ポートフォリオがありません</p>
                    <p className="text-gray-500 text-sm mb-3">ポートフォリオを追加すると、求人側にあなたの実績をアピールできます</p>
                    <a href={`/${currentLocale}/dashboard?tab=portfolio`} className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      ポートフォリオを作成する
                    </a>
                  </div>
                )}

                {/* 非公開・限定公開のポートフォリオがある場合の注意書き */}
                {myPortfolios.length > publicPortfolios.length && publicPortfolios.length > 0 && (
                  <p className="text-gray-500 text-xs mt-2">
                    ※ 限定公開・非公開のポートフォリオ（{myPortfolios.length - publicPortfolios.length}件）は添付されません。
                    <a href={`/${currentLocale}/dashboard?tab=portfolio`} className="text-indigo-400 hover:underline ml-1">
                      設定を変更
                    </a>
                  </p>
                )}
              </div>

              {/* メッセージ */}
              <div className="mb-6">
                <label className="block text-gray-300 font-semibold mb-2">💬 応募メッセージ（任意）</label>
                <textarea
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-32"
                  placeholder="自己PRや経験、この案件への意気込みなど..."
                />
              </div>

              {/* 注意書き */}
              <div className="mb-6 p-3 bg-yellow-900/30 border border-yellow-600/30 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  ⚠️ 応募時にあなたのプロフィール情報（Lv、EXP、称号）と<strong>「公開」設定</strong>のポートフォリオが自動的に求人側に共有されます。
                </p>
                <p className="text-yellow-300/70 text-xs mt-1">
                  公開設定はダッシュボードの「マイポートフォリオ」で変更できます。
                </p>
              </div>

              {/* 送信ボタン */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                  disabled={isApplying}
                >
                  キャンセル
                </button>
                <button
                  onClick={submitApplication}
                  disabled={isApplying}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isApplying ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      送信中...
                    </>
                  ) : (
                    '応募する'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* オファーモーダル */}
      {showOfferModal && selectedCreator && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">オファーを送る</h2>
                <button onClick={() => setShowOfferModal(false)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
              </div>
            </div>
            
            <div className="p-6">
              {/* クリエイター情報 */}
              <div className="flex items-center gap-4 mb-6 bg-gray-700/50 rounded-lg p-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl text-white overflow-hidden">
                  {selectedCreator.avatar_url ? (
                    <img src={getFullImageUrl(selectedCreator.avatar_url)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    selectedCreator.display_name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{selectedCreator.display_name}</h3>
                  <p className="text-gray-400 text-sm">@{selectedCreator.username}</p>
                  <p className="text-purple-400 text-sm">{getWorkTypeLabel(selectedCreator.work_type)}</p>
                </div>
              </div>
              
              {/* 予算 */}
              <div className="mb-4">
                <label className="block text-gray-300 font-semibold mb-2">💰 予算（任意）</label>
                <input
                  type="text"
                  value={offerBudget}
                  onChange={(e) => setOfferBudget(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="例: ¥50,000 - ¥100,000"
                />
              </div>
              
              {/* メッセージ */}
              <div className="mb-6">
                <label className="block text-gray-300 font-semibold mb-2">💬 オファー内容</label>
                <textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-32"
                  placeholder="依頼したい内容、期日、その他条件など..."
                />
              </div>
              
              {/* 送信ボタン */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                >
                  キャンセル
                </button>
                <button
                  onClick={submitOffer}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
                >
                  オファーを送信
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Jobs



