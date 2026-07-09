# EldoniaーNex

**Version 0.2.0**

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

**ローカル開発（推奨）** — Docker 上で Supabase を起動:

```bash
npx supabase start
npx supabase status -o env   # ANON_KEY / API_URL を確認
```

`.env.local.example` をコピーし、`API_URL` と `ANON_KEY` を設定:

```bash
cp .env.local.example .env.local
```

例（ローカル Supabase）:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...（supabase status の ANON_KEY）
```

**クラウド Supabase** の場合は Dashboard → Project Settings → API から値を設定してください。

| 変数 | 説明 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL（ローカル: `http://127.0.0.1:54321`） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |

### 3. データベース

Supabase SQL Editor で以下を実行:

```
supabase/migrations/001_profiles.sql
supabase/migrations/002_artworks.sql
supabase/migrations/003_support.sql
supabase/migrations/004_shop.sql
supabase/migrations/005_events.sql
supabase/migrations/006_community.sql
supabase/migrations/007_works.sql
supabase/migrations/008_commerce.sql
supabase/migrations/009_community_reply_count.sql
supabase/migrations/010_works_employer.sql
```

ロールバックが必要な場合:

```
supabase/migrations/001_profiles_rollback.sql
supabase/migrations/002_artworks_rollback.sql
supabase/migrations/003_support_rollback.sql
supabase/rollbacks/004_shop_rollback.sql
supabase/rollbacks/005_events_rollback.sql
supabase/rollbacks/006_community_rollback.sql
supabase/rollbacks/007_works_rollback.sql
supabase/rollbacks/008_commerce_rollback.sql
supabase/rollbacks/009_community_reply_count_rollback.sql
supabase/rollbacks/010_works_employer_rollback.sql
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
| `/dashboard` | ユーザーダッシュボード（要ログイン） |
| `/dashboard/profile` | プロフィール編集（要ログイン） |
| `/gallery` | 作品ギャラリー一覧 |
| `/gallery/upload` | 作品投稿（要ログイン） |
| `/gallery/[id]` | 作品詳細 |
| `/shop` | ショップ一覧（Amazon 型 × Eldonia デザイン） |
| `/shop/[id]` | 商品詳細・Buy Box |
| `/events` | イベント一覧（Chronicle 検索・Realms） |
| `/events/[id]` | イベント詳細・Ticket Box |
| `/help` | ヘルプセンター |
| `/help/faq` | よくある質問 |
| `/help/guides` | 利用ガイド |
| `/help/contact` | お問い合わせ（チケット作成） |
| `/help/tickets` | マイチケット（要ログイン） |

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

## モジュール

- **GALLERY** — 作品共有（一覧・詳細・投稿）
- **SHOP** — グッズ・デジタル商品（一覧・詳細・Nexus Prime）
- **EVENTS** — イベント・チケット（一覧・詳細・Chronicle Highlight）
- **COMMUNITY** — 掲示板・スレッド（一覧・板・詳細）
- **WORKS** — 求人・協業（一覧・応募・ポートフォリオ）
- **Commerce** — カート（Cookie）+ Stripe Checkout（`STRIPE_SECRET_KEY` 要設定）


## OpenAI / Codex の API キー管理 (.env と GitHub Secrets)

ローカルで `scripts/run_codex_subagent.py` を実行する場合、OpenAI の API キーを `OPENAI_API_KEY` として設定してください。キーは決してリポジトリにコミットしないでください。

- ローカルでの手順（推奨）:

```bash
# 1) テンプレートをコピー
cp .env.example .env

# 2) エディタで .env を編集し、OPENAI_API_KEY を設定
#    OPENAI_API_KEY=sk-...（秘密鍵）

# 3) スクリプト実行
python scripts/run_codex_subagent.py --agent Explore --prompt "Find Dockerfiles" --thoroughness quick
```

- PowerShell の一時的な方法:

```powershell
#$env:OPENAI_API_KEY = "sk-..."
python scripts/run_codex_subagent.py --agent Explore --prompt "Find Dockerfiles" --thoroughness quick
```

- GitHub Actions での利用:

  1. リポジトリの `Settings > Secrets and variables > Actions` で `OPENAI_API_KEY` を追加してください。
  2. 手動トリガー（Actions → Run Codex Subagent）からワークフローを実行できます。ワークフローは `OPENAI_API_KEY` を `secrets.OPENAI_API_KEY` から読み込みます。

ワークフローは実行前に `OPENAI_API_KEY` の存在チェックを行い、未設定の場合は失敗します。これにより不注意な実行を防げます。

## ワンクリック開発環境起動（自動承認付き）

開発用にフロントエンド、バックエンド、DB をまとめて起動し、開発用の自動承認（ユーザーの自動アクティベーション／メール検証）を実行するスクリプトを用意しています。承認は開発専用であり、本番環境で有効にしないでください。

- Windows (PowerShell / CMD):

```powershell
cd <project-root>
scripts\setup-dev.bat
```

- Unix (bash / WSL / macOS):

```bash
cd <project-root>
./scripts/start-dev.sh
```

これらのスクリプトは以下を行います（可能な限り自動化）:
- Python 仮想環境の有効化 / 依存インストール
- Docker で DB / Redis / MailHog を起動（`docker-compose.dev.yml` が存在する場合）
- Django マイグレーションを実行（`--noinput` / 非対話）
- 非対話的スーパーユーザー作成（`backend/scripts/create_superuser.py` を使用）
- 開発用 `auto_approve` を実行してユーザーを自動承認

注意: `auto_approve` は開発用の利便性機能です。本番環境で無効化してください。

