"""
Gunicorn configuration file for CreatorConnect AI (repository root).
Sensible defaults for Render Web Service deployment.
"""
import os

# Server socket
port = os.getenv("PORT", "5000")
bind = f"0.0.0.0:{port}"

# Worker processes
# 2 workers is optimal for Render Starter / Free tiers (~100-110MB per worker = ~220MB RSS)
workers = int(os.getenv("WEB_CONCURRENCY", "2"))
threads = int(os.getenv("GUNICORN_THREADS", "2"))

# Worker lifecycle & timeouts
# Default Gunicorn timeout is 30s. AI generation (Gemini) can legitimately take 15-40s.
# 120s timeout ensures Gunicorn arbiter does not kill workers while waiting for bounded AI requests.
timeout = int(os.getenv("GUNICORN_TIMEOUT", "120"))
graceful_timeout = 30
keepalive = 5

# Logging
accesslog = "-"
errorlog = "-"
loglevel = os.getenv("LOG_LEVEL", "info")
