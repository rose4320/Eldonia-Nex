# Works Manager エージェント

**目的**: Eldonia-Nex WORKS モジュールの設計・実装・運用。**求人・協業マッチング UX** をベースに、ポートフォリオ（EXP / Lv / 称号）自動添付を提供します。

**推奨実行モデル**: OpenAI Codex / Codex系モデル

**関連エージェント**:
- `UI_UX_Designer.agent.md` — 共通トークン
- `Frontend_Manager.agent.md` — `src/app/works/`, `src/components/works/`
- `Backend_Manager.agent.md` — `supabase/migrations/007_works.sql`

---

## コンセプト: 求人 UX × Eldonia 世界観

| 一般的 求人サイト | Eldonia-Nex WORKS |
|------------------|-------------------|
| 求人検索 | **Guild 検索** — 金枠・ダーク面 |
| 応募 | **Guild Quest 応募** — ポートフォリオ自動添付 |
| スキルタグ | EXP / Lv / title_badge スナップショット |
| 白背景 | **禁止** — 黒背景・金CTA |

**タグライン**: `Guild of Creators`

---

## レイアウト規約

### 一覧 `/works`

1. **Works ツールバー** — WORKS + 検索 + ポートフォリオ導線
2. **種別フィルタ** — freelance / full_time / part_time / collab
3. **求人カードグリッド** — 報酬・スキル・Featured バッジ

### 詳細 `/works/[id]`

- 左: 求人詳細
- 右: 応募フォーム（ログイン必須）

### ポートフォリオ `/works/portfolio`

- 公開プロフィール表示（編集はダッシュボード連携予定）

---

## コンポーネント（実装済み）

| パス | 説明 |
|------|------|
| `src/components/works/works-toolbar.tsx` | 検索・ポートフォリオ |
| `src/components/works/job-card.tsx` | 一覧カード |
| `src/components/works/job-apply-form.tsx` | 応募フォーム |
| `src/components/works/portfolio-form.tsx` | ポートフォリオ編集 |
| `src/lib/works/constants.ts` | 種別・報酬フォーマット |
| `src/lib/works/sample-data.ts` | デモ求人 |
| `src/lib/works/get-works.ts` | Supabase + フォールバック |
| `src/app/api/works/apply/route.ts` | 応募 API |

---

## DB

- マイグレーション: `supabase/migrations/007_works.sql`
- ロールバック: `supabase/rollbacks/007_works_rollback.sql`
- 型: `Portfolio`, `JobListing`, `JobApplication`

---

## 完了条件

- [x] 一覧・詳細・ポートフォリオ表示
- [x] 応募 API（portfolio_snapshot）
- [x] ポートフォリオ編集 UI
- [x] 求人主ダッシュボード（/works/manage）
