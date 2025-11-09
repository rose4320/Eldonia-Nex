# Eldinia-Nex Backend

クリエイティブプラットフォーム Eldinia-Nex のバックエンドAPI

## 📁 アプリケーション構造

- **users** - ユーザー管理、認証、プロフィール

- **content** - 作品投稿、検索、ソーシャル機能

- **collaboration** - コラボレーション、プロジェクト管理

- **events** - イベント管理、チケット販売

- **marketplace** - 商品管理、決済システム

- **streaming** - ライブ配信、収益化

- **jobs** - 求人・案件管理、クリエーター検索

- **gamification** - EXP・レベル、実績、ランキング

## 🚀 セットアップ

```bash
## 依存関係のインストール

pip install -r ../requirements.txt

## マイグレーション実行

python manage.py makemigrations
python manage.py migrate

## スーパーユーザー作成

python manage.py createsuperuser

## 開発サーバー起動

python manage.py runserver

```text

## 🔧 主要設定

- **データベース**: PostgreSQL (開発時はSQLite)

- **認証**: Token + Session認証

- **API**: Django REST Framework

- **リアルタイム**: Django Channels + Redis

- **キャッシュ**: Redis

- **非同期処理**: Celery

## 📚 API ドキュメント

開発サーバー起動後、以下のURLで確認可能：

- API Root: <http://localhost:8000/api/>

- Django Admin: <http://localhost:8000/admin/>

