# gunicorn.conf.py — production WSGI server config for Render
import os

port = os.environ.get("PORT", "5000")
bind = f"0.0.0.0:{port}"

# 1 worker process with multiple threads
# Threading is important since CrewAI jobs run as background threads
workers = 1
threads = 4

# Long timeout — jobs can take several minutes
timeout = 600

# Log to stdout so Render captures it
accesslog = "-"
errorlog = "-"
loglevel = "info"
