# Eldonia-Nex Cursor Agents

**正本**: `agents/eldonia_nex_agent_departments.md`  
**指揮**: `agents/Main_Director.agent.md`  
**運用スキル**: `.cursor/skills/eldonia-main-director/SKILL.md`

このリポジトリでは **管理エージェント（Main Director）経由** で作業する。Cursor の Agent は統括役として振り分け、担当部署の `agents/*.agent.md` を読んでから実装する。

---

## 使い方（ユーザー向け）

### 通常の依頼（推奨）

そのまま要望を書く。Agent は自動的に Main Director として Intake → 振り分け → 実装 → Report する。

例:
> 作品管理にタグ機能を追加して

### 統括を明示したい場合

> **Main Director 経由で。** 設定の作品管理にタグを追加

### 部署を指定したい場合

> **Gallery Manager 主担当で。** ダウンロード権限を確認して修正

Main Director が主担当を尊重し、必要な副担当（Frontend / Backend 等）を割り当てる。

### 本番デプロイ

Plan で「承認要否: 本番デプロイ」と出たあと、ユーザーが **「はい」** と返信したときのみ DevOps が `npx vercel --prod` を実行する。

### 読み取り専用の質問

> OAuth の仕組みを教えて

Intake の分類が `question` のときは Explore 相当の調査のみ。コード変更はしない。

---

## Agent フロー（内部）

| Phase | 担当 | 出力 |
|-------|------|------|
| 1 Intake | Request_Intake | Intake 表 |
| 2 Plan | Project_Producer | Plan + agent.md 一覧 |
| 3 Implement | 部署 Agent + Task Sub | コード変更 |
| 4 Verify | QA_Test + DevOps | lint/build/deploy |
| 5 Report | Main Director | 日本語サマリ |

---

## Main Director（統括）

| Agent | ファイル | いつ使う |
|-------|---------|---------|
| Main Director | `Main_Director.agent.md` | **全依頼の入口** |
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

## Cursor Skills

| Skill | パス | 用途 |
|-------|------|------|
| eldonia-main-director | `.cursor/skills/eldonia-main-director/` | 振り分け・承認・Report |
| eldonia-development | `.cursor/skills/eldonia-development/` | FE/BE 実装 |
| eldonia-gallery-lab | `.cursor/skills/eldonia-gallery-lab/` | Gallery→Lab |
| eldonia-verify | `.cursor/skills/eldonia-verify/` | lint/build/deploy |

## 承認必須（Sub Agent 単独禁止）

本番デプロイ、本番 DB/RLS、料金・手数料・規約、アカウント停止、返金、個人情報、Admin 権限
