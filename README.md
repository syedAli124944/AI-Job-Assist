# AI Job Search & Application Assistant
 
An AI-powered job search assistant that helps users find relevant job opportunities, analyze job descriptions, match them with their skills, and streamline the application process using AI, LLMs, and automated workflows.
 
Built with a React frontend, a FastAPI backend, PostgreSQL for storage, and a LangGraph-powered agent that orchestrates the job discovery → analysis → ranking → application-prep workflow.
 
## Features
 
- **Authentication** — secure signup/login with JWT-based sessions
- **Profile & Onboarding** — users save skills, experience, and job preferences
- **Real-time Job Search** — live listings pulled from the Adzuna jobs API, cached locally for fast repeat searches
- **AI Match Scoring** — jobs are scored against a user's profile skills
- **Application Tracker** — a kanban-style tracker (Applied → Interview → Assessment → Offer/Rejected)
- **AI-Generated Cover Letters** — tailored to the job and candidate, powered by OpenAI
- **AI Job Summaries, Application Emails & Follow-ups** — additional AI writing tools for the job hunt
- **Resume Upload & Parsing** — extracts skills and a suggested title from PDF/DOCX/TXT resumes
- **Notifications** — in-app alerts for match updates, interview reminders, and status changes
- **Dashboard** — at-a-glance stats: applications sent, interviews, offers, profile completion
## Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, React Router, Framer Motion, React Hook Form + Zod |
| Backend | FastAPI, SQLAlchemy 2.0, Pydantic v2 |
| Database | PostgreSQL |
| AI / Agents | LangGraph, OpenAI API |
| Job Data | Adzuna API |
| Auth | JWT (python-jose), bcrypt password hashing |
| Infrastructure | Docker & Docker Compose |
 
## Project Structure
 
```
AI-Job-Search-Application-Assistant/
├── frontend/                      # React + Vite + Tailwind
│   ├── src/
│   │   ├── features/               # auth, jobs, tracker, dashboard, coverletter,
│   │   │                           # notifications, onboarding, landing
│   │   ├── components/shared/      # Navbar, Footer, ProtectedRoute, etc.
│   │   ├── services/backendApi.js  # Real API client — talks to the FastAPI backend
│   │   ├── lib/                    # api client, auth helpers, schemas, mock fallback data
│   │   └── hooks/
│   └── Dockerfile
│
├── backend/
│   ├── app/
│   │   ├── api/                    # route handlers: auth, jobs, applications, profile,
│   │   │                           # notifications, dashboard, resume, ai, agents, health
│   │   ├── models/                 # SQLAlchemy models (User, Profile, Application, Job,
│   │   │                           # StoredJob, Notification, Resume)
│   │   ├── schemas/                # Pydantic request/response schemas
│   │   ├── services/               # business logic (auth, applications, profile,
│   │   │                           # job provider/sync, matching)
│   │   ├── agents/                 # LangGraph workflow: discover → analyze → rank → prepare
│   │   ├── db/                     # engine, session, declarative base
│   │   ├── core/                   # settings, security (JWT, password hashing)
│   │   └── main.py                 # FastAPI app entrypoint
│   ├── tests/
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```
 
## Prerequisites
 
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- A free [Adzuna API](https://developer.adzuna.com/) `app_id` and `app_key` (for real job listings)
- An [OpenAI API key](https://platform.openai.com/api-keys) (for AI cover letters, summaries, emails)
Both API keys are optional for basic local development — without them, the app gracefully falls back to sample job data and disables AI generation with a clear message, rather than breaking.
 
## Getting Started
 
### 1. Clone the repository
 
```bash
git clone https://github.com/mufassiriqbal/AI-Job-Search-Application-Assistant
cd AI-Job-Search-Application-Assistant
```
 
### 2. Set up environment variables
 
```bash
cp .env.example .env
```
 
Then open `.env` and fill in your keys:
 
```env
SECRET_KEY=replace-with-a-long-random-string
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
OPENAI_API_KEY=your_openai_api_key
```
 
### 3. Start everything with Docker
 
```bash
docker compose up --build
```
 
This starts PostgreSQL, the FastAPI backend, and the React frontend together, with the backend waiting for the database to be healthy before starting.
 
### 4. Open the app
 
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API docs (Swagger UI):** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health check:** [http://localhost:8000/health](http://localhost:8000/health)
## Running Without Docker
 
**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
 
**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
 
## Running Tests
 
```bash
cd backend
pytest
```
 
## API Overview
 
| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Profile | `GET/POST /profile/preferences` |
| Jobs | `GET /jobs`, `GET /jobs/{id}`, `POST /jobs/sync`, `GET /jobs/search` |
| Applications | `GET/POST /applications`, `PATCH /applications/{id}/status`, `DELETE /applications/{id}` |
| Notifications | `GET /notifications`, `PATCH /notifications/{id}/read`, `POST /notifications/read-all`, `DELETE /notifications/{id}` |
| Dashboard | `GET /dashboard/stats` |
| Resume | `POST /resume/upload` |
| AI | `POST /ai/cover-letter`, `POST /ai/job-summary`, `POST /ai/email`, `POST /ai/followup` |
| Agents | `POST /agents/job-search-workflow` — runs the full LangGraph discover→analyze→rank→prepare pipeline |
 
Full, always-accurate documentation for every endpoint is available at `/docs` once the backend is running.
 
## Environment Variables Reference
 
| Variable | Required | Description |
|---|---|---|
| `SECRET_KEY` | Yes | Signs JWT tokens — use a long random string in production |
| `DATABASE_URL` | Auto-set by Docker Compose | PostgreSQL connection string |
| `ADZUNA_APP_ID` / `ADZUNA_APP_KEY` | Optional | Enables real job search; falls back to sample data without it |
| `OPENAI_API_KEY` | Optional | Enables AI cover letters, summaries, emails, follow-ups |
| `ANTHROPIC_API_KEY` | Optional | Reserved for future Claude-based agent features |
 
## Notes on Fallback Behavior
 
Job listings and AI writing features are designed to degrade gracefully:
- If Adzuna isn't configured or is unreachable, job search falls back to a small local cache of stored jobs, then to bundled sample listings.
- If OpenAI isn't configured, cover letter generation falls back to a locally generated starter template instead of failing.
This means the app is fully explorable end-to-end even before any API keys are added.
 
## Roadmap
 
- [ ] Deploy backend and frontend to a public hosting environment
- [ ] Replace keyword-based skill matching with an LLM-based semantic match
- [ ] Add Alembic migrations for production-safe schema changes
- [ ] Expand the LangGraph agent to use real profile + job data end-to-end (currently partially wired)
- [ ] Add email/password reset flow on the backend (frontend page already exists)
## License
 
This project is currently private / unlicensed. Add a license here if you plan to open-source it.
 
