# flask_app/app.py
import os
import uuid
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import redis
from celery_worker import run_crew_task
from dotenv import load_dotenv

load_dotenv()
REDIS_URL = os.environ.get("REDIS_URL", "redis://redis:6379/0")
r = redis.Redis.from_url(REDIS_URL, decode_responses=True)
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})


def set_status(job_id, status, payload=None):
    key = f"job:{job_id}"
    data = {"status": status}
    if payload is not None:
        data["payload"] = payload
    r.set(key, json.dumps(data), ex=60 * 60 * 24)  # keep 24 hours (adjust)


@app.route("/start-job", methods=["POST"])
def start_job():
    body = request.get_json(force=True)
    pdf_url = body.get("pdf_url")
    text = body.get("text")

    if not pdf_url or text is None:
        return jsonify({"error": "pdf_url and text are required"}), 400

    job_id = uuid.uuid4().hex
    set_status(job_id, "queued")
    # enqueue the task asynchronously
    run_crew_task.delay(job_id, pdf_url, text)
    return jsonify({"job_id": job_id, "status": "queued"}), 202


@app.route("/job-status", methods=["GET"])
def job_status():
    job_id = request.args.get("job_id")
    if not job_id:
        return jsonify({"error": "job_id required"}), 400

    key = f"job:{job_id}"
    raw = r.get(key)
    if not raw:
        return jsonify({"status": "unknown"}), 404

    data = json.loads(raw)
    return jsonify(data), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
