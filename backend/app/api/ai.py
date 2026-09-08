"""
AI generation endpoints.

Endpoints:
  POST /ai/cover-letter   — Generate a tailored cover letter
  POST /ai/job-summary    — Summarize a job description
  POST /ai/email          — Generate an application email
  POST /ai/followup       — Generate a follow-up email draft
"""
from fastapi import APIRouter, Depends, HTTPException
from openai import OpenAI
from pydantic import BaseModel
from typing import Optional

from app.api.deps import get_current_user
from app.core.config import get_settings
from app.models.user import User

router = APIRouter(prefix="/ai", tags=["ai"])


def _get_openai_client():
    settings = get_settings()
    if not settings.OPENAI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="AI features are not configured. Set OPENAI_API_KEY in your .env file.",
        )
    kwargs = {"api_key": settings.OPENAI_API_KEY}
    if settings.OPENAI_BASE_URL:
        kwargs["base_url"] = settings.OPENAI_BASE_URL
    return OpenAI(**kwargs), settings


def _call_llm(client: OpenAI, model: str, prompt: str) -> str:
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
        )
        return response.choices[0].message.content
    except Exception as exc:
        import logging
        logging.getLogger(__name__).error("LLM call failed for model '%s': %s", model, exc)
        raise HTTPException(status_code=502, detail=f"The AI provider returned an error: {exc}") from exc


# ─── Schemas ──────────────────────────────────────────────────────────────────

class CoverLetterRequest(BaseModel):
    job: dict
    resume_text: Optional[str] = None


class JobSummaryRequest(BaseModel):
    job: dict


class EmailRequest(BaseModel):
    job: dict
    resume_text: Optional[str] = None


class FollowUpRequest(BaseModel):
    job: dict
    application_date: Optional[str] = None


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/cover-letter")
def generate_cover_letter(
    payload: CoverLetterRequest,
    _: User = Depends(get_current_user),
):
    client, settings = _get_openai_client()
    prompt = (
        "You are a senior technical recruiter. Write a concise, professional, ATS-friendly cover letter "
        "tailored to the provided job and candidate resume. Use only the details supplied — "
        "do not invent employers, dates, achievements, or skills. Maximum one page.\n\n"
        f"Job:\n{payload.job}\n\n"
        f"Candidate resume:\n{payload.resume_text or 'No resume supplied.'}"
    )
    return {"coverLetter": _call_llm(client, settings.OPENAI_MODEL, prompt)}


@router.post("/job-summary")
def summarize_job(
    payload: JobSummaryRequest,
    _: User = Depends(get_current_user),
):
    client, settings = _get_openai_client()
    prompt = (
        "Summarize the following job posting in 3–5 concise bullet points. "
        "Focus on role, key responsibilities, required skills, and company highlights.\n\n"
        f"Job:\n{payload.job}"
    )
    return {"summary": _call_llm(client, settings.OPENAI_MODEL, prompt)}


@router.post("/email")
def generate_application_email(
    payload: EmailRequest,
    _: User = Depends(get_current_user),
):
    client, settings = _get_openai_client()
    prompt = (
        "Write a short, professional job application email (subject line + body) for the role below. "
        "Use only the candidate details supplied. Keep it under 200 words.\n\n"
        f"Job:\n{payload.job}\n\n"
        f"Candidate resume:\n{payload.resume_text or 'No resume supplied.'}"
    )
    return {"email": _call_llm(client, settings.OPENAI_MODEL, prompt)}


@router.post("/followup")
def generate_followup_email(
    payload: FollowUpRequest,
    _: User = Depends(get_current_user),
):
    client, settings = _get_openai_client()
    date_hint = f" The application was submitted on {payload.application_date}." if payload.application_date else ""
    prompt = (
        f"Write a brief, professional follow-up email for a job application that has received no response.{date_hint} "
        "Keep it polite, under 150 words, and include a subject line.\n\n"
        f"Job:\n{payload.job}"
    )
    return {"followUp": _call_llm(client, settings.OPENAI_MODEL, prompt)}
