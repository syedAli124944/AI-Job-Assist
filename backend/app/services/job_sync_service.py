"""
Job Sync Service — fetches jobs from Adzuna and upserts them into the
local stored_jobs table for fast local search.

Design decisions:
- Upsert by (source, external_id) to avoid duplicate rows across syncs.
- Full payload is stored as JSON text for future-proofing.
- Returns the count of new rows inserted vs already existing.
"""
from __future__ import annotations

import json

from sqlalchemy.orm import Session

from app.models.stored_job import StoredJob
from app.services.job_provider import search_jobs


def sync_jobs_from_adzuna(
    db: Session,
    query: str = "",
    location: str | None = None,
    pages: int = 2,
) -> dict:
    """
    Fetch jobs from Adzuna (up to `pages` pages) and upsert into stored_jobs.

    Returns a summary dict:
      { "fetched": int, "inserted": int, "updated": int }
    """
    all_jobs: list[dict] = []
    for page in range(1, pages + 1):
        try:
            page_jobs = search_jobs(query or "software engineer", location, page=page)
            all_jobs.extend(page_jobs)
        except Exception:
            # If a page fails (e.g. rate-limited), continue with whatever we have
            break

    inserted = 0
    updated = 0

    for job in all_jobs:
        external_id = str(job.get("id", ""))
        if not external_id:
            continue

        existing = (
            db.query(StoredJob)
            .filter(StoredJob.source == "adzuna", StoredJob.external_id == external_id)
            .first()
        )

        if existing is None:
            db.add(
                StoredJob(
                    source="adzuna",
                    external_id=external_id,
                    title=job.get("title", "Untitled"),
                    company=job.get("company", "Unknown"),
                    location=job.get("location"),
                    salary=job.get("salary"),
                    job_type=job.get("type"),
                    description=job.get("description"),
                    url=job.get("url"),
                    posted_at=job.get("postedAt"),
                    payload=json.dumps(job),
                )
            )
            inserted += 1
        else:
            # Update mutable fields on re-sync
            existing.title = job.get("title", existing.title)
            existing.company = job.get("company", existing.company)
            existing.location = job.get("location", existing.location)
            existing.salary = job.get("salary", existing.salary)
            existing.description = job.get("description", existing.description)
            existing.url = job.get("url", existing.url)
            existing.payload = json.dumps(job)
            updated += 1

    db.commit()
    return {"fetched": len(all_jobs), "inserted": inserted, "updated": updated}


def search_stored_jobs(
    db: Session,
    query: str = "",
    location: str | None = None,
    limit: int = 20,
    offset: int = 0,
) -> list[dict]:
    """
    Search locally cached jobs using ILIKE (case-insensitive substring match).
    Returns normalised job dicts (same shape as job_provider output).
    """
    q = db.query(StoredJob)

    if query.strip():
        pattern = f"%{query.strip()}%"
        q = q.filter(
            StoredJob.title.ilike(pattern)
            | StoredJob.company.ilike(pattern)
            | StoredJob.description.ilike(pattern)
        )

    if location and location.lower() not in ("all", ""):
        q = q.filter(StoredJob.location.ilike(f"%{location}%"))

    rows = q.order_by(StoredJob.fetched_at.desc()).offset(offset).limit(limit).all()

    return [_row_to_dict(row) for row in rows]


def _row_to_dict(row: StoredJob) -> dict:
    """Convert a StoredJob ORM row back to the standard job dict shape."""
    # Prefer full payload if available (richest data)
    if row.payload:
        try:
            job = json.loads(row.payload)
            job["source"] = row.source  # ensure source tag is present
            return job
        except (ValueError, TypeError):
            pass

    return {
        "id": row.external_id,
        "title": row.title,
        "company": row.company,
        "location": row.location or "Unspecified",
        "type": row.job_type or "Full-time",
        "salary": row.salary or "Salary not listed",
        "experience": "Not specified",
        "postedAt": row.posted_at or "",
        "description": row.description or "",
        "requirements": [],
        "about": "",
        "tags": [],
        "url": row.url,
        "matchScore": None,
        "source": row.source,
    }
