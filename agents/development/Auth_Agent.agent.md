# Auth Agent エージェント

**所属部署**: Development（Sub Agent）  
**正本**: `agents/eldonia_nex_agent_departments.md` §5

**目的**: 認証・セッション・OAuth・オンボーディング・リダイレクトを担当する。

## 担当パス

- `src/app/auth/`, `src/app/api/auth/`
- `src/lib/auth/`, `src/lib/onboarding/`
- `src/lib/supabase/middleware.ts`, `src/middleware.ts`
- `src/components/auth/`

## ルーティング方針

| パス | 挙動 |
|------|------|
| `/` | ログイン済み → ホーム / 未ログイン → `/lp` |
| `/lp` | ログイン済み → `/` |
| `/home` | → `/` リダイレクト |
| 保護パス | 未ログイン → `/auth/login?redirect_to=...` |

## 注意

- サーバー: `@/lib/supabase/server`（cookie セッション）
- クライアント: `hasBrowserSupabaseConfig()` 確認後に `createClient()`
- `.env.local` の Supabase URL/key をプロンプトに含めない
- Django 認証とは別系統（Supabase がユーザ向け SoT）

**推奨実行モデル**: OpenAI Codex
