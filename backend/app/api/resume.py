"""
Resume upload, text extraction, and AI-powered profile parsing.

Endpoints:
  POST /resume/upload — accepts PDF / DOCX / TXT, extracts text,
                        runs AI parsing (if OPENAI_API_KEY is set),
                        and persists results to the DB.
"""
import io
import json
import re
from pathlib import Path
from typing import Optional

from docx import Document
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pypdf import PdfReader
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import get_settings
from app.db.session import get_db
from app.models.profile import Profile
from app.models.resume import Resume
from app.models.user import User
from app.services.notification_service import notify

router = APIRouter(prefix="/resume", tags=["resume"])

# ─── Upload Endpoint ──────────────────────────────────────────────────────────

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Resume exceeds the 10MB limit.")

    text = _extract_text(file.filename or "", content)
    if not text.strip():
        raise HTTPException(
            status_code=422,
            detail="The uploaded resume did not contain readable text.",
        )

    # ── Keyword-based skill fallback (always runs) ──
    keyword_skills = _extract_skills(text)

    # ── AI-powered full profile extraction (optional, needs OPENAI_API_KEY) ──
    settings = get_settings()
    ai_profile: Optional[dict] = None
    ai_skills: list[str] = []
    if settings.OPENAI_API_KEY:
        ai_profile = _ai_extract_profile(text, settings)
        if ai_profile:
            ai_skills = ai_profile.get("skills", [])

    # Merge: AI skills take priority; keyword skills fill any gaps
    skills = ai_skills or keyword_skills
    if ai_skills and keyword_skills:
        # Include keyword skills not already captured by AI
        extra = [s for s in keyword_skills if s not in ai_skills]
        skills = ai_skills + extra

    # ── Persist Resume record ──
    resume = Resume(
        user_id=user.id,
        file_name=file.filename or "resume",
        file_size=len(content),
        text=text,
        parsed_skills=json.dumps(skills),
        suggested_title=_suggest_title(text, ai_profile),
    )
    db.add(resume)

    # ── Upsert Profile record ──
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if profile is None:
        profile = Profile(user_id=user.id)
        db.add(profile)

    profile.resume_file_name = resume.file_name
    profile.resume_text = text
    profile.skills = json.dumps(skills)

    if ai_profile:
        profile.parsed_profile = json.dumps(ai_profile)
        # Pre-fill full_name from AI if blank
        if ai_profile.get("name") and not profile.full_name:
            profile.full_name = ai_profile["name"]

    db.commit()
    db.refresh(resume)

    # ── Auto-notify ──
    notify(
        db,
        user.id,
        "resume",
        "Resume uploaded successfully",
        f"Your resume '{resume.file_name}' was parsed. {len(skills)} skill(s) detected.",
    )

    return {
        "id": str(resume.id),
        "fileName": resume.file_name,
        "fileSize": f"{len(content) / 1024 / 1024:.2f} MB",
        "uploadedAt": resume.created_at.isoformat(),
        "skills": skills,
        "parsedSkills": skills,
        "suggestedTitle": resume.suggested_title,
        "extractedEmail": _extract_email(text),
        "aiProfile": ai_profile,  # null when no API key; populated when AI ran
        "parsed_profile": ai_profile,
    }


# ─── Text Extraction ──────────────────────────────────────────────────────────

def _extract_text(filename: str, content: bytes) -> str:
    suffix = Path(filename).suffix.lower()
    try:
        if suffix == ".pdf":
            return "\n".join(
                page.extract_text() or ""
                for page in PdfReader(io.BytesIO(content)).pages
            )
        if suffix == ".docx":
            return "\n".join(
                paragraph.text
                for paragraph in Document(io.BytesIO(content)).paragraphs
            )
        if suffix in {".txt", ".text"}:
            return content.decode("utf-8", errors="replace")
    except Exception as exc:
        raise HTTPException(
            status_code=422, detail="The resume could not be parsed."
        ) from exc
    raise HTTPException(
        status_code=415, detail="Only PDF, DOCX, and TXT resumes are supported."
    )


# ─── AI Extraction ────────────────────────────────────────────────────────────

_AI_PROMPT = """\
You are an expert technical recruiter.

Analyze the provided resume text and extract ALL relevant information.

Return ONLY a valid JSON object with these exact keys (no markdown, no explanation):
{
  "name": "full name or null",
  "email": "email or null",
  "phone": "phone number or null",
  "location": "city, country or null",
  "summary": "2-3 sentence professional summary",
  "skills": ["skill1", "skill2", ...],
  "experience": [
    {
      "title": "job title",
      "company": "company name",
      "duration": "start – end",
      "description": "brief summary of responsibilities"
    }
  ],
  "education": [
    {
      "degree": "degree name",
      "institution": "institution name",
      "year": "graduation year or range"
    }
  ],
  "certifications": ["cert1", "cert2"],
  "projects": [
    {
      "name": "project name",
      "description": "brief description",
      "technologies": ["tech1", "tech2"]
    }
  ],
  "languages": ["language1", "language2"]
}

Resume text:
"""


def _ai_extract_profile(text: str, settings) -> Optional[dict]:
    """
    Call OpenAI to extract a structured profile from resume text.
    Returns parsed dict on success, None on any failure (graceful fallback).
    """
    try:
        from openai import OpenAI  # lazy import — not required if key absent

        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        # Truncate very long resumes to stay within token limits
        truncated = text[:8000]
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[{"role": "user", "content": _AI_PROMPT + truncated}],
            temperature=0.0,
            max_tokens=1500,
        )
        raw = response.choices[0].message.content or ""
        # Strip markdown fences if model adds them
        raw = raw.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
        return json.loads(raw)
    except Exception:
        # If AI fails for any reason, fall through to keyword fallback
        return None


# ─── Keyword Helpers ──────────────────────────────────────────────────────────

_KNOWN_SKILLS = [
    "Python", "FastAPI", "Django", "Flask",
    "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Angular",
    "Node.js", "Express", "NestJS",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite",
    "SQL", "NoSQL",
    "Docker", "Kubernetes", "AWS", "GCP", "Azure",
    "GraphQL", "REST", "gRPC",
    "Git", "CI/CD", "GitHub Actions", "Jenkins",
    "Figma", "Adobe XD",
    "TailwindCSS", "SCSS", "CSS",
    "Machine Learning", "TensorFlow", "PyTorch", "Pandas", "NumPy",
    "Celery", "RabbitMQ", "Kafka",
    "Linux", "Bash", "Shell scripting",
    "Java", "Go", "Rust", "C++", "C#", "PHP", "Ruby",
]


def _extract_skills(text: str) -> list[str]:
    lowered = text.lower()
    return [skill for skill in _KNOWN_SKILLS if skill.lower() in lowered]


def _suggest_title(text: str, ai_profile: Optional[dict] = None) -> Optional[str]:
    # Try to grab first job title from AI profile experience
    if ai_profile:
        experience = ai_profile.get("experience", [])
        if experience and isinstance(experience, list):
            first_title = experience[0].get("title") if experience else None
            if first_title:
                return first_title

    candidates = [
        "Frontend Engineer", "Senior Frontend Engineer",
        "Backend Engineer", "Senior Backend Engineer",
        "Full Stack Developer", "Full Stack Engineer",
        "Product Designer", "UI/UX Designer",
        "Data Scientist", "Data Analyst",
        "DevOps Engineer", "Site Reliability Engineer",
        "Machine Learning Engineer", "AI Engineer",
        "Mobile Developer", "iOS Developer", "Android Developer",
        "Software Engineer", "Software Developer",
    ]
    lowered = text.lower()
    for title in candidates:
        if title.lower() in lowered:
            return title
    return None


def _extract_email(text: str) -> Optional[str]:
    match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
    return match.group(0) if match else None
