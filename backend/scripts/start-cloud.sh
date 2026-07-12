#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ "${USE_DATABASE_URL:-}" == "true" || "${DEBUG:-True}" == "False" ]]; then
  if [[ -z "${DATABASE_URL:-}" ]]; then
    echo "[eldonia] ERROR: DATABASE_URL is not set. Link Postgres in Render Environment."
    exit 1
  fi
  if [[ "${DATABASE_URL}" == *"@localhost"* || "${DATABASE_URL}" == *"@127.0.0.1"* ]]; then
    echo "[eldonia] ERROR: DATABASE_URL points to localhost. Remove local DATABASE_URL from Render env."
    exit 1
  fi
fi

echo "[eldonia] migrate..."
python manage.py migrate --noinput

PORT="${PORT:-8000}"
echo "[eldonia] gunicorn on 0.0.0.0:${PORT}"
exec gunicorn eldinia_nex.wsgi:application \
  --bind "0.0.0.0:${PORT}" \
  --workers "${WEB_CONCURRENCY:-2}" \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
