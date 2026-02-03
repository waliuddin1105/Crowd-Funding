FROM python:3.11.9-slim as base

WORKDIR /app

RUN useradd -m -u 1000 appuser && \
    mkdir -p /app && \
    chown appuser:appuser /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

COPY --chown=appuser:appuser requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY --chown=appuser:appuser . .

USER appuser

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_APP=run.py

EXPOSE ${PORT:-5000}

# Run migrations then start gunicorn
CMD ["/bin/sh", "-c", "echo '==================================================' && echo 'ENVIRONMENT VARIABLE STATUS:' && echo \"  DATABASE_URL: ${DATABASE_URL:+SET}${DATABASE_URL:-NOT SET}\" && echo \"  SECRET_KEY: ${SECRET_KEY:+SET}${SECRET_KEY:-NOT SET}\" && echo \"  SENDER_EMAIL: ${SENDER_EMAIL:+SET}${SENDER_EMAIL:-NOT SET}\" && echo \"  SENDER_PASSKEY: ${SENDER_PASSKEY:+SET}${SENDER_PASSKEY:-NOT SET}\" && echo '==================================================' && flask db upgrade 2>/dev/null || echo 'Migration skipped or failed - continuing...' && gunicorn --bind 0.0.0.0:${PORT:-5000} --workers 2 --threads 4 --timeout 120 run:app"]