# Eldonia-Nex Cursor Agents

**正本**: `agents/eldonia_nex_agent_departments.md`  
**指揮**: `agents/director/Main_Director.agent.md`  
**運用スキル**: `.cursor/skills/eldonia-main-director/SKILL.md`

このリポジトリでは **管理エージェント（Main Director）経由** で作業する。Cursor の Agent は統括役として振り分け、担当部署の `agents/<category>/*.agent.md` を読んでから実装する。

## フォルダ

| フォルダ | 内容 |
|---------|------|
| `agents/director/` | Main Director, Intake, Producer, Explore |
| `agents/development/` | Frontend, Backend, Database, Auth, DevOps, QA |
| `agents/design/` | UI/UX Designer |
| `agents/product/` | Gallery, Lab, Works, Shop, Events … |
| `agents/business/` | Revenue, Translation, Moderation, Support … |
| `agents/strategy/` | Product Strategy |

---

## 使い方（ユーザー向け）

### 通常の依頼（推奨）

そのまま要望を書く。Agent は自動的に Main Director として Intake → 振り分け → 実装 → Report する。

### 統括を明示したい場合

> **Main Director 経由で。** 設定の作品管理にタグを追加

### 部署を指定したい場合

> **Gallery Manager 主担当で。** ダウンロード権限を確認して修正

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

## Main Director（`director/`）

| Agent | ファイル |
|-------|---------|
| Main Director | `director/Main_Director.agent.md` |
| Request Intake | `director/Request_Intake.agent.md` |
| Project Producer | `director/Project_Producer.agent.md` |
| Explore | `director/Explore.agent.md` |

## Development（`development/`）

| Agent | ファイル | パス |
|-------|---------|------|
| Frontend Manager | `development/Frontend_Manager.agent.md` | `src/app/`, `src/components/` |
| Backend Manager | `development/Backend_Manager.agent.md` | `src/app/api/`, `src/lib/` |
| Database Agent | `development/Database_Agent.agent.md` | `supabase/migrations/` |
| Auth Agent | `development/Auth_Agent.agent.md` | `src/app/auth/` |
| DevOps Agent | `development/DevOps_Agent.agent.md` | CI, Vercel |
| QA Test Agent | `development/QA_Test_Agent.agent.md` | lint/build |
| Django Manager | `development/Django_Manager.agent.md` | `backend/` |

## プロダクト部署（MVP 高 · `product/` + `design/`）

| Agent | ファイル | パス |
|-------|---------|------|
| UI/UX Designer | `design/UI_UX_Designer.agent.md` | デザインシステム |
| Gallery Manager | `product/Gallery_Manager.agent.md` | `src/app/gallery/` |
| Lab Manager | `product/Lab_Manager.agent.md` | `src/app/lab/` |
| Works Manager | `product/Works_Manager.agent.md` | `src/app/works/` |
| Shop Manager | `product/Shop_Manager.agent.md` | `src/app/shop/` |
| Fan Notification | `product/Fan_Notification_Manager.agent.md` | 通知 |

## その他

Community, Events, Quest, Revenue/Payment, Translation, Moderation, Support, Marketing, Admin/Audit, Product Strategy — 各 `agents/product/` または `agents/business/` / `agents/strategy/` 内の `*_Manager.agent.md`

## Cursor Skills

| Skill | パス |
|-------|------|
| eldonia-main-director | `.cursor/skills/eldonia-main-director/` |
| eldonia-development | `.cursor/skills/eldonia-development/` |
| eldonia-gallery-lab | `.cursor/skills/eldonia-gallery-lab/` |
| eldonia-verify | `.cursor/skills/eldonia-verify/` |

## 承認必須（Sub Agent 単独禁止）

本番デプロイ、本番 DB/RLS、料金・手数料・規約、アカウント停止、返金、個人情報、Admin 権限
