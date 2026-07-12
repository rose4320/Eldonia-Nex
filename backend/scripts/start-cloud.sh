#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ "${USE_DATABASE_URL:-}" == "true" || "${DEBUG:-True}" == "False" ]]; then
  if [[ -z "${DATABASE_URL:-}" ]]; then
    echo "[eldonia] ERROR: DATABASE_URL is not set. Link Postgres in Render Environment."
    exit 1
  fi
  db_host="$(python - <<'PY'
import os
from urllib.parse import urlparse
url = os.environ.get("DATABASE_URL", "")
parsed = urlparse(url)
print(parsed.hostname or "unknown")
PY
)"
  echo "[eldonia] DATABASE host: ${db_host}"
  if [[ "${db_host}" == "localhost" || "${db_host}" == "127.0.0.1" ]]; then
    echo "[eldonia] ERROR: DATABASE_URL host is localhost."
    echo "[eldonia] Render → eldonia-django-db → Connect → Internal Database URL を DATABASE_URL に貼り直してください。"
    exit 1
  fi
fi

echo "[eldonia] migrate..."
attempt=0
max_attempts=30
until python manage.py migrate --noinput; do
  attempt=$((attempt + 1))
  if [[ "${attempt}" -ge "${max_attempts}" ]]; then
    echo "[eldonia] ERROR: migrate failed after ${max_attempts} attempts"
    exit 1
  fi
  echo "[eldonia] migrate retry ${attempt}/${max_attempts} (Postgres may still be starting)..."
  sleep 5
done

python manage.py createcachetable --noinput 2>/dev/null || true

PORT="${PORT:-8000}"
WORKERS="${WEB_CONCURRENCY:-1}"
echo "[eldonia] gunicorn on 0.0.0.0:${PORT} (workers=${WORKERS})"
exec gunicorn eldinia_nex.wsgi:application \
  --bind "0.0.0.0:${PORT}" \
  --workers "${WORKERS}" \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
