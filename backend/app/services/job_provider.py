"""
Job provider service — JSearch (RapidAPI) as primary source.

JSearch aggregates real-time jobs from:
  - Google Jobs
  - Indeed
  - LinkedIn
  - Glassdoor
  - ZipRecruiter
  - and 20+ more boards

Adzuna is kept as a fallback if JSearch is unavailable.
"""
from datetime import datetime
import logging

import httpx
from fastapi import HTTPException, status

from app.core.config import get_settings

logger = logging.getLogger(__name__)

# In-memory fast cache of jobs retrieved recently: job_id -> job_dict
_JOB_CACHE: dict[str, dict] = {}


# ─── JSearch (Primary) ────────────────────────────────────────────────────────

def search_jobs(query: str, location: str | None, page: int = 1) -> list[dict]:
    """
    Fetch live jobs from JSearch (RapidAPI).
    Falls back to Adzuna if the JSearch key is not configured or fails.
    """
    settings = get_settings()

    if settings.JSEARCH_API_KEY:
        try:
            results = _jsearch_search(query, location, page, settings)
            if results:
                # Cache results for fast detail lookups
                for j in results:
                    _JOB_CACHE[str(j["id"])] = j
                return results
        except Exception as exc:
            logger.warning("JSearch search failed, attempting fallback: %s", exc)

    # Fallback: Adzuna
    if settings.ADZUNA_APP_ID and settings.ADZUNA_APP_KEY:
        try:
            return _adzuna_search(query, location, page, settings)
        except Exception as exc:
            logger.error("Adzuna search also failed: %s", exc)

    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="No job search provider is configured or available.",
    )


def get_job_by_id(job_id: str) -> dict | None:
    """
    Fetch a single job by its ID.
    1. Check memory cache first (instant 0ms response).
    2. Fetch from JSearch /job-details API if available.
    Returns None if not found.
    """
    # 1. In-memory cache
    if str(job_id) in _JOB_CACHE:
        return _JOB_CACHE[str(job_id)]

    # 2. Live fetch from JSearch /job-details
    settings = get_settings()
    if not settings.JSEARCH_API_KEY:
        return None

    try:
        resp = httpx.get(
            "https://jsearch.p.rapidapi.com/job-details",
            params={"job_id": job_id, "extended_publisher_details": "false"},
            headers={
                "X-RapidAPI-Key": settings.JSEARCH_API_KEY,
                "X-RapidAPI-Host": settings.JSEARCH_API_HOST,
            },
            timeout=15,
        )
        resp.raise_for_status()
        res_json = resp.json()
        data = res_json.get("data", [])
        if isinstance(data, list) and len(data) > 0:
            job = _normalize_jsearch(data[0])
            _JOB_CACHE[str(job_id)] = job
            return job
        elif isinstance(data, dict) and data:
            job = _normalize_jsearch(data)
            _JOB_CACHE[str(job_id)] = job
            return job
    except Exception as exc:
        logger.warning("Failed to fetch job details from JSearch for %s: %s", job_id, exc)

    return None


# ─── JSearch implementation ───────────────────────────────────────────────────

def _jsearch_search(query: str, location: str | None, page: int, settings) -> list[dict]:
    # Build query string
    q_parts = []
    clean_q = (query or "").strip()
    if clean_q:
        q_parts.append(clean_q)
    else:
        q_parts.append("developer")

    clean_loc = (location or "").strip()
    if clean_loc and clean_loc.lower() not in ("all", "remote"):
        q_parts.append(f"in {clean_loc}")
    elif clean_loc.lower() == "remote":
        q_parts.append("remote")

    params = {
        "query": " ".join(q_parts),
        "page": str(page),
        "num_pages": "1",
    }

    try:
        resp = httpx.get(
            "https://jsearch.p.rapidapi.com/search-v2",
            params=params,
            headers={
                "X-RapidAPI-Key": settings.JSEARCH_API_KEY,
                "X-RapidAPI-Host": settings.JSEARCH_API_HOST,
            },
            timeout=20,
        )
        resp.raise_for_status()
    except httpx.HTTPError as exc:
        logger.error("JSearch API HTTP error: %s", exc)
        raise

    res_json = resp.json()
    data = res_json.get("data", {})
    if isinstance(data, dict):
        results = data.get("jobs", [])
    elif isinstance(data, list):
        results = data
    else:
        results = []

    return [_normalize_jsearch(item) for item in results]


def _normalize_jsearch(item: dict) -> dict:
    """Normalize a JSearch API result to our standard job schema."""
    # Posted date
    posted_at = item.get("job_posted_at_datetime_utc", "")
    if posted_at:
        try:
            dt = datetime.fromisoformat(posted_at.replace("Z", "+00:00"))
            posted_at = f"{dt.strftime('%b')} {dt.day}, {dt.year}"
        except ValueError:
            posted_at = str(item.get("job_posted_at", ""))
    elif item.get("job_posted_at"):
        posted_at = str(item.get("job_posted_at"))

    # Salary
    min_sal = item.get("job_min_salary")
    max_sal = item.get("job_max_salary")
    period = (item.get("job_salary_period") or "year").lower()
    if min_sal and max_sal:
        if period == "year":
            salary = f"${min_sal:,.0f} - ${max_sal:,.0f}/yr"
        elif period == "month":
            salary = f"${min_sal:,.0f} - ${max_sal:,.0f}/mo"
        elif period == "hour":
            salary = f"${min_sal:.0f} - ${max_sal:.0f}/hr"
        else:
            salary = f"${min_sal:,.0f} - ${max_sal:,.0f}"
    elif min_sal:
        salary = f"From ${min_sal:,.0f}"
    elif item.get("job_salary_string"):
        salary = str(item.get("job_salary_string"))
    else:
        salary = "Competitive / Not listed"

    # Location
    city = item.get("job_city") or ""
    state = item.get("job_state") or ""
    country = item.get("job_country") or ""
    is_remote = item.get("job_is_remote", False)
    if is_remote:
        location = "Remote"
    elif city and state:
        location = f"{city}, {state}"
    elif city:
        location = f"{city}, {country}"
    else:
        location = country or "Location not specified"

    # Requirements / highlights
    highlights = item.get("job_highlights") or {}
    qualifications = highlights.get("Qualifications") or []
    responsibilities = highlights.get("Responsibilities") or []

    # Tags / required skills
    required_skills = item.get("job_required_skills") or []
    if not required_skills and qualifications:
        # Extract small keywords if needed
        required_skills = [q[:30] for q in qualifications[:5]]

    apply_url = item.get("job_apply_link") or item.get("job_google_link") or ""

    # Experience string
    exp_months = item.get("job_required_experience", {}).get("required_experience_in_months")
    if exp_months:
        years = exp_months // 12
        experience_str = f"{years}+ yrs" if years > 0 else "Entry-level"
    else:
        experience_str = "Not specified"

    return {
        "id": str(item.get("job_id", "")),
        "title": item.get("job_title") or "Untitled Role",
        "company": item.get("employer_name") or "Unknown Company",
        "location": location,
        "type": item.get("job_employment_type") or "Full-time",
        "salary": salary,
        "experience": experience_str,
        "postedAt": posted_at or "Recently",
        "description": item.get("job_description") or "",
        "requirements": qualifications[:8],
        "responsibilities": responsibilities[:6],
        "about": f"{item.get('employer_name', '')} is hiring for a {item.get('job_title', '')} position.",
        "tags": required_skills[:8],
        "url": apply_url,
        "apply_url": apply_url,
        "logo": item.get("employer_logo") or "",
        "publisher": item.get("job_publisher") or "",
        "matchScore": None,
    }


# ─── Adzuna fallback ──────────────────────────────────────────────────────────

def _adzuna_search(query: str, location: str | None, page: int, settings) -> list[dict]:
    params = {
        "app_id": settings.ADZUNA_APP_ID,
        "app_key": settings.ADZUNA_APP_KEY,
        "results_per_page": 20,
        "what": query or "software engineer",
    }
    if location:
        params["where"] = location

    try:
        resp = httpx.get(
            f"https://api.adzuna.com/v1/api/jobs/{settings.ADZUNA_COUNTRY}/search/{page}",
            params=params,
            headers={"Content-Type": "application/json"},
            timeout=15,
        )
        resp.raise_for_status()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="Adzuna API could not be reached.") from exc

    results = resp.json().get("results", [])
    return [_normalize_adzuna(item) for item in results]


def _normalize_adzuna(item: dict) -> dict:
    created = item.get("created", "")
    if created:
        try:
            dt = datetime.fromisoformat(created.replace("Z", "+00:00"))
            created = f"{dt.strftime('%b')} {dt.day}, {dt.year}"
        except ValueError:
            pass

    salary_min = item.get("salary_min")
    salary_max = item.get("salary_max")
    if salary_min and salary_max:
        salary = f"${salary_min:,.0f} - ${salary_max:,.0f}"
    elif salary_min:
        salary = f"From ${salary_min:,.0f}"
    else:
        salary = "Salary not listed"

    location_parts = item.get("location", {}).get("display_name", "").split(", ")
    location = ", ".join(location_parts[:2]) if location_parts else "Unknown"

    return {
        "id": str(item.get("id", "")),
        "title": item.get("title", "").replace("<strong>", "").replace("</strong>", ""),
        "company": item.get("company", {}).get("display_name", "Unknown Company"),
        "location": location,
        "type": item.get("contract_time", "Full-time").replace("_", " ").title(),
        "salary": salary,
        "experience": "Not specified",
        "postedAt": created or "Recently",
        "description": item.get("description", "").replace("<strong>", "").replace("</strong>", ""),
        "requirements": [],
        "responsibilities": [],
        "about": f"{item.get('company', {}).get('display_name', '')} is hiring.",
        "tags": [item.get("category", {}).get("label", "General")] if item.get("category") else [],
        "url": item.get("redirect_url", ""),
        "apply_url": item.get("redirect_url", ""),
        "matchScore": None,
    }
