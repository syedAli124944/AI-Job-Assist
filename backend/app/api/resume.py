import io
import json
from pathlib import Path

from docx import Document
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pypdf import PdfReader
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.profile import Profile
from app.models.resume import Resume
from app.models.user import User

router = APIRouter(prefix="/resume", tags=["resume"])


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Resume exceeds the 10MB limit.")
    text = _extract_text(file.filename or "", content)
    if not text.strip():
        raise HTTPException(status_code=422, detail="The uploaded resume did not contain readable text.")

    skills = _extract_skills(text)
    resume = Resume(user_id=user.id, file_name=file.filename or "resume", file_size=len(content), text=text, parsed_skills=json.dumps(skills), suggested_title=_suggest_title(text))
    db.add(resume)
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if profile is None:
        profile = Profile(user_id=user.id)
        db.add(profile)
    profile.resume_file_name = resume.file_name
    profile.resume_text = text
    profile.skills = json.dumps(skills)
    db.commit()
    db.refresh(resume)
    return {
        "id": str(resume.id), "fileName": resume.file_name, "fileSize": f"{len(content) / 1024 / 1024:.2f} MB",
        "uploadedAt": resume.created_at.isoformat(), "parsedSkills": skills,
        "suggestedTitle": resume.suggested_title, "extractedEmail": _extract_email(text),
    }


def _extract_text(filename: str, content: bytes) -> str:
    suffix = Path(filename).suffix.lower()
    try:
        if suffix == ".pdf":
            return "\n".join(page.extract_text() or "" for page in PdfReader(io.BytesIO(content)).pages)
        if suffix == ".docx":
            return "\n".join(paragraph.text for paragraph in Document(io.BytesIO(content)).paragraphs)
        if suffix in {".txt", ".text"}:
            return content.decode("utf-8", errors="replace")
    except Exception as exc:
        raise HTTPException(status_code=422, detail="The resume could not be parsed.") from exc
    raise HTTPException(status_code=415, detail="Only PDF, DOCX, and TXT resumes are supported.")


def _extract_skills(text: str) -> list[str]:
    known = ["Python", "FastAPI", "JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL", "SQL", "Docker", "AWS", "GraphQL", "Figma"]
    lowered = text.lower()
    return [skill for skill in known if skill.lower() in lowered]


def _suggest_title(text: str) -> str | None:
    for title in ("Frontend Engineer", "Backend Engineer", "Full Stack Developer", "Product Designer", "Data Scientist", "DevOps Engineer"):
        if title.lower() in text.lower():
            return title
    return None


def _extract_email(text: str) -> str | None:
    import re
    match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
    return match.group(0) if match else None
