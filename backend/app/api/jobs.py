"""
Jobs API — search and retrieve job listings from Adzuna.
Jobs are enriched with a matchScore derived from the user's profile skills.
"""
import json

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.profile import Profile
from app.models.user import User
from app.services.job_provider import search_jobs
from app.services.job_sync_service import search_stored_jobs, sync_jobs_from_adzuna
from app.services.matching_service import enrich_jobs_with_scores

router = APIRouter(prefix="/jobs", tags=["jobs"])


def _get_profile_skills(db: Session, user: User) -> list[str]:
    """Return parsed skills list from the user's profile, or empty list."""
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if profile and profile.skills:
        try:
            return json.loads(profile.skills)
        except (ValueError, TypeError):
            pass
    return []


@router.get("")
def list_jobs(
    q: str = Query("", max_length=200),
    location: str | None = Query(None, max_length=200),
    page: int = Query(1, ge=1),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Search jobs live via Adzuna and enrich each result with a matchScore based
    on the authenticated user's profile skills.
    Infers query from candidate profile when q is empty.
    """
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    effective_query = q.strip()
    if not effective_query and profile:
        if profile.preferred_job_titles:
            try:
                titles = json.loads(profile.preferred_job_titles)
                if titles and isinstance(titles, list) and len(titles) > 0 and titles[0]:
                    effective_query = str(titles[0])
            except Exception:
                if isinstance(profile.preferred_job_titles, str):
                    effective_query = profile.preferred_job_titles.split(",")[0].strip()
        if not effective_query and profile.skills:
            try:
                skills = json.loads(profile.skills)
                if skills and isinstance(skills, list) and len(skills) > 0 and skills[0]:
                    effective_query = str(skills[0])
            except Exception:
                pass

    try:
        jobs = search_jobs(effective_query, location, page)
    except Exception:
        jobs = search_stored_jobs(db, query=effective_query, location=location, limit=20, offset=(page - 1) * 20)

    profile_skills = _get_profile_skills(db, current_user)
    return enrich_jobs_with_scores(profile_skills, jobs)


@router.post("/sync")
def sync_jobs_endpoint(
    query: str = Query("", max_length=200),
    location: str | None = Query(None, max_length=200),
    pages: int = Query(2, ge=1, le=5),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Fetch jobs from external provider (Adzuna) and upsert into the local stored_jobs table.
    """
    return sync_jobs_from_adzuna(db, query=query, location=location, pages=pages)


@router.get("/search")
def search_jobs_cached(
    q: str = Query("", max_length=200),
    location: str | None = Query(None, max_length=200),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Search locally cached jobs in stored_jobs table and enrich with matchScore.
    If no local jobs match and offset is 0, attempts to fetch from external provider if available.
    """
    local_jobs = search_stored_jobs(db, query=q, location=location, limit=limit, offset=offset)
    if not local_jobs and offset == 0:
        try:
            provider_jobs = search_jobs(q, location, page=1)
            if provider_jobs:
                local_jobs = provider_jobs[:limit]
        except Exception:
            pass

    profile_skills = _get_profile_skills(db, current_user)
    return enrich_jobs_with_scores(profile_skills, local_jobs)


@router.get("/{job_id:path}")
def get_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Fetch a single job by ID.
    1. Check local stored_jobs cache first (fast).
    2. Fetch from JSearch API by job_id (accurate, works with JSearch IDs).
    3. Return 404 if not found.
    """
    from app.models.stored_job import StoredJob
    from app.services.job_sync_service import _row_to_dict
    from app.services.job_provider import get_job_by_id

    # Fast path: local DB cache
    stored = db.query(StoredJob).filter(StoredJob.external_id == job_id).first()
    if stored:
        profile_skills = _get_profile_skills(db, current_user)
        job = _row_to_dict(stored)
        from app.services.matching_service import calculate_match_score
        job["matchScore"] = calculate_match_score(profile_skills, job)
        return job

    # Accurate path: JSearch get-by-ID API
    job = get_job_by_id(job_id)
    if job:
        profile_skills = _get_profile_skills(db, current_user)
        from app.services.matching_service import calculate_match_score
        job["matchScore"] = calculate_match_score(profile_skills, job)
        return job

    raise HTTPException(status_code=404, detail="Job not found")

