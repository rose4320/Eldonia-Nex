# Eldonia–Nex エージェント

**正本**: [`eldonia_nex_agent_departments.md`](./eldonia_nex_agent_departments.md)  
**Cursor 索引**: [`.cursor/AGENTS.md`](../.cursor/AGENTS.md)  
**Cursor Skills**: [`.cursor/skills/`](../.cursor/skills/)

Main Director Agent を中心に、19 部署 + Sub Agent で運営する。

## Cursor での運用（管理エージェント経由）

1. ユーザー要望 → **Main Director** が Intake（`.cursor/skills/eldonia-main-director/SKILL.md`）
2. 担当 `agents/*.agent.md` を読んでから実装
3. `eldonia-verify` で検証 → 日本語 Report

詳細: [`.cursor/AGENTS.md`](../.cursor/AGENTS.md)

## 全体構成

```text
Main Director Agent  ← agents/Main_Director.agent.md
├─ Product Strategy
├─ Development（Frontend / Backend / Database / Auth / DevOps / QA …）
├─ Design
├─ Gallery ──→ Lab（コラボ制作の核）
├─ Community / Shop / Event / Works
├─ Quest / Fan Notification / Portfolio・Passport
├─ Revenue・Payment / Translation / Moderation・Safety
└─ Support / Marketing / Admin・Audit
```

**コアフロー**: Gallery 作品 → コラボ → Lab → Shop/Event/Portfolio/Works 展開

## Main Director

| Sub Agent | ファイル |
|-----------|---------|
| **Main Director** | `Main_Director.agent.md` |
| Request Intake | `Request_Intake.agent.md` |
| Project Producer | `Project_Producer.agent.md` |
| Explore | `Explore.agent.md` |

## Development Sub Agents

| Sub Agent | ファイル | パス例 |
|-----------|---------|--------|
| Frontend Manager | `Frontend_Manager.agent.md` | `src/app/`, `src/components/` |
| Backend Manager | `Backend_Manager.agent.md` | `src/app/api/`, `src/lib/` |
| **Database Agent** | `Database_Agent.agent.md` | `supabase/migrations/` |
| **Auth Agent** | `Auth_Agent.agent.md` | `src/app/auth/`, middleware |
| **DevOps Agent** | `DevOps_Agent.agent.md` | CI, Vercel, build |
| **QA Test Agent** | `QA_Test_Agent.agent.md` | lint/build/回帰 |
| Django Manager | `Django_Manager.agent.md` | `backend/` |
| Accounting | `Accounting.agent.md` | 財務 |

## 部署 Agent 一覧

| 部署 | ファイル | パス例 |
|------|---------|--------|
| Product Strategy | `Product_Strategy.agent.md` | `docs/` |
| Design | `UI_UX_Designer.agent.md` | デザインシステム |
| Gallery | `Gallery_Manager.agent.md` | `src/app/gallery/` |
| Community | `Community_Manager.agent.md` | `src/app/community/` |
| Shop | `Shop_Manager.agent.md` | `src/app/shop/` |
| Event | `Events_Manager.agent.md` | `src/app/events/` |
| Works | `Works_Manager.agent.md` | `src/app/works/` |
| Lab | `Lab_Manager.agent.md` | `src/app/lab/` |
| Quest | `Quest_Manager.agent.md` | `/api/quests` |
| Fan Notification | `Fan_Notification_Manager.agent.md` | 通知 |
| Portfolio / Passport | `Portfolio_Passport_Manager.agent.md` | `works/portfolio/` |
| Revenue / Payment | `Revenue_Payment_Manager.agent.md` | Stripe |
| Translation | `Translation_Manager.agent.md` | i18n |
| Moderation / Safety | `Moderation_Safety_Manager.agent.md` | 通報 |
| Support | `Support_Desk_Manager.agent.md` | `src/app/help/` |
| Marketing | `Marketing_Manager.agent.md` | LP |
| Admin / Audit | `Admin_Audit_Manager.agent.md` | `/admin` |

## Cursor Skills（開発時に自動参照）

| Skill | 用途 |
|-------|------|
| `eldonia-main-director` | 要望振り分け・承認要否 |
| `eldonia-development` | Next.js + Supabase 実装 |
| `eldonia-gallery-lab` | Gallery→Lab コアフロー |
| `eldonia-verify` | lint/build/デプロイ確認 |

## MVP 優先（§24）

| 優先 | 部署 |
|------|------|
| **高** | Development, Design, Gallery, **Lab**, Works, Shop, Fan Notification |
| **中** | Event, Portfolio/Passport, Revenue/Payment, Translation, Moderation/Safety |
| **後** | Quest, Marketing |

## 運用ルール（§22）

**自動 OK**: 通知配信、手数料計算、翻訳、レコメンド、FAQ下書き、lint/build 等

**人間承認**: 料金・手数料変更、返金、アカウント停止、規約変更、**本番デプロイ**、本番 DB/RLS 等

## データ保持（§23）

原則物理削除しない（非公開・アーカイブ・匿名化）。

永続ルール: `.cursor/rules/divided-development.mdc`
