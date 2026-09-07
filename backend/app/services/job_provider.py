from datetime import datetime, timezone

import httpx
from fastapi import HTTPException, status

from app.core.config import get_settings


def search_jobs(query: str, location: str | None, page: int = 1) -> list[dict]:
    settings = get_settings()
    if not settings.ADZUNA_APP_ID or not settings.ADZUNA_APP_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Job search is not configured. Set ADZUNA_APP_ID and ADZUNA_APP_KEY.",
        )

    params = {
        "app_id": settings.ADZUNA_APP_ID,
        "app_key": settings.ADZUNA_APP_KEY,
        "results_per_page": 20,
        "what": query or "software engineer",
        "content-type": "application/json",
        "page": page,
    }
    if location:
        params["where"] = location

    try:
        response = httpx.get(
            f"https://api.adzuna.com/v1/api/jobs/{settings.ADZUNA_COUNTRY}/search/{page}",
            params=params,
            timeout=15,
        )
        response.raise_for_status()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="The job provider could not be reached.") from exc

    return [_normalize_job(item) for item in response.json().get("results", [])]


def _normalize_job(item: dict) -> dict:
    created = item.get("created")
    posted_at = created
    if created:
        try:
            posted_at = datetime.fromisoformat(created.replace("Z", "+00:00")).astimezone(timezone.utc).strftime("%b %-d, %Y")
        except ValueError:
            posted_at = created
    return {
        "id": str(item.get("id")),
        "title": item.get("title") or "Untitled role",
        "company": (item.get("company") or {}).get("display_name", "Unknown company"),
        "location": (item.get("location") or {}).get("display_name", "Unspecified"),
        "type": item.get("contract_type") or "Full-time",
        "salary": _salary(item),
        "experience": "Not specified",
        "postedAt": posted_at,
        "description": item.get("description") or "",
        "requirements": [],
        "about": "",
        "tags": [],
        "url": item.get("redirect_url"),
        "matchScore": None,
    }


def _salary(item: dict) -> str:
    minimum = item.get("salary_min")
    maximum = item.get("salary_max")
    if minimum and maximum:
        return f"${minimum:,.0f} - ${maximum:,.0f}"
    if minimum:
        return f"From ${minimum:,.0f}"
    return "Salary not listed"
