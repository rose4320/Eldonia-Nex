@echo off
REM Eldinia-Nex データベースリセットスクリプト (Windows)

echo ⚠️  データベースをリセットします...
echo 📋 現在のデータはすべて削除されます。

set /p confirm="🤔 続行しますか？ (y/N): "
if /i not "%confirm%"=="y" (
    echo ❌ リセットをキャンセルしました
    exit /b 0
)

REM 仮想環境の有効化
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
) else (
    echo ❌ Python仮想環境が見つかりません
    exit /b 1
)

REM Dockerコンテナの停止と削除
echo 🐳 Dockerコンテナを停止中...
docker-compose -f docker-compose.dev.yml down -v

REM データベースコンテナの再起動
echo 🗄️ データベースコンテナを再起動中...
docker-compose -f docker-compose.dev.yml up -d db redis

REM マイグレーションファイルの削除
echo 🧹 マイグレーションファイルを削除中...
cd backend
for /r %%i in (migrations\*.py) do (
    if not "%%~ni"=="__init__" del "%%i"
)
for /r %%i in (migrations\*.pyc) do del "%%i"

REM 新しいマイグレーションの作成
echo 📄 新しいマイグレーションを作成中...
python manage.py makemigrations

REM マイグレーションの実行
echo 🚀 マイグレーションを実行中...
python manage.py migrate

REM スーパーユーザーの作成
set /p create_superuser="🤔 スーパーユーザーを作成しますか？ (y/N): "
if /i "%create_superuser%"=="y" (
    python manage.py createsuperuser
)

cd ..

echo ✅ データベースリセットが完了しました！
pause