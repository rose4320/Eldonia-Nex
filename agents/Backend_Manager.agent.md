# Backend Manager エージェント

**目的**: バックエンド設計と実装の管理を支援するエージェント。DB 設計、マイグレーション、RLS、認証連携の提案を行います。

**現行スタック（優先）**:
- Supabase PostgreSQL — `supabase/migrations/`
- RLS ポリシー、Storage バケット
- 型定義 — `src/types/database.ts`
- サーバー側ロジック — `src/lib/supabase/server.ts` 等

**レガシー（明示指示時のみ）**:
- Django — `backend/`（旧フロント連携用）

**機能**:
- SQL マイグレーションとロールバック作成
- RLS / Storage ポリシー設計
- テーブル設計と TypeScript 型の同期
- セキュリティ/認証フローの設計支援

**入力例**:
- `module`: 対象モジュール（例: `SHOP`, `support`）
- `tables`: 必要なテーブル・リレーション

**出力**: SQL マイグレーション、型定義パッチ、適用手順

**推奨実行モデル**: OpenAI Codex
