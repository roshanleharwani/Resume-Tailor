# Resume Tailor
**AI-Powered Resume Customization Platform**

---

## Overview

Resume Tailor is an intelligent SaaS application that generates job-specific, ATS-optimized resumes using a multi-agent AI architecture.  
Instead of acting as a simple AI wrapper, the system coordinates multiple specialized agents to analyze a candidate’s resume, the target job description, and role expectations to produce a concise, recruiter-ready one-page resume.

The platform also provides PDF and LaTeX outputs, allowing users to further customize resumes while retaining professional formatting standards.

---

## Problem Statement

Recruiters review hundreds of resumes daily and expect:
- Relevance over verbosity
- Clear role alignment
- Clean, structured formatting
- One-page summaries

Generic resumes often fail automated screening systems or do not clearly match job requirements. Resume Tailor addresses this gap by dynamically restructuring resumes for each role rather than forcing candidates to manually rewrite them.

---

## Solution Approach

Resume Tailor treats resume optimization as a collaborative AI problem rather than a single prompt-based generation task.

Key design principles:
- Role-aware content rewriting
- ATS-friendly keyword alignment
- Human-readable formatting
- Separation of analysis, rewriting, and formatting responsibilities

---

## Core Features

### Multi-Agent Resume Optimization
- Uses CrewAI to orchestrate specialized agents
- Each agent focuses on a distinct responsibility:
  - Job requirement analysis
  - Skill and keyword alignment
  - Content rewriting and prioritization
  - Final resume structuring

### One-Page Resume Generation
- Automatically condenses content to recruiter-preferred length
- Highlights only role-relevant experience and skills

### PDF & LaTeX Export
- Download final resumes as PDF
- Access LaTeX source files for advanced customization

### Resume History
- Track previously generated resumes
- Reuse or regenerate resumes for different job roles

### User Profile & Settings
- Manage roles, preferences, and resume metadata
- Persistent user experience across sessions

### Asynchronous Processing
- Heavy AI operations run in the background
- Ensures responsiveness and scalability

---

## Technology Stack

### Frontend
- Next.js
- Tailwind CSS
- shadcn/ui
- Framer Motion

### Backend
- Flask
- CrewAI
- Celery
- Redis

### Database & Authentication
- Supabase

### Resume Compilation
- LaTeX
- latexmk

---

## System Architecture (Conceptual)

