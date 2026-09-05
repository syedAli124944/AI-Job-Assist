"""
Tool functions the agent nodes call out to.
Kept separate from node logic so they're independently testable and
swappable (e.g. Adzuna today, a different provider tomorrow).
"""


def search_jobs(preferences: dict) -> list[dict]:
    """
    Placeholder job search. Replace with a real call to your job API
    adapter (e.g. app/services/job_providers/adzuna.py).
    """
    return [
        {
            "id": "job_1",
            "title": "Backend Engineer",
            "company": "Example Co",
            "description": "Python, FastAPI, PostgreSQL experience needed.",
        },
    ]


def extract_keywords(description: str) -> list[str]:
    """Placeholder keyword extraction. Replace with an LLM call or NLP pipeline."""
    known_skills = ["python", "fastapi", "postgresql", "react", "sql", "docker"]
    text = description.lower()
    return [skill for skill in known_skills if skill in text]


def generate_cover_letter(candidate_id: str, job: dict) -> str:
    """Placeholder cover letter generation. Replace with an LLM call using
    verified candidate profile data + job details."""
    return f"Dear Hiring Manager, I'm excited to apply for {job.get('title', 'this role')}..."
