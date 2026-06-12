@echo off
REM Eldinia-Nex 開発環境セットアップスクリプト (Windows)

echo 🚀 Eldinia-Nex 開発環境をセットアップしています...

REM 仮想環境の有効化
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    echo ✅ Python仮想環境を有効化しました
) else (
    echo ❌ Python仮想環境が見つかりません
    exit /b 1
)

REM バックエンド依存関係のインストール
echo 📦 Pythonパッケージをインストール中...
pip install -r requirements.txt

REM フロントエンド依存関係のインストール
echo 📦 Node.jsパッケージをインストール中...
cd frontend
npm install
cd ..

REM 環境変数ファイルのコピー
if not exist ".env" (
    copy ".env.example" ".env"
    echo 📋 .envファイルを作成しました（設定を確認してください）
)

REM Dockerコンテナの起動
echo 🐳 Dockerコンテナを起動中...
docker-compose -f docker-compose.dev.yml up -d db redis

REM データベースマイグレーション
echo 🗄️ データベースマイグレーションを実行中...
cd backend
python manage.py makemigrations
python manage.py migrate

REM スーパーユーザーの作成（オプション）
REM 非対話的にスーパーユーザーを作成（環境変数があれば更新）
if defined SUPERVISOR_CREATE_SUPERUSER (
    python manage.py shell -c "import runpy; runpy.run_path('scripts/create_superuser.py')"
) else (
    REM デフォルトで作成スクリプトを呼ぶ
    python scripts/create_superuser.py || echo Skipped superuser creation
)

REM 自動承認（開発用）を実行
echo 🔐 自動承認を実行しています (development auto-approve)...
python manage.py auto_approve || echo Auto-approve failed or skipped

cd ..

echo ✨ セットアップが完了しました！
echo.
echo 🎯 次のステップ:
echo 1. バックエンドサーバーを起動: npm run dev:backend
echo 2. フロントエンドサーバーを起動: npm run dev:frontend
echo 3. ブラウザで http://localhost:3000 を開く
pause