
"use client";
import React, { useMemo, useState } from "react";
import PageHero from "../../../components/common/PageHero";

// コミュニティグループ・プロジェクト・チャットのモックデータ
interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  projects: number;
  isPublic: boolean;
  tags: string[];
}

const mockGroups: CommunityGroup[] = [
  {
    id: "g1",
    name: "イラスト制作部",
    description: "イラスト好きが集まるグループ。共同制作や勉強会も開催中。",
    members: 24,
    projects: 3,
    isPublic: true,
    tags: ["イラスト", "勉強会", "コラボ"]
  },
  {
    id: "g2",
    name: "3Dモデリング研究会",
    description: "3Dモデリング技術の共有・作品発表・コラボ企画を実施。",
    members: 12,
    projects: 2,
    isPublic: false,
    tags: ["3D", "モデリング", "技術"]
  },
  {
    id: "g3",
    name: "音楽クリエーターズ",
    description: "作曲・編曲・音源制作の仲間を募集中！",
    members: 18,
    projects: 4,
    isPublic: true,
    tags: ["音楽", "作曲", "コラボ"]
  },
  {
    id: "g4",
    name: "イベント企画チーム",
    description: "オンライン/オフラインイベントの企画・運営を行うグループ。",
    members: 9,
    projects: 1,
    isPublic: true,
    tags: ["イベント", "企画", "運営"]
  }
];

const CommunityPage: React.FC = () => {
  const [groups, setGroups] = useState<CommunityGroup[]>(mockGroups);
  const [search, setSearch] = useState("");
  const [filterPublic, setFilterPublic] = useState<string>("すべて");
  const [sortBy, setSortBy] = useState<string>("メンバー数順");

  // フィルタ・ソート
  const filteredGroups = useMemo(() => {
    let filtered = groups.filter((g) => {
      const matchesSearch =
        g.name.includes(search) ||
        g.description.includes(search) ||
        g.tags.some((t) => t.includes(search));
      const matchesPublic =
        filterPublic === "すべて" ||
        (filterPublic === "公開" && g.isPublic) ||
        (filterPublic === "非公開" && !g.isPublic);
      return matchesSearch && matchesPublic;
    });
    switch (sortBy) {
      case "メンバー数順":
        return filtered.sort((a, b) => b.members - a.members);
      case "プロジェクト数順":
        return filtered.sort((a, b) => b.projects - a.projects);
      default:
        return filtered;
    }
  }, [groups, search, filterPublic, sortBy]);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* ヒーローセクション */}
        <PageHero
          title="COMMUNITY"
          subtitle="Connect & Collaborate"
          backgroundOpacity={5}
        />

        {/* フィルター・検索バー */}
        <div className="border border-gray-600/30 rounded-xl p-6 mb-8 bg-gray-800/60 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="グループ・キーワード検索"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-600/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent bg-gray-700/50 backdrop-blur-sm text-gray-100 placeholder-gray-400 transition-all duration-300"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors">
                🔍
              </button>
            </div>
            <select
              value={filterPublic}
              onChange={(e) => setFilterPublic(e.target.value)}
              className="px-4 py-2 border border-gray-600/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-gray-700/50 backdrop-blur-sm text-gray-100 transition-all duration-300"
            >
              <option value="すべて">公開/非公開: すべて</option>
              <option value="公開">公開グループのみ</option>
              <option value="非公開">非公開グループのみ</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-600/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-gray-700/50 backdrop-blur-sm text-gray-100 transition-all duration-300"
            >
              <option value="メンバー数順">ソート: メンバー数順▼</option>
              <option value="プロジェクト数順">ソート: プロジェクト数順▼</option>
            </select>
          </div>
          {/* タグ例示 */}
          <div className="text-gray-300">
            <span className="mr-4">タグ:</span>
            <div className="inline-flex flex-wrap gap-2 text-sm text-indigo-400/90">
              <span className="px-2 py-1 bg-indigo-900/30 rounded-full backdrop-blur-sm">#コラボ</span>
              <span className="px-2 py-1 bg-indigo-900/30 rounded-full backdrop-blur-sm">#勉強会</span>
              <span className="px-2 py-1 bg-indigo-900/30 rounded-full backdrop-blur-sm">#イベント</span>
              <span className="px-2 py-1 bg-indigo-900/30 rounded-full backdrop-blur-sm">#音楽</span>
            </div>
          </div>
        </div>

        {/* グループグリッド */}
        <div className="border border-gray-600/30 rounded-xl p-6 bg-gray-800/40 backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="group border border-gray-600/20 rounded-xl overflow-hidden bg-gray-800/60 backdrop-blur-sm hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                {/* グループ画像 */}
                <div className="aspect-4/3 relative overflow-hidden">
                  {/* 背景画像 */}
                  <img 
                    src={`https://picsum.photos/seed/community-${group.id}/400/300`}
                    alt={group.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* オーバーレイグラデーション */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  {/* 公開/非公開バッジ */}
                  <div className={`absolute top-2 left-2 px-2 py-1 text-white text-xs rounded-full backdrop-blur-sm ${group.isPublic ? 'bg-green-600/80' : 'bg-orange-600/80'}`}>
                    {group.isPublic ? '公開' : '非公開'}
                  </div>
                  {/* メンバー数バッジ */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded-full backdrop-blur-sm">
                    👥 {group.members}人
                  </div>
                </div>
                {/* グループ情報 */}
                <div className="p-4 text-sm border-t border-gray-600/30 bg-gray-800/80 backdrop-blur-sm">
                  <h3 className="font-medium text-gray-100 mb-2 truncate group-hover:text-indigo-300 transition-colors">{group.name}</h3>
                  <p className="text-gray-400 mb-3 text-xs group-hover:text-gray-300 transition-colors">{group.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500/80 mb-3 group-hover:text-gray-400 transition-colors">
                    <span className="flex items-center gap-1">
                      <span className="opacity-70">👤</span>
                      {group.members}人
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="opacity-70">📁</span>
                      {group.projects}件
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {group.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-indigo-900/30 rounded-full text-xs text-indigo-300/90 backdrop-blur-sm">#{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-purple-600/80 backdrop-blur-sm text-white text-xs rounded-lg hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 border border-purple-500/20 group-hover:border-purple-400/50">
                      参加申請
                    </button>
                    <button className="flex-1 px-3 py-2 bg-green-600/80 backdrop-blur-sm text-white text-xs rounded-lg hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 border border-green-500/20 group-hover:border-green-400/50">
                      チャット
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* 検索結果なし */}
          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">🔍</div>
              <p className="text-gray-400 mb-6 text-lg">検索条件に一致するグループが見つかりませんでした</p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilterPublic("すべて");
                  setSortBy("メンバー数順");
                }}
                className="px-6 py-3 bg-indigo-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 border border-indigo-400/30"
              >
                フィルターをリセット
              </button>
            </div>
          )}
        </div>

        {/* ...主な機能サマリーセクション削除... */}
      </div>
    </div>
  );
};

export default CommunityPage;
