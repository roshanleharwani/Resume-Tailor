# flask_app/crew_wrapper.py

import os
import sys
from datetime import datetime

# ensure project src is on sys.path so "resume_tailor" package can be imported
HERE = os.path.dirname(__file__)
PROJECT_ROOT = os.path.abspath(os.path.join(HERE, ".."))
SRC_PATH = os.path.join(PROJECT_ROOT, "resume_tailor", "src")
if SRC_PATH not in sys.path:
    sys.path.insert(0, SRC_PATH)

from resume_tailor.crew import ResumeTailor

TEX_FILE_NAME = "tailored_resume.tex"


def run_agent(pdf_url: str, text: str) -> dict:
    """
    Runs the CrewAI agent and returns all relevant outputs,
    including the path to the generated .tex file.
    """

    inputs = {
        "jd_text": text,
        "resume_url": pdf_url,
        "current_year": str(datetime.now().year),
    }

    try:
        crew = ResumeTailor().crew()
        result = crew.kickoff(inputs=inputs)

        # Check if .tex file exists
        tex_path = os.path.abspath(TEX_FILE_NAME)
        if not os.path.exists(tex_path):
            raise FileNotFoundError(f"{TEX_FILE_NAME} not found after crew run")

        # Convert result object to dict
        output = {}

        if hasattr(result, "output"):
            output["final_output"] = result.output

        if hasattr(result, "tasks_output"):
            output["tasks"] = [
                {
                    "task_id": getattr(t, "id", None),
                    "task_name": getattr(t, "name", None),
                    "output": getattr(t, "output", None),
                }
                for t in result.tasks_output
            ]

        # Include tex file path
        output["tex_file_path"] = tex_path

        return output

    except Exception as e:
        return {"error": str(e)}
