#!/usr/bin/env bash
# Render Shell / Fly SSH から初回セットアップ用
set -euo pipefail

cd "$(dirname "$0")/.."

echo "[eldonia] migrate..."
python manage.py migrate --noinput

if [[ -n "${DJANGO_ADMIN_USERNAME:-}" && -n "${DJANGO_ADMIN_PASSWORD:-}" ]]; then
  echo "[eldonia] create/update superuser..."
  SKIP_ENV_WRITE=true PRINT_ADMIN_PASSWORD=true python scripts/create_superuser.py
else
  echo "[eldonia] skip superuser (set DJANGO_ADMIN_USERNAME + DJANGO_ADMIN_PASSWORD)"
fi

echo "[eldonia] optional: python manage.py sync_supabase_catalog"
