#!/usr/bin/env python
import sys
import warnings
from datetime import datetime
from resume_tailor.crew import ResumeTailor

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

resume = r"E:\Resume-Project\ResumeTailor\Roshan's-Resume.pdf"
jd = """
A Full Stack Web Developer is responsible for designing, developing, and maintaining scalable, high-performance web applications across both frontend and backend. The role involves building responsive user interfaces using React.js or Next.js, developing backend services with Node.js (Express/Nest.js) or Python frameworks, and managing relational or NoSQL databases such as PostgreSQL and MongoDB. The developer will create and integrate RESTful or GraphQL APIs, implement authentication and authorization, collaborate with designers to transform UI/UX wireframes into functional components, optimize application performance, and manage deployments using Docker and cloud platforms like AWS or GCP. The ideal candidate should have strong skills in JavaScript/TypeScript, HTML, CSS, Git, database design, and state management, along with familiarity with CI/CD pipelines, testing tools, and DevOps practices. Good communication, problem-solving abilities, and attention to detail are essential for success in this role.
"""


def run():
    """
    Run the crew.
    """
    inputs = {
        # These must match your tasks.yaml placeholders
        "jd_text": jd,
        "resume_url": resume,  # or the parsed text directly
        "current_year": str(datetime.now().year),
    }

    try:
        ResumeTailor().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        "jd_text": jd,
        "resume_url": resume,
        "current_year": str(datetime.now().year),
    }
    try:
        ResumeTailor().crew().train(
            n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs
        )
    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")


def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        ResumeTailor().crew().replay(task_id=sys.argv[1])
    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")


def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        "jd_text": jd,
        "resume_url": resume,
        "current_year": str(datetime.now().year),
    }

    try:
        ResumeTailor().crew().test(
            n_iterations=int(sys.argv[1]), eval_llm=sys.argv[2], inputs=inputs
        )
    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")
