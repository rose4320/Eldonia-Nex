# Eldonia–Nex エージェント

**正本**: [`eldonia_nex_agent_departments.md`](./eldonia_nex_agent_departments.md)  
**Cursor 索引**: [`.cursor/AGENTS.md`](../.cursor/AGENTS.md)  
**Cursor Skills**: [`.cursor/skills/`](../.cursor/skills/)

Main Director Agent を中心に、19 部署 + Sub Agent で運営する。

## フォルダ構成

```text
agents/
├── eldonia_nex_agent_departments.md   # 本書
├── director/      # 統括
├── development/   # FE / BE / DB / Auth / DevOps / QA
├── design/        # UI/UX
├── product/       # Gallery, Lab, Works, Shop …
├── business/      # 収益, 翻訳, モデレーション …
└── strategy/      # Product Strategy
```

## フォルダ別索引

| フォルダ | README |
|---------|--------|
| `director/` | [director/README.md](./director/README.md) |
| `development/` | [development/README.md](./development/README.md) |
| `design/` | [design/README.md](./design/README.md) |
| `product/` | [product/README.md](./product/README.md) |
| `business/` | [business/README.md](./business/README.md) |
| `strategy/` | [strategy/README.md](./strategy/README.md) |

## Cursor での運用（管理エージェント経由）

1. ユーザー要望 → **Main Director** が Intake（`.cursor/skills/eldonia-main-director/SKILL.md`）
2. 担当 `agents/<category>/*.agent.md` を読んでから実装
3. `eldonia-verify` で検証 → 日本語 Report

詳細: [`.cursor/AGENTS.md`](../.cursor/AGENTS.md)

## Main Director（`director/`）

| Sub Agent | ファイル |
|-----------|---------|
| **Main Director** | `director/Main_Director.agent.md` |
| Request Intake | `director/Request_Intake.agent.md` |
| Project Producer | `director/Project_Producer.agent.md` |
| Explore | `director/Explore.agent.md` |

## Development（`development/`）

| Sub Agent | ファイル | パス例 |
|-----------|---------|--------|
| Frontend Manager | `development/Frontend_Manager.agent.md` | `src/app/`, `src/components/` |
| Backend Manager | `development/Backend_Manager.agent.md` | `src/app/api/`, `src/lib/` |
| Database Agent | `development/Database_Agent.agent.md` | `supabase/migrations/` |
| Auth Agent | `development/Auth_Agent.agent.md` | `src/app/auth/`, middleware |
| DevOps Agent | `development/DevOps_Agent.agent.md` | CI, Vercel, build |
| QA Test Agent | `development/QA_Test_Agent.agent.md` | lint/build/回帰 |
| Django Manager | `development/Django_Manager.agent.md` | `backend/` |
| Accounting | `development/Accounting.agent.md` | 財務 |

## Design（`design/`）

| Agent | ファイル |
|-------|---------|
| UI/UX Designer | `design/UI_UX_Designer.agent.md` |

## Product（`product/`）

| 部署 | ファイル | パス例 |
|------|---------|--------|
| Gallery | `product/Gallery_Manager.agent.md` | `src/app/gallery/` |
| Lab | `product/Lab_Manager.agent.md` | `src/app/lab/` |
| Works | `product/Works_Manager.agent.md` | `src/app/works/` |
| Shop | `product/Shop_Manager.agent.md` | `src/app/shop/` |
| Event | `product/Events_Manager.agent.md` | `src/app/events/` |
| Community | `product/Community_Manager.agent.md` | `src/app/community/` |
| Quest | `product/Quest_Manager.agent.md` | `/api/quests` |
| Fan Notification | `product/Fan_Notification_Manager.agent.md` | 通知 |
| Portfolio / Passport | `product/Portfolio_Passport_Manager.agent.md` | `works/portfolio/` |

## Business（`business/`）

| 部署 | ファイル |
|------|---------|
| Revenue / Payment | `business/Revenue_Payment_Manager.agent.md` |
| Translation | `business/Translation_Manager.agent.md` |
| Moderation / Safety | `business/Moderation_Safety_Manager.agent.md` |
| Support | `business/Support_Desk_Manager.agent.md` |
| Marketing | `business/Marketing_Manager.agent.md` |
| Admin / Audit | `business/Admin_Audit_Manager.agent.md` |

## Strategy（`strategy/`）

| Agent | ファイル |
|-------|---------|
| Product Strategy | `strategy/Product_Strategy.agent.md` |
| Other | `strategy/Other.agent.md` |

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
