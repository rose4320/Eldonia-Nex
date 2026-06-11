# EldoniaーNex

すべてのクリエイターがファンを集め、作品を共有し、収益化できる総合プラットフォーム。

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- **Backend**: Supabase (Auth / PostgreSQL / Storage)
- **Database**: PostgreSQL (snake_case)

## セットアップ

### 1. 依存関係

```bash
npm install
```

### 2. 環境変数

`.env.local.example` をコピーして `.env.local` を作成:

```bash
cp .env.local.example .env.local
```

Supabase Dashboard の **Project Settings > API** から値を設定:

| 変数 | 説明 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |

### 3. データベース

Supabase SQL Editor で以下を実行:

```
supabase/migrations/001_profiles.sql
```

ロールバックが必要な場合:

```
supabase/migrations/001_profiles_rollback.sql
```

### 4. Supabase Auth 設定

Dashboard > Authentication > URL Configuration:

- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: `http://localhost:3000/auth/callback`

### 5. 開発サーバー

```bash
npm run dev
```

http://localhost:3000 を開く。

## 認証フロー

| パス | 説明 |
|------|------|
| `/` | トップ（未ログインでも閲覧可） |
| `/auth/login` | ログイン |
| `/auth/signup` | 新規登録 |
| `/auth/callback` | OAuth / メール確認コールバック |
| `/auth/sign-out` | ログアウト (POST) |

- ログイン成功後は `/`（index）へ遷移
- `?redirect_to=/path` で元ページへ復帰
- 未認証で保護ページへアクセスすると `/auth/login?redirect_to=...` へリダイレクト

## プロジェクト構成

```
src/
  app/              # App Router ページ
  components/       # UI コンポーネント
  lib/
    auth/           # 認証ユーティリティ
    supabase/       # Supabase クライアント
  types/            # TypeScript 型定義
supabase/
  migrations/       # SQL マイグレーション
  seed.sql          # テストデータ
```

## モジュール（今後実装）

- **GALLEY** — 作品共有
- **SHOP** — グッズ・デジタル商品
- **EVENTS** — イベント・チケット
- **COMMUNITY** — チャット・掲示板
- **WORKS** — 求人・マッチング
