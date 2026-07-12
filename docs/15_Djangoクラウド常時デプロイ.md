# Eldonia-Nex — Django クラウド常時デプロイ（出先から /admin 操作）

**目的**: 出先のスマホ・PCから `https://…/admin/` で Nexus Operations Console を操作する。  
**推奨プラットフォーム**: [**Render**](https://render.com)（カード不要で試せる）— 手順は [`17_Django_Render_Flyio_デプロイ.md`](./17_Django_Render_Flyio_デプロイ.md)  
**代替**: [Fly.io](https://fly.io)（東京 `nrt`）、[Railway](https://railway.app)（課金後）  
**担当**: DevOps + Django Manager  
**承認**: 本番公開はユーザーの明示「はい」が必要

---

## 構成概要

```
スマホ / 出先PC
  → https://<railway-domain>/admin/
  → Railway (gunicorn + WhiteNoise)
  → PostgreSQL (Railway アドオン)
  → Supabase (プラン同期・ライブユーザー用 API)
```

Next.js 本番（`eldonia-nex.com`）とは別ホストです。必要なら後から `admin-api.eldonia-nex.com` 等を CNAME できます。

---

## 事前準備（ローカルで完了済みのコード）

| ファイル | 役割 |
|----------|------|
| `requirements.txt` | `gunicorn` / `whitenoise` / `dj-database-url` |
| `backend/eldinia_nex/settings.py` | `DATABASE_URL` / CSRF / WhiteNoise / 本番 Cookie |
| `backend/Dockerfile` | 本番イメージ |
| `backend/scripts/start-cloud.sh` | migrate → collectstatic → gunicorn |
| `backend/railway.toml` | Railway 設定 |
| `render.yaml` | Render Blueprint |
| `backend/fly.toml` | Fly.io 設定 |
| `Dockerfile.django` | Root Directory = リポジトリルート用フォールバック |

---

## Railway 手順

### 1. プロジェクト作成

1. [railway.app](https://railway.app) にログイン
2. **New Project** → **Deploy from GitHub** → `eldonia-nex` を選択
3. サービス設定:
   - **Root Directory**: `backend`
   - **Builder**: Dockerfile（`backend/Dockerfile`）
4. **Add Plugin / Database** → **PostgreSQL** を追加（`DATABASE_URL` が自動注入される）

> Root Directory をリポジトリルートにする場合は、Dockerfile に `Dockerfile.django` を指定。

### 2. 環境変数（必須）

Railway Variables に設定:

| Key | 例 / 説明 |
|-----|-----------|
| `DEBUG` | `False` |
| `SECRET_KEY` | 長いランダム文字列（ローカルの insecure キーは使わない） |
| `ALLOWED_HOSTS` | `*.up.railway.app,admin-api.eldonia-nex.com`（発行ドメイン） |
| `CSRF_TRUSTED_ORIGINS` | `https://xxxx.up.railway.app`（**https 付き**） |
| `DATABASE_URL` | PostgreSQL アドオンが自動設定（手動不要なことが多い） |
| `DATABASE_SSL_REQUIRE` | `true` |
| `FRONTEND_URL` | `https://eldonia-nex.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | 既存 Supabase URL |
| `SUPABASE_SERVICE_ROLE_KEY` | サービスロール（プラン同期・ライブユーザー用） |
| `SECURE_SSL_REDIRECT` | `true` |
| `WEB_CONCURRENCY` | `2`（無料枠なら `1`） |

任意:

| Key | 説明 |
|-----|------|
| `CORS_ALLOWED_ORIGINS` | `https://eldonia-nex.com,http://localhost:3000` |
| `INTERNAL_API_TOKEN` | Next ↔ Django 内部 API 用 |

### 3. デプロイ後

1. Public Networking を有効化し HTTPS URL を取得
2. `https://<domain>/api/v1/health/` が `healthy` を返すこと
3. スーパーユーザー作成（Railway のシェル）:

```bash
python manage.py createsuperuser
# または
python scripts/create_superuser.py
```

4. 出先ブラウザで `https://<domain>/admin/` → ログイン

### 4. カスタムドメイン（任意）

- DNS: `admin-api.eldonia-nex.com` → Railway CNAME
- `ALLOWED_HOSTS` / `CSRF_TRUSTED_ORIGINS` に追加して再デプロイ

---

## セキュリティ（必須）

- スタッフパスワードは **長く・使い回し禁止**
- Admin URL を SNS 等に貼らない
- `DEBUG=False` を必ず確認
- 可能なら Railway の IP Allowlist / Cloudflare Access で自分の端末だけ許可
- サービスロールキーは Variables のみ（Git に入れない）

---

## ローカル DB との関係

| データ | クラウド後 |
|--------|------------|
| Django `Plan` / 手数料 / ユーザー（Django） | **Railway PostgreSQL が正**（初回は空 → migrate + 必要ならデータ移行） |
| Supabase `subscription_plans` / `user_presence` | 既存クラウド Supabase のまま（同期ボタンで連携） |

ローカル SQLite の内容をそのまま持っていく場合は、別途 dump/load が必要です。

---

## 承認ゲート

このドキュメントの準備までは自動実行可。  
**Railway への実デプロイ・本番公開は、ユーザーが「はい」と明示したあと**に実行する。

Admin で変えた料金・告知が本番 FE に届く流れ（データ同期 vs コードデプロイ）は  
[`16_Django設定_本番反映フロー.md`](./16_Django設定_本番反映フロー.md) を正本とする。

---

## トラブルシュート

| 症状 | 確認 |
|------|------|
| 400 DisallowedHost | `ALLOWED_HOSTS` にホスト名を追加 |
| CSRF 失敗でログインできない | `CSRF_TRUSTED_ORIGINS` に `https://…` を追加 |
| CSS が当たらない | `collectstatic` が start スクリプトで走っているか / WhiteNoise |
| プラン同期失敗 | `NEXT_PUBLIC_SUPABASE_URL` と `SUPABASE_SERVICE_ROLE_KEY` |
| Health が落ちる | `/api/v1/health/` と `PORT` |
