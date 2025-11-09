@echo off
REM Eldinia-Nex 統合要件定義書準拠 開発サーバー起動スクリプト (Windows)
REM 必須ルール: Django=backend/, Next.js=frontend/ で実行

echo 🚀 Eldinia-Nex 開発サーバー起動（統合要件定義書準拠）
echo 📋 ディレクトリルール適用中...
echo.

REM プロジェクトルート確認
if not exist "DEVELOPMENT_RULES.md" (
    echo ❌ エラー: プロジェクトルートで実行してください
    echo    場所: eldinia-nex\
    pause
    exit /b 1
)

REM 必須ディレクトリ存在確認（統合要件定義書準拠）
if not exist "backend\manage.py" (
    echo ❌ エラー: backend\manage.py が見つかりません
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo ❌ エラー: frontend\package.json が見つかりません
    pause
    exit /b 1
)

echo ✅ ディレクトリ構造確認完了
echo.

REM Python仮想環境の確認・有効化
echo 🐍 Python仮想環境設定...
if exist "backend\venv\Scripts\activate.bat" (
    call backend\venv\Scripts\activate.bat
    echo ✅ backend\venv\ 仮想環境を有効化
) else if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    echo ✅ プロジェクトルート仮想環境を有効化
) else (
    echo ⚠️  仮想環境が見つかりません。システムPythonを使用
)

REM 依存関係確認・データベースマイグレーション
echo 📦 依存関係確認中...
cd backend
python -c "import django" >nul 2>&1 || (
    echo 📥 Django依存関係インストール中...
    pip install -r requirements.txt
)

echo 🗄️  データベースマイグレーション実行...
python manage.py migrate --noinput
echo ✅ データベース準備完了
cd ..

REM Node.js依存関係確認
cd frontend
if not exist "node_modules" (
    echo 📥 Node.js依存関係インストール中...
    npm install
)
cd ..

echo ✅ 開発環境準備完了
echo.

REM Dockerサービス起動（任意）
where docker-compose >nul 2>&1 && (
    if exist "docker-compose.dev.yml" (
        echo 🐳 Dockerサービス起動中（PostgreSQL, Redis等）...
        docker-compose -f docker-compose.dev.yml up -d db redis mailhog >nul 2>&1 || echo ⚠️  Docker起動スキップ
    )
)

echo 🌐 統合要件定義書準拠のサービス構成:
echo    📁 Django Backend:   http://localhost:8000 (backend\で実行)
echo    📁 Next.js Frontend: http://localhost:3000 (frontend\で実行)
echo    🔧 Django Admin:     http://localhost:8000/admin/
echo    💊 Health Check:     http://localhost:8000/api/v1/health/
echo.

REM Django Backend起動（backend\フォルダで実行 - 必須ルール）
echo 🐍 Django Backend起動中（backend\フォルダで実行）...
cd backend
start "Django Server (backend\)" python manage.py runserver 0.0.0.0:8000
echo    ✅ Django起動完了（backend\フォルダ）
cd ..

REM 起動待機
timeout /t 3 /nobreak >nul

REM Next.js Frontend起動（frontend\フォルダで実行 - 必須ルール）
echo ⚛️  Next.js Frontend起動中（frontend\フォルダで実行）...
cd frontend
start "Next.js Server (frontend\)" npm run dev
echo    ✅ Next.js起動完了（frontend\フォルダ）
cd ..

echo.
echo ✨ 開発サーバー起動完了（統合要件定義書準拠）
echo.
echo 📍 アクセス先：
echo   🎨 フロントエンド:    http://localhost:3000
echo   🔌 バックエンド API: http://localhost:8000
echo   ⚙️  Django Admin:     http://localhost:8000/admin
echo   💊 Health Check:     http://localhost:8000/api/v1/health/
where docker-compose >nul 2>&1 && (
    echo   📧 MailHog:          http://localhost:8025
    echo   🗄️  PgAdmin:         http://localhost:5050
)
echo.
echo ⚠️  重要: 各サーバーは指定ディレクトリで実行されています
echo    👉 Django実行場所:  backend\フォルダ
echo    👉 Next.js実行場所: frontend\フォルダ
echo.
echo 🛑 終了するには各ウィンドウでCtrl+Cを押してください

pause