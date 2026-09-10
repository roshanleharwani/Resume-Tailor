# ---------------------------------------------
# Python 3.11 + TeX Live backend image
# Used for both Flask API and Celery worker
# ---------------------------------------------
FROM python:3.11-slim AS base

# Install system dependencies:
#   - TeX Live (pdflatex + common packages used by resumes)
#   - build tools needed by some Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra \
    texlive-fonts-extra \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install Python requirements first (layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . .

# Make sure the flask_app directory is the working dir for the app
WORKDIR /app/flask_app

# Default port
EXPOSE 5000
