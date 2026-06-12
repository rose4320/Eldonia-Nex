このフォルダはエージェントとサブエージェントのテンプレートを格納します。

利用方針 — Codex ベースのワークフロー
- ここにあるテンプレートは主に OpenAI Codex（code-davinci-002 等）を想定した `runSubagent` 呼び出しの雛形です。
- 実行時は `OPENAI_API_KEY` を安全に設定し、利用規約と社内ポリシーに従ってください。

用意済みエージェント（Codex 用）:
- `Explore.agent.md` — リポジトリ探索用サブエージェント
- `Project_Producer.agent.md` — プロジェクト企画・推進
- `UI_UX_Designer.agent.md` — UI/UX 設計支援
- `Frontend_Manager.agent.md` — フロントエンド実装管理
- `Backend_Manager.agent.md` — バックエンド実装管理
- `Accounting.agent.md` — 経理・費用管理
- `Support_Desk_Manager.agent.md` — サポートデスク運用
- `Shop_Manager.agent.md` — SHOP（Amazon 型 EC × Eldonia デザイン）
- `Events_Manager.agent.md` — EVENTS（チケット UX × Eldonia デザイン）
- `Community_Manager.agent.md` — COMMUNITY（掲示板 × Eldonia デザイン）
- `Works_Manager.agent.md` — WORKS（求人・ポートフォリオ × Eldonia デザイン）
- `Request_Intake.agent.md` — 要望受付・構造化
- `Other.agent.md` — その他テンプレート
- `Explore.agent.md` — リポジトリ探索（既存）

使い方（例）:

```js
runSubagent({
  agentName: "Project_Producer",
  prompt: "Create a 3-month roadmap for a marketplace MVP with 3 engineers",
  model: "code-davinci-002",
  params: { deadline: "2026-09-30" }
})
```

注意事項:
- 機密情報（API キー、顧客データ等）はエージェント呼び出し時に直接渡さないでください。
- 自動実行で外部システムへ変更を加える場合は必ず承認ポリシーを設定してください。

テンプレートの拡張:
- 各 `*.agent.md` に入力パラメータ例、期待出力フォーマット、セキュリティ注意を追記してください。

## Cursor 分担開発（推奨ワークフロー）

現行アプリはルート `src/` + Supabase。Cursor セッションでは次の流れで進めます。

```
ユーザー要望
  → Request_Intake（構造化・優先度）
  → Project_Producer（計画・依存関係）
  → 担当エージェント実装
       UI_UX_Designer … 見た目・コンポーネント規約
       Frontend_Manager … src/app, src/components
       Backend_Manager … supabase/migrations, database.ts
       Support_Desk_Manager … src/app/help
       Shop_Manager … src/app/shop, src/components/shop
       Events_Manager … src/app/events, src/components/events
       Community_Manager … src/app/community, src/components/community
       Works_Manager … src/app/works, src/components/works
  → lint + build 確認
  → 日本語で報告（担当・変更・次タスク）
```

永続ルール: `.cursor/rules/divided-development.mdc`

### モジュール優先順位（バックログ）

| 優先 | モジュール | 状態 |
|------|-----------|------|
| — | GALLEY | 初期実装済 |
| — | ヘルプ/サポート | 初期実装済 |
| — | SHOP | 初期実装済 |
| — | EVENTS | 初期実装済 |
| — | COMMUNITY | 初期実装済 |
| — | WORKS | 初期実装済 |
| — | Stripe カート/決済 | 初期実装済（要 STRIPE_*  env） |

次の機能指示は「モジュール名 + やりたいこと」で OK（例: 「SHOP に商品一覧を追加」）。

