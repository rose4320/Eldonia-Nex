#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ "${USE_DATABASE_URL:-}" == "true" || "${DEBUG:-True}" == "False" ]]; then
  if [[ -z "${DATABASE_URL:-}" ]]; then
    echo "[eldonia] ERROR: DATABASE_URL is not set. Link Postgres in Render Environment."
    exit 1
  fi
  python - <<'PY'
import os
import sys
from urllib.parse import urlparse

url = (os.environ.get("DATABASE_URL") or "").strip()
parsed = urlparse(url)
scheme = (parsed.scheme or "").lower()
host = parsed.hostname or ""

print(f"[eldonia] DATABASE_URL length: {len(url)}")
print(f"[eldonia] DATABASE scheme: {scheme or '(empty)'}")
print(f"[eldonia] DATABASE host: {host or 'unknown'}")

if not url:
    print("[eldonia] ERROR: DATABASE_URL is empty.")
    sys.exit(1)
if scheme not in ("postgresql", "postgres"):
    print("[eldonia] ERROR: DATABASE_URL must start with postgresql://")
    print("[eldonia] Render → eldonia-django-db → Connect → Internal Database URL を丸ごとコピーしてください。")
    sys.exit(1)
if host in ("localhost", "127.0.0.1"):
    print("[eldonia] ERROR: DATABASE_URL host is localhost.")
    sys.exit(1)
if not host:
    print("[eldonia] ERROR: DATABASE_URL has no hostname.")
    sys.exit(1)
PY
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
