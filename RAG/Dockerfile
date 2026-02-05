FROM python:3.11.9-slim as base

WORKDIR /app

RUN useradd -m -u 1000 appuser && \
    mkdir -p /app && \
    chown appuser:appuser /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

COPY --chown=appuser:appuser requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code (knowledge_base included, chroma_db excluded via .dockerignore)
COPY --chown=appuser:appuser . .

USER appuser

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

EXPOSE ${PORT:-8000}

# Use gunicorn with uvicorn workers for production
CMD ["/bin/sh", "-c", "gunicorn app.main:app --bind 0.0.0.0:${PORT:-8000} --workers 2 --worker-class uvicorn.workers.UvicornWorker --timeout 120"]