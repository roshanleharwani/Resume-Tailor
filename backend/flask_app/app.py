# flask_app/app.py
import os
import uuid
import json
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS
import redis
from dotenv import load_dotenv
from latex_compile import compile_latex
from supabase_upload import upload_pdf_to_cloudinary, upload_tex_to_supabase
from crew_wrapper import run_agent

load_dotenv()
REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
r = redis.Redis.from_url(REDIS_URL, decode_responses=True)
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})


def set_status(job_id, status, payload=None):
    key = f"job:{job_id}"
    data = {"status": status}
    if payload is not None:
        data["payload"] = payload
    r.set(key, json.dumps(data), ex=60 * 60 * 24)  # keep 24 hours


def run_job_in_background(job_id: str, pdf_url: str, text: str):
    """Runs the full CrewAI pipeline in a daemon thread."""
    try:
        set_status(job_id, "running")

        result = run_agent(pdf_url, text)

        if "error" in result:
            raise Exception(f"Agent error: {result['error']}")

        tex_path = result["tex_file_path"]
        pdf_path = compile_latex(tex_path)

        tex_url = upload_tex_to_supabase(tex_path, "latex")
        pdf_url = upload_pdf_to_cloudinary(pdf_path, "pdf")

        payload = {"tex_url": tex_url, "pdf_url": pdf_url}
        set_status(job_id, "completed", payload)

    except Exception as e:
        set_status(job_id, "failed", {"error": str(e)})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/start-job", methods=["POST"])
def start_job():
    body = request.get_json(force=True)
    pdf_url = body.get("pdf_url")
    text = body.get("text")

    if not pdf_url or text is None:
        return jsonify({"error": "pdf_url and text are required"}), 400

    job_id = uuid.uuid4().hex
    set_status(job_id, "queued")

    # Run the job in a background daemon thread (no Celery needed)
    t = threading.Thread(target=run_job_in_background, args=(job_id, pdf_url, text), daemon=True)
    t.start()

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
