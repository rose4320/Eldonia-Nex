#!/bin/bash

#!/bin/bash

# Eldinia-Nex 統合要件定義書準拠 開発サーバー起動スクリプト
# 必須ルール: Django=backend/, Next.js=frontend/ で実行

echo "🚀 Eldinia-Nex 開発サーバー起動（統合要件定義書準拠）"
echo "📋 ディレクトリルール適用中..."
echo ""

# プロジェクトルート確認
if [ ! -f "DEVELOPMENT_RULES.md" ]; then
    echo "❌ エラー: プロジェクトルートで実行してください"
    echo "   場所: eldinia-nex/"
    exit 1
fi

# 必須ディレクトリ存在確認（統合要件定義書準拠）
if [ ! -d "backend" ] || [ ! -f "backend/manage.py" ]; then
    echo "❌ エラー: backend/manage.py が見つかりません"
    exit 1
fi

if [ ! -d "frontend" ] || [ ! -f "frontend/package.json" ]; then
    echo "❌ エラー: frontend/package.json が見つかりません"  
    exit 1
fi

echo "✅ ディレクトリ構造確認完了"
echo ""

# Python仮想環境の確認・有効化
echo "🐍 Python仮想環境設定..."
if [ -f "backend/venv/bin/activate" ]; then
    source backend/venv/bin/activate
    echo "✅ backend/venv/ 仮想環境を有効化"
elif [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    echo "✅ プロジェクトルート仮想環境を有効化"
elif [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
    echo "✅ Windows仮想環境を有効化"
else
    echo "⚠️  仮想環境が見つかりません。システムPythonを使用"
fi

# 依存関係確認
echo "📦 依存関係確認中..."
cd backend/
if ! python -c "import django" &>/dev/null; then
    echo "📥 Django依存関係インストール中..."
    pip install -r requirements.txt
fi

# データベースマイグレーション
echo "🗄️  データベースマイグレーション実行..."
python manage.py migrate --noinput
echo "✅ データベース準備完了"
cd ..

# Node.js依存関係確認
cd frontend/
if [ ! -d "node_modules" ]; then
    echo "📥 Node.js依存関係インストール中..."
    npm install
fi
cd ..

echo "✅ 開発環境準備完了"
echo ""

# Dockerサービス起動（任意）
if command -v docker-compose &> /dev/null && [ -f "docker-compose.dev.yml" ]; then
    echo "🐳 Dockerサービス起動中（PostgreSQL, Redis等）..."
    docker-compose -f docker-compose.dev.yml up -d db redis mailhog 2>/dev/null || echo "⚠️  Docker起動スキップ"
fi

echo "🌐 統合要件定義書準拠のサービス構成:"
echo "   📁 Django Backend:   http://localhost:8000 (backend/で実行)"
echo "   📁 Next.js Frontend: http://localhost:3000 (frontend/で実行)" 
echo "   🔧 Django Admin:     http://localhost:8000/admin/"
echo "   💊 Health Check:     http://localhost:8000/api/v1/health/"
echo ""

# Django Backend起動（backend/フォルダで実行 - 必須ルール）
echo "🐍 Django Backend起動中（backend/フォルダで実行）..."
cd backend/
python manage.py runserver 0.0.0.0:8000 &
DJANGO_PID=$!
echo "   ✅ Django PID: $DJANGO_PID"
cd ..

# 起動待機
sleep 3

# Next.js Frontend起動（frontend/フォルダで実行 - 必須ルール）
echo "⚛️  Next.js Frontend起動中（frontend/フォルダで実行）..."
cd frontend/
npm run dev &
NEXTJS_PID=$!
echo "   ✅ Next.js PID: $NEXTJS_PID"
cd ..

echo ""
echo "✨ 開発サーバー起動完了（統合要件定義書準拠）"
echo ""
echo "📍 アクセス先："
echo "  🎨 フロントエンド:    http://localhost:3000"
echo "  🔌 バックエンド API: http://localhost:8000"
echo "  ⚙️  Django Admin:     http://localhost:8000/admin"
echo "  💊 Health Check:     http://localhost:8000/api/v1/health/"
if command -v docker-compose &> /dev/null; then
    echo "  📧 MailHog:          http://localhost:8025"
    echo "  🗄️  PgAdmin:         http://localhost:5050"
fi
echo ""
echo "⚠️  重要: 各サーバーは指定ディレクトリで実行されています"
echo "   � Django実行場所:  backend/フォルダ"
echo "   👉 Next.js実行場所: frontend/フォルダ"
echo ""
echo "�🛑 終了するには Ctrl+C を押してください"

# 終了処理
cleanup() {
    echo ""
    echo "🔄 サーバー終了中..."
    kill $DJANGO_PID $NEXTJS_PID 2>/dev/null
    if command -v docker-compose &> /dev/null; then
        docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    fi
    echo "✅ サーバー終了完了"
    exit 0
}

trap cleanup INT TERM

# プロセス監視
wait