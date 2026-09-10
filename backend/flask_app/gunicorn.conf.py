# gunicorn.conf.py — production WSGI server config for Render
import os

# Bind to the port Render assigns (default 5000)
port = os.environ.get("PORT", "5000")
bind = f"0.0.0.0:{port}"

# Number of worker processes
workers = 2

# Timeout (CrewAI jobs can be long — Celery handles that, not gunicorn)
timeout = 120

# Log to stdout so Render captures it
accesslog = "-"
errorlog = "-"
loglevel = "info"
