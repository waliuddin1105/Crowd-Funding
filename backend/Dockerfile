FROM python:3.11.9-slim as base

WORKDIR /app

RUN useradd -m -u 1000 appuser && \
    mkdir -p /app && \
    chown appuser:appuser /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

COPY --chown=appuser:appuser requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY --chown=appuser:appuser . .

USER appuser

ENV PORT=5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import os,requests; requests.get(f'http://localhost:{os.getenv('PORT','5000')}/health', timeout=3)" || exit 1

EXPOSE 5000

CMD ["/bin/sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-5000} --workers 4 --timeout 120 run:app"]