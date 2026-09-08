"""
Agent tools — real implementations wired to production services.

Each function is independently testable and swappable.
"""
import json
from typing import Optional

from app.core.config import get_settings


def search_jobs(preferences: dict) -> list[dict]:
    """
    Fetch job listings from Adzuna using candidate preferences.
    Falls back to an empty list if the provider is unavailable.
    """
    from app.services.job_provider import search_jobs as provider_search
    from fastapi import HTTPException

    query = preferences.get("role", preferences.get("title", "software engineer"))
    location = preferences.get("location")
    try:
        return provider_search(query, location, page=1)
    except HTTPException:
        return []
    except Exception:
        return []


def extract_keywords(description: str) -> list[str]:
    """
    Extract skill keywords from a job description using the known skills list.
    Falls back to simple token matching when OpenAI is unavailable.
    """
    from app.api.resume import _KNOWN_SKILLS  # reuse the curated list
    lowered = description.lower()
    return [skill for skill in _KNOWN_SKILLS if skill.lower() in lowered]


def generate_cover_letter(candidate_id: str, job: dict) -> str:
    """
    Generate a cover letter for the given job using OpenAI.
    Falls back to a polite template when the API key is absent.
    """
    settings = get_settings()
    if not settings.OPENAI_API_KEY:
        return (
            f"Dear Hiring Manager,\n\n"
            f"I am writing to express my interest in the {job.get('title', 'open')} position "
            f"at {job.get('company', 'your company')}. I believe my skills and experience make "
            f"me a strong candidate for this role.\n\n"
            f"I look forward to the opportunity to discuss how I can contribute to your team.\n\n"
            f"Sincerely,\n[Candidate]"
        )
    try:
        from openai import OpenAI
        kwargs = {"api_key": settings.OPENAI_API_KEY}
        if settings.OPENAI_BASE_URL:
            kwargs["base_url"] = settings.OPENAI_BASE_URL
        client = OpenAI(**kwargs)
        prompt = (
            f"Write a concise, professional, ATS-friendly cover letter for the following job. "
            f"Keep it under one page and use only the details supplied.\n\n"
            f"Job Title: {job.get('title', 'N/A')}\n"
            f"Company: {job.get('company', 'N/A')}\n"
            f"Description: {job.get('description', '')[:2000]}\n\n"
            f"Candidate ID: {candidate_id}"
        )
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=600,
        )
        return response.choices[0].message.content or ""
    except Exception:
        return (
            f"Dear Hiring Manager,\n\n"
            f"I am excited to apply for the {job.get('title', 'open')} role at "
            f"{job.get('company', 'your company')}. Please consider my application.\n\n"
            f"Best regards,\n[Candidate]"
        )
