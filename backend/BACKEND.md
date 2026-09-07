````md
# AI JOB SEARCH & APPLICATION ASSISTANT
## Backend Architecture & AI Automation Blueprint
### Production-Ready Technical Design Document

**Version:** 1.0

**Architecture Style:** Event-Driven Microservice-Oriented Backend

**Objective:**
Design and implement an intelligent job search platform that automates job discovery, candidate-job matching, application preparation, application tracking, and follow-up management using AI-powered agents while keeping the user in complete control of final application actions.

---

# 1. SYSTEM VISION

Most job seekers waste significant time performing repetitive tasks:

- Searching multiple job boards
- Reading job descriptions
- Comparing skills manually
- Writing cover letters repeatedly
- Tracking applications
- Following up with recruiters

The purpose of this system is to eliminate repetitive work by introducing an intelligent backend automation layer.

The user should only:

1. Upload Resume
2. Configure Preferences
3. Review Recommendations
4. Apply to Jobs

Everything else should be automated.

---

# 2. HIGH LEVEL ARCHITECTURE

```text
User
 │
 ▼
React Frontend
 │
 ▼
FastAPI Backend
 │
 ├─────────────── PostgreSQL
 │
 ├─────────────── Redis
 │
 ├─────────────── AI Services
 │
 ├─────────────── Job Aggregation Engine
 │
 ├─────────────── Notification Engine
 │
 ▼
AI Agent Orchestrator
```

---

# CORE DESIGN PRINCIPLES

### Automation First

The system continuously works in the background without user intervention.

### Event Driven

Every action triggers another process.

Example:

```text
Resume Uploaded
       ↓
Profile Created
       ↓
Jobs Matched
       ↓
Recommendations Generated
       ↓
User Notified
```

### Scalable

New job providers, AI models, and services can be added without changing core architecture.

### Cost Efficient

Uses open-source AI models only.

### User Controlled

System never submits applications automatically.

---

# TECHNOLOGY STACK

## Frontend

- React
- React Router
- Axios
- TailwindCSS

## Backend

- FastAPI
- SQLAlchemy
- Alembic
- Pydantic

## Database

- PostgreSQL (Neon)

## Background Processing

- Redis
- Celery
- Celery Beat

## AI Layer

- Ollama
- Llama 3
- Qwen
- Mistral

## Notifications

- Firebase Cloud Messaging
- Resend

## Storage

- Cloudflare R2

## Deployment

- Vercel
- Railway

---

# PHASE 1
# CANDIDATE INTELLIGENCE PLATFORM

## Objective

Transform an uploaded resume into a structured and searchable candidate profile.

---

## Business Purpose

A resume is unstructured text.

The system cannot perform matching, ranking, or recommendation tasks until the resume has been converted into structured data.

This phase establishes the candidate knowledge base.

---

## Functional Requirements

### Resume Upload

Supported Formats:

- PDF
- DOCX

API

```http
POST /api/v1/resume/upload
```

---

### Resume Parsing

Extract:

- Name
- Skills
- Experience
- Education
- Certifications
- Projects

Libraries:

```text
pdfplumber
pypdf
python-docx
```

---

### Candidate Profile Generator

Create normalized profile.

Example:

```json
{
  "skills": [],
  "experience": [],
  "education": [],
  "projects": []
}
```

---

### User Preferences

Store:

- Preferred Roles
- Preferred Locations
- Remote Preference
- Salary Expectations
- Industry Preferences

---

## Database Tables

```text
users
profiles
resumes
skills
education
experience
projects
preferences
```

---

## Deliverables

✓ Authentication System

✓ Resume Upload System

✓ Resume Parsing Service

✓ Candidate Profile Generator

✓ Preference Management

---

## AI Prompt

```text
You are an expert technical recruiter.

Analyze the provided resume and extract:

1. Technical Skills
2. Soft Skills
3. Experience
4. Education
5. Certifications
6. Projects

Return structured JSON only.
```

---

# PHASE 2
# JOB AGGREGATION & DISCOVERY ENGINE

## Objective

Build a centralized job intelligence database by continuously collecting opportunities from external job providers.

---

## Business Purpose

Job boards expose opportunities through APIs.

The platform periodically imports jobs and stores them locally.

This provides:

- Faster Search
- Better Matching
- Historical Analysis
- Reduced API Usage

---

## Job Sources

### Adzuna

Primary Provider

---

### RemoteOK

Remote Opportunities

---

### Arbeitnow

European Opportunities

---

### Greenhouse

Company Career Pages

---

### Lever

Company Career Pages

---

## Collection Workflow

```text
Scheduler
      ↓
Provider APIs
      ↓
Normalize Data
      ↓
Deduplicate Records
      ↓
Store Jobs
```

---

## Background Worker

```text
job_fetch_worker
```

Execution Frequency:

```text
Every 6 Hours
```

---

## Job Normalization

Convert all provider formats into:

```json
{
  "id": "",
  "title": "",
  "company": "",
  "location": "",
  "salary": "",
  "description": "",
  "url": "",
  "source": "",
  "posted_at": ""
}
```

---

## APIs

```http
GET /api/v1/jobs

GET /api/v1/jobs/search

GET /api/v1/jobs/{id}

POST /api/v1/jobs/sync
```

---

## Database Tables

```text
jobs
job_sources
```

---

## Deliverables

✓ Job Aggregation Service

✓ Scheduler

✓ Job Search API

✓ Job Normalization

✓ Duplicate Detection

---

# PHASE 3
# MATCHING & RECOMMENDATION ENGINE

## Objective

Identify the most relevant jobs for each candidate.

---

## Business Purpose

Users should not manually evaluate thousands of jobs.

The platform performs intelligent filtering and ranking.

---

## Matching Pipeline

```text
Candidate Profile
        ↓
Job Description
        ↓
Scoring Engine
        ↓
Semantic Analysis
        ↓
Recommendation Engine
```

---

## Layer 1
Rule-Based Matching

Factors:

- Skills
- Experience
- Education
- Location
- Job Type

---

## Layer 2
Semantic Matching

Model:

```text
all-MiniLM-L6-v2
```

Purpose:

Compare resume meaning against job description meaning.

Not just keyword matching.

---

## Layer 3
AI Recommendation Analysis

Generate:

- Strengths
- Missing Skills
- Improvement Suggestions

---

## APIs

```http
GET /api/v1/matches

GET /api/v1/matches/top

POST /api/v1/matches/recalculate
```

---

## Database Tables

```text
matches
candidate_embeddings
job_embeddings
```

---

## Deliverables

✓ Match Scoring Engine

✓ Semantic Search

✓ Recommendation Engine

✓ AI Analysis Layer

---

## AI Prompt

```text
Analyze the candidate profile and job description.

Provide:

1. Match Score
2. Matching Skills
3. Missing Skills
4. Recommendation
5. Hiring Readiness

Return structured JSON.
```

---

# PHASE 4
# AI AGENT ORCHESTRATION PLATFORM

## Objective

Automate repetitive tasks through coordinated AI agents.

---

## Business Purpose

Instead of requiring users to repeatedly search and prepare applications, the platform performs these tasks automatically.

---

## Agent Architecture

```text
Master Agent
     │
     ├── Job Discovery Agent
     ├── Matching Agent
     ├── Application Agent
     └── Follow-Up Agent
```

---

## Job Discovery Agent

Responsibilities

- Find New Jobs
- Validate Data
- Remove Duplicates

---

## Matching Agent

Responsibilities

- Calculate Scores
- Rank Jobs
- Generate Recommendations

---

## Application Agent

Responsibilities

Generate:

- Cover Letter
- Application Email
- Job Summary

---

## Follow-Up Agent

Responsibilities

- Monitor Applications
- Generate Follow-Up Drafts

---

## Agent Execution Flow

```text
Jobs Updated
      ↓
Matching Triggered
      ↓
Recommendations Created
      ↓
Application Materials Generated
      ↓
Notifications Sent
```

---

## APIs

```http
POST /api/v1/ai/cover-letter

POST /api/v1/ai/email

POST /api/v1/ai/job-summary

POST /api/v1/ai/followup
```

---

## Database Tables

```text
agent_runs
agent_logs
ai_generations
```

---

## Deliverables

✓ Agent Orchestration Layer

✓ Cover Letter Generation

✓ Email Generation

✓ Follow-Up Generation

✓ Agent Monitoring

---

## AI Prompt

```text
You are a senior technical recruiter.

Generate a professional cover letter tailored to the provided candidate profile and job description.

Requirements:

- ATS Friendly
- Professional Tone
- Quantifiable Achievements
- Role Specific
- Maximum One Page
```

---

# PHASE 5
# APPLICATION LIFECYCLE, NOTIFICATIONS & DEPLOYMENT

## Objective

Manage application progress and maintain user engagement.

---

## Application Tracking

Status Flow

```text
Saved
 ↓
Interested
 ↓
Preparing
 ↓
Applied
 ↓
Interview
 ↓
Offer
 ↓
Rejected
```

---

## APIs

```http
POST /api/v1/applications

GET /api/v1/applications

PATCH /api/v1/applications/{id}
```

---

## Follow-Up Automation

Workflow

```text
Applied
      ↓
7 Days Pass
      ↓
No Response
      ↓
Generate Follow-Up
      ↓
Notify User
```

---

## Notification System

### Email

Provider

```text
Resend
```

### Push Notifications

Provider

```text
Firebase FCM
```

---

## Notification Events

- New Job Match
- High Match Score
- Interview Reminder
- Application Reminder
- Follow-Up Reminder

---

## Background Processing

Workers

```text
job_fetch_worker

matching_worker

application_worker

notification_worker

followup_worker
```

---

## Scheduler

```text
Every 6 Hours
Fetch Jobs

Every 12 Hours
Recalculate Matches

Daily
Generate Follow-Up Suggestions
```

---

## Deployment Architecture

Frontend

```text
Vercel
```

Backend

```text
Railway
```

Database

```text
Neon PostgreSQL
```

Redis

```text
Upstash Redis
```

Storage

```text
Cloudflare R2
```

Monitoring

```text
Sentry
```

---

## Database Tables

```text
applications
notifications
followups
```

---

## Deliverables

✓ Application Tracking System

✓ Notification Engine

✓ Follow-Up Automation

✓ Background Infrastructure

✓ Monitoring

✓ Production Deployment

---

# FINAL END-TO-END USER FLOW

```text
User Registers
        ↓
Uploads Resume
        ↓
Resume Parsed
        ↓
Candidate Profile Created
        ↓
Job Aggregation Engine Runs
        ↓
Jobs Collected
        ↓
Matching Engine Executes
        ↓
Recommendations Generated
        ↓
AI Creates Cover Letters
        ↓
Notifications Sent
        ↓
User Reviews Opportunities
        ↓
User Applies
        ↓
Application Tracked
        ↓
Follow-Up Suggestions Generated
        ↓
Career Pipeline Managed Efficiently
```

# SUCCESS CRITERIA

The platform is considered complete when:

- Resume upload is fully automated.
- Job collection runs continuously.
- Matching accuracy exceeds basic keyword search.
- AI generates high-quality application materials.
- Users can manage all applications from a single dashboard.
- The system operates with minimal manual effort while maintaining user control over final submissions.
````
