@echo off
REM PostgreSQL 17 Migration Script
echo Setting environment variables for PostgreSQL 17...
set DATABASE_TYPE=postgresql
set POSTGRES_DB=eldonia_nex_dev
set POSTGRES_USER=postgres
set POSTGRES_PASSWORD=eldonia_pass
set POSTGRES_HOST=127.0.0.1
set POSTGRES_PORT=5433

echo Running migrations...
cd backend
python manage.py makemigrations
python manage.py migrate
cd ..

echo Migration complete!
pause

