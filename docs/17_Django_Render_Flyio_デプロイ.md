# Eldonia-Nex — Django クラウド常時デプロイ（Render / Fly.io）

**目的**: 出先から `https://…/admin/` で Nexus Operations Console を操作する。  
**Railway 代替**: 無料枠切れ後は **Render（推奨）** または **Fly.io** を利用。  
**担当**: DevOps + Django Manager  
**関連**: [`15_Djangoクラウド常時デプロイ.md`](./15_Djangoクラウド常時デプロイ.md)（Railway）、[`16_Django設定_本番反映フロー.md`](./16_Django設定_本番反映フロー.md)

---

## プラットフォーム比較（2026）

| | **Render** | **Fly.io** | Railway |
|---|-----------|-----------|---------|
| カード | 無料枠は **不要** | **必要** | 必要（トライアル後課金） |
| 常時起動（無料） | 15分無操作でスリープ（復帰30〜60秒） | 自動停止可（アクセスで起動） | トライアル終了 |
| PostgreSQL 無料 | **30日で失効** | 別途 `fly postgres`（有料） | アドオン |
| おすすめ用途 | **まず試す / カードなし** | 東京リージョン重視 | 既存 Railway 契約者 |

**本番運用（常時・DB永続）の目安**: Render Web **Starter $7/月** + Postgres **Basic $6/月** ≒ **$13/月**

---

## 共通（Render / Fly.io 両方）

### リポジトリ内の設定ファイル

| ファイル | 用途 |
|----------|------|
| `render.yaml` | Render Blueprint（Web + Postgres 一括） |
| `backend/fly.toml` | Fly.io アプリ定義（東京 `nrt`） |
| `backend/Dockerfile` | 本番イメージ |
| `backend/scripts/start-cloud.sh` | migrate → collectstatic → gunicorn |
| `backend/scripts/cloud-bootstrap.sh` | 初回 superuser 作成 |

### 必須環境変数

| Key | 説明 |
|-----|------|
| `DEBUG` | `False` |
| `SECRET_KEY` | 長いランダム文字列（Render は自動生成可） |
| `DATABASE_URL` | PostgreSQL 接続文字列 |
| `USE_DATABASE_URL` | `true` |
| `DATABASE_SSL_REQUIRE` | `true` |
| `SECURE_SSL_REDIRECT` | `true` |
| `FRONTEND_URL` | `https://eldonia-nex.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | 既存 Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | プラン同期・Gallery 連携用 |
| `DJANGO_ADMIN_USERNAME` | Admin ログイン名 |
| `DJANGO_ADMIN_PASSWORD` | 強力なパスワード |

`ALLOWED_HOSTS` / `CSRF_TRUSTED_ORIGINS` は **Render・Fly・Railway のホスト名を settings が自動追加**します。カスタムドメインを付けるときだけ手動追加してください。

---

## A. Render（推奨・カード不要で試せる）

### 方法1: Blueprint（いちばん簡単）

1. [render.com](https://render.com) に GitHub でログイン
2. **New → Blueprint**
3. リポジトリ `eldonia-nex` を選択 → ルートの `render.yaml` を検出
4. **Apply** 前に Variables で以下を手入力:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DJANGO_ADMIN_USERNAME` / `DJANGO_ADMIN_PASSWORD`
5. デプロイ完了後 URL 例: `https://eldonia-django-admin.onrender.com`

### 方法2: 手動作成

1. **New → PostgreSQL**（Free または Basic $6）
2. **New → Web Service** → GitHub 連携
3. 設定:
   - **Root Directory**: `backend`
   - **Runtime**: Docker
   - **Dockerfile Path**: `Dockerfile`（Root Directory 基準）
   - **Health Check Path**: `/api/v1/health/`
   - **Instance**: Free（試用）または Starter（常時起動）
4. Environment → `DATABASE_URL` を Postgres の Internal URL にリンク

### デプロイ後

```bash
# Render Dashboard → Shell
bash scripts/cloud-bootstrap.sh
```

1. `https://<your-app>.onrender.com/api/v1/health/` → `healthy`
2. `https://<your-app>.onrender.com/admin/` → ログイン
3. `/admin/operations/subscription-plans/` でプラン確認 → 必要なら Supabase 同期

### Render 無料枠の注意

- Web: **15分無操作でスリープ** → 出先から初回アクセスは30〜60秒待つ
- Postgres Free: **作成から30日で失効** → 本番運用は Basic ($6/月) へ

---

## B. Fly.io（東京リージョン）

### 前提

- [fly.io](https://fly.io) アカウント + **クレジットカード登録**
- [flyctl](https://fly.io/docs/flyctl/install/) インストール

### 手順

```powershell
cd c:\eldonia-nex\backend

# 1) アプリ作成（fly.toml を利用、まだデプロイしない）
fly launch --no-deploy --copy-config
# アプリ名は eldonia-nex-admin または任意（fly.toml の app と一致させる）

# 2) Postgres（Fly Managed Postgres）
fly postgres create --name eldonia-django-db --region nrt
fly postgres attach eldonia-django-db

# 3) シークレット設定
fly secrets set DEBUG=False USE_DATABASE_URL=true DATABASE_SSL_REQUIRE=true `
  SECURE_SSL_REDIRECT=true WEB_CONCURRENCY=1 FRONTEND_URL=https://eldonia-nex.com `
  SECRET_KEY="<長いランダム>" `
  NEXT_PUBLIC_SUPABASE_URL="<supabase-url>" `
  SUPABASE_SERVICE_ROLE_KEY="<service-role-key>" `
  DJANGO_ADMIN_USERNAME="eldonia_admin" `
  DJANGO_ADMIN_PASSWORD="<強力なパスワード>"

# 4) デプロイ
fly deploy

# 5) 初回 bootstrap（SSH）
fly ssh console -C "bash scripts/cloud-bootstrap.sh"
```

URL 例: `https://eldonia-nex-admin.fly.dev/admin/`

### Fly.io の注意

- `auto_stop_machines` 有効時は **アクセス時に起動**（Render と同様コールドスタートあり）
- 常時起動: `fly.toml` で `min_machines_running = 1` に変更（課金増）

---

## カスタムドメイン（任意）

例: `admin-api.eldonia-nex.com`

1. DNS CNAME → Render / Fly の発行ホスト
2. プラットフォーム側でカスタムドメイン追加
3. Environment に追加:
   - `ALLOWED_HOSTS=admin-api.eldonia-nex.com,<既存>`
   - `CSRF_TRUSTED_ORIGINS=https://admin-api.eldonia-nex.com,<既存>`

---

## ローカル DB との関係

| データ | クラウド後 |
|--------|------------|
| Django Plan / 手数料 / Artwork（Admin） | **クラウド PostgreSQL が正** |
| Supabase（Gallery / プラン公開） | 既存のまま。Admin から同期 |

ローカル SQLite の内容を移す場合:

```bash
# ローカル（参考）
python manage.py dumpdata users marketplace --indent 2 -o local-data.json
# クラウド Shell
python manage.py loaddata local-data.json
```

---

## トラブルシュート

| 症状 | 対処 |
|------|------|
| 400 DisallowedHost | カスタムドメインを `ALLOWED_HOSTS` に追加 |
| CSRF でログイン不可 | `CSRF_TRUSTED_ORIGINS` に `https://…` を追加 |
| 503 / 起動遅い | 無料枠スリープ。Starter へアップグレード |
| Postgres 接続失敗 | `DATABASE_URL` / `DATABASE_SSL_REQUIRE=true` |
| Gallery 同期失敗 | Supabase キー確認 → `python manage.py sync_supabase_catalog` |

---

## 承認ゲート

**Render / Fly への実デプロイ**は本番公開に該当します。  
Dashboard / CLI 操作はユーザー側で実行。環境変数に **サービスロールキーを Git にコミットしない**こと。
