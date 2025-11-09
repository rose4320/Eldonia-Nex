# Eldonia-Nex Docker構成サマリー

**作成日**: 2025年11月7日  
**対象**: Django + Next.js プロジェクト

---

## 📦 コンテナ構成

### 開発環境（docker-compose.yml）

| サービス | イメージ | ポート | 説明 |
|---------|---------|-------|------|
| **postgres** | postgres:17-alpine | 5432 | PostgreSQLデータベース |
| **redis** | redis:7.4-alpine | 6379 | キャッシュ・セッション・Celeryブローカー |
| **backend** | Custom (Django) | 8000 | Django API サーバー |
| **celery** | Custom (Django) | - | Celery非同期ワーカー |
| **celery-beat** | Custom (Django) | - | Celery定期実行タスク |
| **channels** | Custom (Django) | 8001 | Django Channels WebSocketサーバー |
| **frontend** | Custom (Next.js) | 3000 | Next.js フロントエンド |
| **nginx** | nginx:alpine | 80, 443 | リバースプロキシ |

---

## 🚀 クイックスタート

### 1. 環境変数設定

```bash
# プロジェクトルートに .env ファイル作成

cp .env.example .env

# .env を編集して必要な値を設定

nano .env
```

### 2. Docker起動

```bash
# 開発環境起動

docker-compose up -d

# ログ確認

docker-compose logs -f

# 特定サービスのログ

docker-compose logs -f backend
docker-compose logs -f celery
```

### 3. 初期セットアップ

```bash
# マイグレーション実行

docker-compose exec backend python manage.py migrate

# スーパーユーザー作成

docker-compose exec backend python manage.py createsuperuser

# 静的ファイル収集

docker-compose exec backend python manage.py collectstatic --noinput

# テストデータ投入（オプション）

docker-compose exec backend python manage.py loaddata fixtures/initial_data.json
```

### 4. アクセス

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/
- **WebSocket**: ws://localhost:8001/ws/
- **Nginx**: http://localhost

---

## 📂 ディレクトリ構造

```

eldonia-nex/
├── backend/                    # Djangoバックエンド
│   ├── Dockerfile             # Django用Dockerfile
│   ├── requirements.txt       # Python依存関係
│   ├── requirements-dev.txt   # 開発用依存関係
│   ├── manage.py
│   ├── config/                # Django設定
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── apps/                  # Djangoアプリ
│       ├── users/
│       ├── artworks/
│       ├── events/
│       └── ...
│
├── frontend/                   # Next.jsフロントエンド
│   ├── Dockerfile             # Next.js用Dockerfile
│   ├── Dockerfile.dev         # 開発用Dockerfile
│   ├── package.json
│   ├── next.config.js
│   ├── app/                   # App Router
│   └── components/
│
├── nginx/                      # Nginx設定
│   ├── nginx.conf             # 開発用
│   ├── nginx.prod.conf        # 本番用
│   └── conf.d/
│
├── docker-compose.yml          # 開発環境
├── docker-compose.prod.yml    # 本番環境
├── .env.example               # 環境変数テンプレート
└── .env                       # 環境変数（Git管理外）
```

---

## 🔧 よく使うDockerコマンド

### サービス管理

```bash
# 全サービス起動

docker-compose up -d

# 特定サービスのみ起動

docker-compose up -d postgres redis backend

# サービス再起動

docker-compose restart backend

# サービス停止

docker-compose stop

# サービス停止・削除

docker-compose down

# ボリューム含めて完全削除

docker-compose down -v
```

### ログ・デバッグ

```bash
# 全サービスのログ

docker-compose logs -f

# 特定サービスのログ（最新100行）

docker-compose logs --tail=100 backend

# コンテナ一覧

docker-compose ps

# コンテナ詳細

docker inspect eldonia-backend
```

### Django管理コマンド

```bash
# マイグレーション生成

docker-compose exec backend python manage.py makemigrations

# マイグレーション適用

docker-compose exec backend python manage.py migrate

# Djangoシェル

docker-compose exec backend python manage.py shell

# DBシェル

docker-compose exec backend python manage.py dbshell

# テスト実行

docker-compose exec backend python manage.py test

# カバレッジ付きテスト

docker-compose exec backend coverage run --source='.' manage.py test
docker-compose exec backend coverage report
```

### データベース操作

```bash
# PostgreSQL直接接続

docker-compose exec postgres psql -U postgres -d eldonia_nex

# データベースバックアップ

docker-compose exec postgres pg_dump -U postgres eldonia_nex > backup.sql

# データベースリストア

docker-compose exec -T postgres psql -U postgres eldonia_nex < backup.sql

# Redis CLI

docker-compose exec redis redis-cli -a redis_password
```

---

## 🏗️ 本番環境デプロイ

### 1. 環境変数設定

```bash
# 本番用 .env.production 作成

cp .env.example .env.production

# 本番用の値を設定（SECRET_KEY, DB_PASSWORD等）

nano .env.production
```

### 2. Dockerイメージビルド

```bash
# イメージビルド

docker-compose -f docker-compose.prod.yml build

# イメージをレジストリにプッシュ

docker tag eldonia-backend:latest your-registry/eldonia-backend:v1.0.0
docker push your-registry/eldonia-backend:v1.0.0
```

### 3. 本番環境起動

```bash
# 本番環境起動

docker-compose -f docker-compose.prod.yml up -d

# マイグレーション実行（初回のみ）

docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# 静的ファイル収集

docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput
```

---

## 🔐 セキュリティ設定

### 環境変数の管理

```bash
# .env ファイルは Git 管理外

echo ".env" >> .gitignore
echo ".env.production" >> .gitignore

# Secret Manager使用（AWS/GCP）
# docker-compose.prod.yml で環境変数を外部から注入
```

### Docker セキュリティベストプラクティス

1. **非rootユーザー実行**: Dockerfileで `USER django` を使用
2. **最小権限の原則**: 必要最小限のパッケージのみインストール
3. **イメージスキャン**: `docker scan eldonia-backend:latest`
4. **secrets管理**: Docker Secrets または環境変数
5. **ネットワーク分離**: 専用ネットワーク `eldonia-network` 使用

---

## 📊 モニタリング

### コンテナヘルスチェック

```bash
# ヘルスステータス確認

docker-compose ps

# 詳細ヘルスチェック

docker inspect --format='{{.State.Health.Status}}' eldonia-backend
```

### リソース使用量

```bash
# 全コンテナのリソース使用量

docker stats

# 特定コンテナのみ

docker stats eldonia-backend eldonia-postgres
```

---

## 🧪 テスト環境

### テスト用Docker構成

```bash
# テスト環境起動

docker-compose -f docker-compose.test.yml up -d

# テスト実行

docker-compose -f docker-compose.test.yml exec backend pytest

# テスト環境クリーンアップ

docker-compose -f docker-compose.test.yml down -v
```

---

## ⚠️ トラブルシューティング

### よくある問題

#### 1. ポート競合

```bash
# ポート使用状況確認

netstat -ano | findstr :8000
netstat -ano | findstr :5432

# docker-compose.yml でポート変更

ports:
  - "8001:8000"  # ホスト:8001 → コンテナ:8000
```

#### 2. ボリューム権限エラー

```bash
# ボリューム削除・再作成

docker-compose down -v
docker-compose up -d

# 権限修正

docker-compose exec backend chown -R django:django /app
```

#### 3. データベース接続エラー

```bash
# PostgreSQL起動確認

docker-compose logs postgres

# 接続テスト

docker-compose exec backend python manage.py dbshell

# ヘルスチェック

docker-compose exec postgres pg_isready -U postgres
```

#### 4. Redis接続エラー

```bash
# Redis起動確認

docker-compose logs redis

# 接続テスト

docker-compose exec redis redis-cli -a redis_password ping
```

---

## 🔄 更新・メンテナンス

### Dockerイメージ更新

```bash
# イメージ再ビルド

docker-compose build --no-cache

# 依存関係更新

docker-compose exec backend pip install --upgrade -r requirements.txt
```

### データベースメンテナンス

```bash
# VACUUM実行

docker-compose exec postgres psql -U postgres -d eldonia_nex -c "VACUUM ANALYZE;"

# 不要データ削除

docker-compose exec backend python manage.py clearsessions
```

---

## 📚 関連ドキュメント

- [06_システム構成設計書.md](./06_システム構成設計書.md) - 完全なシステム構成
- [03_データベース設計書.md](./03_データベース設計書.md) - DB設計詳細
- [04_API設計書.md](./04_API設計書.md) - API仕様

---

**✨ Docker環境でEldonia-Nexを快適に開発しましょう！**

