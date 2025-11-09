#!/bin/bash

# Eldinia-Nex 開発環境セットアップスクリプト

echo "🚀 Eldinia-Nex 開発環境をセットアップしています..."

# 仮想環境の有効化
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    echo "✅ Python仮想環境を有効化しました"
elif [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
    echo "✅ Python仮想環境を有効化しました"
else
    echo "❌ Python仮想環境が見つかりません"
    exit 1
fi

# バックエンド依存関係のインストール
echo "📦 Pythonパッケージをインストール中..."
pip install -r requirements.txt

# フロントエンド依存関係のインストール
echo "📦 Node.jsパッケージをインストール中..."
cd frontend
npm install
cd ..

# 環境変数ファイルのコピー
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "📋 .envファイルを作成しました（設定を確認してください）"
fi

# Dockerコンテナの起動
echo "🐳 Dockerコンテナを起動中..."
docker-compose -f docker-compose.dev.yml up -d db redis

# データベースマイグレーション
echo "🗄️ データベースマイグレーションを実行中..."
cd backend
python manage.py makemigrations
python manage.py migrate

# スーパーユーザーの作成（オプション）
read -p "🤔 スーパーユーザーを作成しますか？ (y/N): " create_superuser
if [[ $create_superuser =~ ^[Yy]$ ]]; then
    python manage.py createsuperuser
fi

cd ..

echo "✨ セットアップが完了しました！"
echo ""
echo "🎯 次のステップ:"
echo "1. バックエンドサーバーを起動: npm run dev:backend"
echo "2. フロントエンドサーバーを起動: npm run dev:frontend"
echo "3. ブラウザで http://localhost:3000 を開く"