#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "[eldonia] migrate..."
python manage.py migrate --noinput

echo "[eldonia] collectstatic..."
python manage.py collectstatic --noinput

PORT="${PORT:-8000}"
echo "[eldonia] gunicorn on 0.0.0.0:${PORT}"
exec gunicorn eldinia_nex.wsgi:application \
  --bind "0.0.0.0:${PORT}" \
  --workers "${WEB_CONCURRENCY:-2}" \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
