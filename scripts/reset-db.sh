#!/bin/bash

# Eldinia-Nex データベースリセットスクリプト

echo "⚠️  データベースをリセットします..."
echo "📋 現在のデータはすべて削除されます。"

read -p "🤔 続行しますか？ (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "❌ リセットをキャンセルしました"
    exit 0
fi

# 仮想環境の有効化
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
elif [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
else
    echo "❌ Python仮想環境が見つかりません"
    exit 1
fi

# Dockerコンテナの停止と削除
echo "🐳 Dockerコンテナを停止中..."
docker-compose -f docker-compose.dev.yml down -v

# データベースコンテナの再起動
echo "🗄️ データベースコンテナを再起動中..."
docker-compose -f docker-compose.dev.yml up -d db redis

# マイグレーションファイルの削除
echo "🧹 マイグレーションファイルを削除中..."
cd backend
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete

# 新しいマイグレーションの作成
echo "📄 新しいマイグレーションを作成中..."
python manage.py makemigrations

# マイグレーションの実行
echo "🚀 マイグレーションを実行中..."
python manage.py migrate

# スーパーユーザーの作成
read -p "🤔 スーパーユーザーを作成しますか？ (y/N): " create_superuser
if [[ $create_superuser =~ ^[Yy]$ ]]; then
    python manage.py createsuperuser
fi

cd ..

echo "✅ データベースリセットが完了しました！"