"use client";
import React, { useMemo, useState } from "react";
import PageHero from "../../../components/common/PageHero";

// プロジェクト・タスク・カンバンのモックデータ
interface Project {
  id: string;
  name: string;
  description: string;
  members: string[];
  status: "進行中" | "完了" | "未着手";
  tasks: Task[];
}
interface Task {
  id: string;
  title: string;
  assignee: string;
  due: string;
  status: "未着手" | "進行中" | "完了";
  priority: "高" | "中" | "低";
}

const mockProjects: Project[] = [
  {
    id: "p1",
    name: "Eldonia-Nex新ビジュアル制作",
    description: "新しいキービジュアルの共同制作プロジェクト。",
    members: ["太郎", "花子", "次郎"],
    status: "進行中",
    tasks: [
      { id: "t1", title: "ラフ案作成", assignee: "太郎", due: "2025-11-25", status: "完了", priority: "高" },
      { id: "t2", title: "配色決定", assignee: "花子", due: "2025-11-28", status: "進行中", priority: "中" },
      { id: "t3", title: "仕上げ・提出", assignee: "次郎", due: "2025-12-01", status: "未着手", priority: "高" }
    ]
  },
  {
    id: "p2",
    name: "冬イベント企画",
    description: "12月開催のオンラインイベント準備。",
    members: ["花子", "次郎"],
    status: "未着手",
    tasks: [
      { id: "t4", title: "企画書作成", assignee: "花子", due: "2025-11-30", status: "未着手", priority: "高" },
      { id: "t5", title: "出演者募集", assignee: "次郎", due: "2025-12-05", status: "未着手", priority: "中" }
    ]
  }
];

const GroupWorkPage: React.FC = () => {
  const [projects] = useState<Project[]>(mockProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <PageHero
          title="GROUP WORK"
          subtitle="グループ作業・プロジェクト管理"
          backgroundOpacity={5}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* プロジェクト一覧 */}
          <div className="md:col-span-1">
            <div className="border border-gray-600/30 rounded-xl p-4 bg-gray-800/60 mb-4">
              <h2 className="text-lg font-semibold text-indigo-300 mb-4">プロジェクト一覧</h2>
              <ul className="space-y-2">
                {projects.map((project) => (
                  <li key={project.id}>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                        selectedProjectId === project.id
                          ? "bg-indigo-500/80 text-white shadow-lg"
                          : "bg-gray-700/50 text-gray-200 hover:bg-indigo-700/40"
                      }`}
                      onClick={() => setSelectedProjectId(project.id)}
                    >
                      <div className="font-bold">{project.name}</div>
                      <div className="text-xs text-gray-300">{project.description}</div>
                      <div className="flex gap-2 mt-1 text-xs">
                        <span className="bg-indigo-900/40 px-2 py-0.5 rounded-full">{project.status}</span>
                        <span className="bg-gray-900/40 px-2 py-0.5 rounded-full">{project.members.length}人</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* プロジェクト詳細・タスク */}
          <div className="md:col-span-2">
            {selectedProject ? (
              <div className="border border-gray-600/30 rounded-xl p-6 bg-gray-800/40">
                <h3 className="text-xl font-bold text-indigo-200 mb-2">{selectedProject.name}</h3>
                <p className="text-gray-300 mb-4">{selectedProject.description}</p>
                <div className="mb-4">
                  <span className="font-semibold text-gray-400">メンバー: </span>
                  {selectedProject.members.map((m) => (
                    <span key={m} className="inline-block bg-indigo-900/30 text-indigo-200 px-2 py-0.5 rounded-full mr-2 text-xs">{m}</span>
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-400 mb-2">タスク一覧（カンバン風）</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['未着手', '進行中', '完了'].map((status) => (
                      <div key={status} className="bg-gray-900/60 rounded-lg p-3 min-h-[120px]">
                        <div className="font-bold text-indigo-400 mb-2">{status}</div>
                        {selectedProject.tasks.filter((t) => t.status === status).length === 0 && (
                          <div className="text-gray-500 text-xs">タスクなし</div>
                        )}
                        {selectedProject.tasks.filter((t) => t.status === status).map((task) => (
                          <div key={task.id} className="mb-2 p-2 rounded bg-gray-800/80 border border-gray-700/40">
                            <div className="font-semibold text-gray-100 text-sm">{task.title}</div>
                            <div className="text-xs text-gray-400 flex justify-between">
                              <span>担当: {task.assignee}</span>
                              <span>期限: {task.due}</span>
                            </div>
                            <div className="flex gap-2 mt-1 text-xs">
                              <span className={`px-2 py-0.5 rounded-full ${task.priority === '高' ? 'bg-red-500/40 text-red-200' : task.priority === '中' ? 'bg-yellow-500/30 text-yellow-100' : 'bg-green-500/30 text-green-100'}`}>{task.priority}優先</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-gray-400">左のプロジェクトを選択してください</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupWorkPage;
