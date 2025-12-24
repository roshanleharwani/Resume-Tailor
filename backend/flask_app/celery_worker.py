# flask_app/celery_worker.py
import os
import json
from celery import Celery
import redis
from dotenv import load_dotenv
from latex_compile import compile_latex
from supabase_upload import upload_pdf_to_cloudinary
from supabase_upload import upload_tex_to_supabase


load_dotenv()

REDIS_URL = os.environ.get("REDIS_URL", "redis://redis:6379/0")
BROKER_URL = os.environ.get("BROKER_URL", REDIS_URL)
BACKEND_URL = os.environ.get("BACKEND_URL", REDIS_URL)

celery_app = Celery(
    "crew_tasks",
    broker=BROKER_URL,
    backend=BACKEND_URL,
)

r = redis.Redis.from_url(REDIS_URL, decode_responses=True)


def set_status(job_id, status, payload=None):
    key = f"job:{job_id}"
    data = {"status": status}
    if payload is not None:
        data["payload"] = payload
    r.set(key, json.dumps(data), ex=60 * 60 * 24)


from crew_wrapper import run_agent


@celery_app.task(bind=True, name="run_crew_task", soft_time_limit=3600)
def run_crew_task(self, job_id: str, pdf_url: str, text: str):
    try:
        set_status(job_id, "running")

        result = run_agent(pdf_url, text)

        # Check for errors from run_agent
        if "error" in result:
            raise Exception(f"Agent error: {result['error']}")

        tex_path = result["tex_file_path"]

        pdf_path = compile_latex(tex_path)

        tex_url = upload_tex_to_supabase(tex_path, "latex")
        pdf_url = upload_pdf_to_cloudinary(pdf_path, "pdf")

        payload = {"tex_url": tex_url, "pdf_url": pdf_url}

        set_status(job_id, "completed", payload)
        return payload

    except Exception as e:
        set_status(job_id, "failed", {"error": str(e)})
        raise
