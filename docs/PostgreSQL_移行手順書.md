# PostgreSQL 15 移行手順書

## 🎯 簡単な切り替え方法

### 📋 現在の状況

- **現在**: SQLite使用中 (`DATABASE_TYPE=sqlite`)

- **準備済**: PostgreSQL 15設定完了

- **将来**: Aurora PostgreSQL対応

---

## 🔄 PostgreSQL 15への移行手順

### Step 1: PostgreSQL起動確認

```bash
cd c:\eldinia-nex
docker-compose -f docker-compose.dev.yml up -d postgres
docker ps  # PostgreSQLコンテナが起動中であることを確認

```text

### Step 2: 環境変数を変更

`.env`ファイルの設定を変更：

```bash

## 変更前

DATABASE_TYPE=sqlite

## 変更後

DATABASE_TYPE=postgresql

```text

### Step 3: マイグレーション実行

```bash
cd c:\eldinia-nex\backend
python manage.py migrate
python manage.py createsuperuser

```text

### Step 4: データ移行（必要に応じて）

SQLiteからPostgreSQLへデータを移行する場合：

```bash

## SQLiteからデータをエクスポート

python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 4 > data_backup.json

## PostgreSQLに切り替え後、データをインポート

python manage.py loaddata data_backup.json

```text

---

## 🚀 Aurora PostgreSQL対応（本番環境）

### 将来の本番環境切り替え

```bash

## .envファイル設定

DATABASE_TYPE=aurora
AURORA_DB_HOST=your-aurora-cluster-endpoint
AURORA_DB_USER=your-aurora-user
AURORA_DB_PASSWORD=your-aurora-password

```text

---

## 📊 設定比較表

| 環境 | DATABASE_TYPE | 用途 | 設定場所 |
|------|--------------|------|----------|
| **開発中** | `sqlite` | 現在使用中 | ローカルファイル |
| **開発完了後** | `postgresql` | PostgreSQL 15 | Dockerコンテナ |
| **本番環境** | `aurora` | AWS Aurora | AWSクラウド |

---

## 🔧 トラブルシューティング

### PostgreSQL接続エラーの場合

1. Dockerコンテナ状態確認: `docker ps`
2. コンテナログ確認: `docker logs eldonia_postgres_dev`
3. 再起動: `docker-compose -f docker-compose.dev.yml restart postgres`

### 設定確認

```bash

## 現在のデータベース設定確認

cd c:\eldinia-nex\backend
python manage.py check --database default

```text

---

## ✅ 移行完了後の確認

1. **管理画面アクセス**: <http://localhost:8000/admin/>
2. **API動作確認**: <http://localhost:8000/api/v1/>
3. **PostgreSQL接続確認**: データが正常に保存・取得できるか

---

## 💡 移行のメリット

- **パフォーマンス**: 大量データ処理に対応

- **同時接続**: 複数ユーザー同時アクセス対応

- **本番環境準備**: Aurora PostgreSQLと互換性

- **高機能**: 全文検索、JSON型、拡張機能対応

**現在はSQLiteで開発継続し、必要に応じて上記手順でPostgreSQL 15に移行可能です！** 🎉
