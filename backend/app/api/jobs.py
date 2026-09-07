from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.services.job_provider import search_jobs

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("")
def list_jobs(
    q: str = Query("", max_length=200),
    location: str | None = Query(None, max_length=200),
    page: int = Query(1, ge=1),
    _: User = Depends(get_current_user),
):
    return search_jobs(q, location, page)


@router.get("/{job_id}")
def get_job(job_id: str, _: User = Depends(get_current_user)):
    # Adzuna's search API is the source of truth; fetch by ID and filter it
    # rather than inventing a local job record.
    jobs = search_jobs("", None)
    for job in jobs:
        if job["id"] == job_id:
            return job
    from fastapi import HTTPException

    raise HTTPException(status_code=404, detail="Job not found")
