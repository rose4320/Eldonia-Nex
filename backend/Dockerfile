# Python 3.13 — Eldonia-Nex Django (production-ready)
FROM python:3.13.3-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app
ENV PORT=8000

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libmagic1 \
    libffi-dev \
    libssl-dev \
    pkg-config \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install production runtime deps only (no docs/dev/test tooling)
COPY requirements-cloud.txt /tmp/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /tmp/requirements.txt

COPY . /app

RUN chmod +x /app/scripts/start-cloud.sh /app/scripts/cloud-bootstrap.sh && \
    mkdir -p /app/logs /app/staticfiles /app/media

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -fsS "http://127.0.0.1:${PORT:-8000}/api/v1/health/" || exit 1

CMD ["/app/scripts/start-cloud.sh"]
