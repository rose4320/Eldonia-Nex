# Eldonia-Nex Django Ops — build from repository root (Railway default).
# Settings: Root Directory = (empty), Dockerfile Path = Dockerfile

FROM python:3.13.3-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/backend
ENV PORT=8000

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev libmagic1 libffi-dev libssl-dev pkg-config curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/requirements-cloud.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

COPY backend /app/backend
WORKDIR /app/backend

RUN chmod +x /app/backend/scripts/start-cloud.sh && \
    mkdir -p /app/backend/logs /app/backend/staticfiles /app/backend/media

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -fsS "http://127.0.0.1:${PORT:-8000}/api/v1/health/" || exit 1

CMD ["/app/backend/scripts/start-cloud.sh"]
