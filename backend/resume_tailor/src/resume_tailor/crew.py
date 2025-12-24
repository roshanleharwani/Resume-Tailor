from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from crewai.llm import LLM
import os
from dotenv import load_dotenv
from crewai_tools import PDFSearchTool
from resume_tailor.tools.pdf_search_tool import DynamicPDFTool

# pdftool = PDFSearchTool(pdf=r"E:\Resume-Project\ResumeTailor\Roshan's-Resume.pdf")
load_dotenv()


llm1 = LLM(
    model="openai/gpt-4o",
    api_key=os.environ.get("OPENAI_API_KEY"),
    temperature=0.5,
    max_tokens=12000,
)
llm = LLM(
    model="openai/gpt-4o-mini",
    api_key=os.environ.get("OPENAI_API_KEY"),
    temperature=0.7,
    max_tokens=8000,
)


@CrewBase
class ResumeTailor:
    """ResumeTailor crew"""

    agents: List[BaseAgent]
    tasks: List[Task]

    # ---------------- AGENTS ----------------
    @agent
    def jd_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["jd_agent"],  # loaded from agents.yaml
            verbose=True,
            llm=llm,
        )

    @agent
    def resume_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["resume_agent"],
            tools=[DynamicPDFTool()],
            verbose=True,
            llm=llm,
        )

    @agent
    def writer_agent(self) -> Agent:
        return Agent(config=self.agents_config["writer_agent"], llm=llm1, verbose=True)

    @agent
    def latex_agent(self) -> Agent:
        return Agent(config=self.agents_config["latex_agent"], llm=llm1, verbose=True)

    @agent
    def final_alignment_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["final_alignment_agent"], llm=llm, verbose=True
        )

    # ---------------- TASKS ----------------
    @task
    def jd_task(self) -> Task:
        return Task(config=self.tasks_config["jd_task"])

    @task
    def resume_task(self) -> Task:
        return Task(config=self.tasks_config["resume_task"])

    @task
    def writer_task(self) -> Task:
        return Task(config=self.tasks_config["writer_task"])

    @task
    def latex_task(self) -> Task:
        return Task(
            config=self.tasks_config["latex_task"],
            output_file="tailored_resume.tex",  # so LaTeX file is saved automatically
        )

    @task
    def final_alignment_task(self) -> Task:
        return Task(
            config=self.tasks_config["final_alignment_task"],
            output_file="tailored_resume.tex",
        )

    # ---------------- CREW ----------------
    @crew
    def crew(self) -> Crew:
        """Creates the ResumeTailor crew"""
        return Crew(
            agents=self.agents,  # Auto-created by @agent
            tasks=self.tasks,  # Auto-created by @task
            process=Process.sequential,
            verbose=True,
        )
