# Eldonia–Nex エージェント

**正本**: [`eldonia_nex_agent_departments.md`](./eldonia_nex_agent_departments.md)

Main Director Agent を中心に、19 部署 + Sub Agent で運営する。

## 全体構成

```text
Main Director Agent
├─ Product Strategy
├─ Development（Frontend / Backend / Database …）
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
| Request Intake | `Request_Intake.agent.md` |
| Project Producer | `Project_Producer.agent.md` |
| Explore | `Explore.agent.md` |

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

Development Sub: `Frontend_Manager`, `Backend_Manager`, `Django_Manager`, `Accounting`

## MVP 優先（§24）

| 優先 | 部署 |
|------|------|
| **高** | Development, Design, Gallery, **Lab**, Works, Shop, Fan Notification |
| **中** | Event, Portfolio/Passport, Revenue/Payment, Translation, Moderation/Safety |
| **後** | Quest, Marketing |

## 運用ルール（§22）

**自動 OK**: 通知配信、手数料計算、翻訳、レコメンド、FAQ下書き、lint/build 等

**人間承認**: 料金・手数料変更、返金、アカウント停止、規約変更、スポンサー契約、本番デプロイ等

## データ保持（§23）

原則物理削除しない（非公開・アーカイブ・匿名化）。

永続ルール: `.cursor/rules/divided-development.mdc`
