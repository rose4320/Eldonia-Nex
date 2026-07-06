# Eldonia-Nex Cursor Agents

**正本**: `agents/eldonia_nex_agent_departments.md`  
**指揮**: `agents/Main_Director.agent.md`

このファイルは Cursor がエージェントを選ぶための索引です。詳細は各 `agents/*.agent.md` と `.cursor/skills/` を参照してください。

## 使い方

1. 要望を **Main Director** が分類
2. 下表の **担当 Agent** の md を読んでから実装
3. 完了前に **QA Test** + **DevOps** で verify
4. 日本語で Report

## Main Director（統括）

| Agent | ファイル | いつ使う |
|-------|---------|---------|
| Main Director | `Main_Director.agent.md` | 複数部署にまたがる依頼、優先度判断 |
| Request Intake | `Request_Intake.agent.md` | 要望の構造化 |
| Project Producer | `Project_Producer.agent.md` | タスク分解・進捗 |
| Explore | `Explore.agent.md` | 読み取り専用のコード探索 |

## Development

| Agent | ファイル | パス |
|-------|---------|------|
| Frontend Manager | `Frontend_Manager.agent.md` | `src/app/`, `src/components/` |
| Backend Manager | `Backend_Manager.agent.md` | `src/app/api/`, `src/lib/` |
| Database Agent | `Database_Agent.agent.md` | `supabase/migrations/` |
| Auth Agent | `Auth_Agent.agent.md` | `src/app/auth/`, middleware |
| DevOps Agent | `DevOps_Agent.agent.md` | CI, Vercel, build |
| QA Test Agent | `QA_Test_Agent.agent.md` | lint/build/回帰 |
| Django Manager | `Django_Manager.agent.md` | `backend/` Admin |

## プロダクト部署（MVP 高）

| Agent | ファイル | パス |
|-------|---------|------|
| UI/UX Designer | `UI_UX_Designer.agent.md` | デザインシステム |
| Gallery Manager | `Gallery_Manager.agent.md` | `src/app/gallery/` |
| Lab Manager | `Lab_Manager.agent.md` | `src/app/lab/` |
| Works Manager | `Works_Manager.agent.md` | `src/app/works/` |
| Shop Manager | `Shop_Manager.agent.md` | `src/app/shop/` |
| Fan Notification | `Fan_Notification_Manager.agent.md` | 通知 |

## その他部署

Community, Events, Quest, Revenue/Payment, Translation, Moderation, Support, Marketing, Admin/Audit, Product Strategy — 各 `agents/*_Manager.agent.md`

## Cursor Skills（自動参照）

| Skill | 用途 |
|-------|------|
| `eldonia-main-director` | 振り分け・承認要否 |
| `eldonia-development` | FE/BE 実装手順 |
| `eldonia-gallery-lab` | Gallery→Lab コアフロー |
| `eldonia-verify` | lint/build/デプロイ確認 |

## 承認必須（Sub Agent 単独禁止）

本番デプロイ、本番 DB/RLS、料金・手数料・規約、アカウント停止、返金、個人情報、Admin 権限
