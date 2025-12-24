Resume Tailor — AI-Powered Resume Customization Platform

Resume Tailor is a production-grade SaaS application that generates job-specific, ATS-optimized resumes using a multi-agent AI architecture.
Instead of being a simple AI wrapper, the system orchestrates multiple specialized agents to analyze resumes, job descriptions, and target roles to produce concise, recruiter-friendly one-page resumes.

The platform supports PDF and LaTeX outputs, allowing users to further customize resumes while retaining professional formatting.

Key Features

Resume & Job Description Upload

Multi-Agent Resume Optimization (CrewAI)

Job requirement analysis

Skill and keyword alignment

Content rewriting and structuring

ATS-focused optimization

One-Page Resume Generation

PDF & LaTeX Downloads

Resume History

User Profile & Settings

Asynchronous Processing with Celery

Tech Stack
Frontend

Next.js (App Router)

Tailwind CSS

shadcn/ui

Framer Motion

Backend

Flask (REST API)

CrewAI (multi-agent orchestration)

Celery (background task execution)

Redis (message broker)

Database & Auth

Supabase (Auth + Database)

Resume Compilation

LaTeX

latexmk (PDF compilation)
