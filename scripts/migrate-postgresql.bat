@echo off
REM PostgreSQL 17 Migration Script
echo Setting environment variables for PostgreSQL 17...
set DATABASE_TYPE=postgresql
set POSTGRES_DB=eldonia_nex
set POSTGRES_USER=postgres
set POSTGRES_PASSWORD=postgres123
set POSTGRES_HOST=localhost
set POSTGRES_PORT=5432

echo Running migrations...
cd backend
python manage.py makemigrations
python manage.py migrate
cd ..

echo Migration complete!
pause

